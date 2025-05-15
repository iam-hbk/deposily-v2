import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { statements } from "@/db/schema/app";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

type Params = Promise<{ statementId: string }>;

export async function GET(_request: Request, segmentData: { params: Params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { statementId } = await segmentData.params;

    // Get the statement
    const statement = await db.query.statements.findFirst({
      where: eq(statements.id, statementId),
      with: {
        transactions: true,
      },
    });

    if (!statement) {
      return new NextResponse("Statement not found", { status: 404 });
    }

    // Check if the statement belongs to the user
    if (statement.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    return NextResponse.json(statement);
  } catch (error) {
    console.error("Error fetching statement:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
