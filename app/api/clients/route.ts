import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { clients, transactions, insertClientSchema } from "@/db/schema/app";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const apiAddClientSchema = insertClientSchema.omit({ 
  id: true, // ID is auto-generated
  userId: true, // userId will be taken from session
  createdAt: true, // auto-generated
  updatedAt: true, // auto-generated
}).extend({
  // Ensure expectedPaymentDay is treated as number or null if coming from JSON
  expectedPaymentDay: z.union([z.number(), z.null()]).optional()
});

export async function GET(_request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const userClients = await db
      .select()
      .from(clients)
      .where(eq(clients.userId, userId));

    if (!userClients || userClients.length === 0) {
      return NextResponse.json([]);
    }

    const clientsWithPaymentStatus = await Promise.all(
      userClients.map(async (client) => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const clientTransactionsThisMonth = await db
          .select({ count: sql<number>`count(*)` }) // More efficient to count in DB
          .from(transactions)
          .where(
            and(
              eq(transactions.clientId, client.id),
              gte(transactions.transactionDate, startOfMonth),
              lte(transactions.transactionDate, endOfMonth)
            )
          );
          
        // The result of count(*) is usually a string, so parse it or ensure it is a number
        const paymentCount = clientTransactionsThisMonth[0]?.count || 0;

        return {
          ...client,
          hasPaidThisMonth: paymentCount > 0,
        };
      })
    );

    return NextResponse.json(clientsWithPaymentStatus);
  } catch (error) {
    console.error("Error fetching clients:", error);
    let errorMessage = "Failed to fetch clients";
    // Avoid sending detailed error to client in prod
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST Handler for adding a new client
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const reqBody = await request.json();
    const validation = apiAddClientSchema.safeParse(reqBody);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.flatten() }, { status: 400 });
    }

    const { name, clientReference, expectedPaymentDay } = validation.data;

    // Check for duplicate clientReference for the same user (application-level check)
    const existingClient = await db.query.clients.findFirst({
      where: and(eq(clients.userId, userId), eq(clients.clientReference, clientReference))
    });

    if (existingClient) {
      return NextResponse.json({ error: "Client reference already exists for this user." }, { status: 409 }); // 409 Conflict
    }

    const newClientData = {
      userId,
      name,
      clientReference,
      // Convert number to string for Drizzle numeric type, keep null as is
      expectedPaymentDay: typeof expectedPaymentDay === 'number' ? expectedPaymentDay.toString() : null,
    };

    // Drizzle expects all fields defined in the table for insert, 
    // unless they have default values or are nullable and you explicitly pass undefined.
    // insertClientSchema helps here if it includes all necessary fields.
    // Here, we are constructing the object manually, ensure all `notNull` fields without defaults are present.
    
    const [createdClient] = await db.insert(clients).values(newClientData).returning();

    return NextResponse.json(createdClient, { status: 201 });

  } catch (error) {
    console.error("Error adding client:", error);
    // Handle potential database errors, e.g., unique constraint violations if not caught above
    if (error instanceof Error && error.message.includes("unique constraint")) {
        return NextResponse.json({ error: "A client with this reference might already exist or another unique constraint was violated." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to add client" }, { status: 500 });
  }
} 