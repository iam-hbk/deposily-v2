import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { db } from "@/db/drizzle";
import {
  statements,
  transactions,
  insertStatementSchema,
  insertTransactionSchema,
} from "@/db/schema/app";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Schema for AI response
const aiResponseSchema = z.object({
  isValidStatement: z
    .boolean()
    .describe("Whether this is a valid bank statement"),
  validationMessage: z.string().describe("Reason if statement is invalid"),
  transactions: z
    .array(
      insertTransactionSchema.pick({
        transactionDate: true,
        description: true,
        amount: true,
        extractedReference: true,
      }),
    )
    .optional()
    .describe("Transactions extracted from the statement"),
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const file = formData.get("statement") as File;
    const userId = session?.user.id;

    console.log("userId", userId);
    console.log("file", file);

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "A Bank Statement is required" },
        { status: 400 },
      );
    }

    // Check file type
    const allowedTypes = ["application/pdf", "text/csv"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF and CSV files are supported" },
        { status: 400 },
      );
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 },
      );
    }

    // Create statement record using the inferred schema
    const statementData = insertStatementSchema.parse({
      userId,
      filename: file.name,
      filepath: "", // You would store the actual file path here
      processingStatus: "processing",
    });

    const [statement] = await db
      .insert(statements)
      .values(statementData)
      .returning();

    // Analyze and extract transactions with AI
    const result = await generateObject({
      model: google("gemini-2.0-flash-001"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this bank statement and perform two tasks:
              1. Validate if this is a genuine bank statement by looking for typical patterns like transaction dates, amounts, and banking information.
              2. If valid, extract transactions with their dates, descriptions, amounts, and any reference numbers. 
              Important extraction rules:
              - Dates must be in YYYY-MM-DD format
              - Amounts must be numeric (positive for credits, negative for debits)
              - Only include transactions that credit the account (positive amounts).
              - Extract any reference numbers found in transactions
              - Ensure descriptions are clear and cleaned of any special characters
              Format the response according to the provided schema.`,
            },
            {
              type: "file",
              data: await file.arrayBuffer(),
              mimeType: file.type,
            },
          ],
        },
      ],
      schema: aiResponseSchema,
      maxRetries: 2,
    });

    // Update statement status based on validation
    if (!result.object.isValidStatement) {
      await db
        .update(statements)
        .set({
          processingStatus: "failed",
          validationDetails: { error: result.object.validationMessage },
        })
        .where(eq(statements.id, statement.id));

      return NextResponse.json(
        {
          error: "Invalid statement",
          reason: result.object.validationMessage,
        },
        { status: 400 },
      );
    }

    // Insert transactions using the inferred schema
    if (result.object.transactions && result.object.transactions.length > 0) {
      const transactionsData = result.object.transactions.map((t) =>
        insertTransactionSchema.parse({
          statementId: statement.id,
          transactionDate: new Date(t.transactionDate),
          description: t.description,
          amount: t.amount,
          extractedReference: t.extractedReference,
        }),
      );

      await db.insert(transactions).values(transactionsData);
    }

    // Update statement status to completed
    await db
      .update(statements)
      .set({
        processingStatus: "completed",
        validationDetails: { success: true },
      })
      .where(eq(statements.id, statement.id));

    return NextResponse.json({
      success: true,
      statementId: statement.id,
      transactionCount: result.object.transactions?.length || 0,
    });
  } catch (error: unknown) {
    console.error("Error processing statement:", error);

    let errorMessage = "Failed to process statement";
    const statusCode = 500;

    if (error instanceof Error && error.message?.includes("API key")) {
      errorMessage = "API configuration error";
    } else if (error instanceof Error && error.message?.includes("timeout")) {
      errorMessage = "Processing timeout";
    } else if (error instanceof Error && error.message?.includes("schema")) {
      errorMessage = "Data extraction error";
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
