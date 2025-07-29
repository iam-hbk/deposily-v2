import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { clients, transactions } from "@/db/schema/app";
import { eq, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

type Params = Promise<{ clientId: string }>;

export async function GET(_request: Request, segmentData: { params: Params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { clientId } = await segmentData.params;

    const client = await db.query.clients.findFirst({
      where: eq(clients.id, clientId),
    });

    if (!client) {
      return new NextResponse("Client not found", { status: 404 });
    }

    if (client.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const matchingTransactions = await db
      .select()
      .from(transactions)
      .where(
        or(
          ilike(transactions.description, `%${client.clientReference}%`),
          ilike(transactions.extractedReference, `%${client.clientReference}%`)
        )
      );

    return NextResponse.json({
      ...client,
      transactions: matchingTransactions,
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request, segmentData: { params: Params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { clientId } = await segmentData.params;
    const body = await request.json();

    // Update the client
    await db
      .update(clients)
      .set({
        name: body.name,
        clientReference: body.clientReference,
        expectedPaymentDay: body.expectedPaymentDay,
        updatedAt: new Date(),
      })
      .where(eq(clients.id, clientId));

    return NextResponse.json({ message: "Client updated successfully" });
  } catch (error) {
    console.error("Error updating client:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(_request: Request, segmentData: { params: Params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { clientId } = await segmentData.params;

    await db.delete(clients).where(eq(clients.id, clientId));

    return NextResponse.json({ message: "Client deleted successfully" });

  } catch (error) {
    console.error("Error deleting client:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
