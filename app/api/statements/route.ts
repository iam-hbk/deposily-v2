import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { statements } from "@/db/schema/app";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    const userStatements = await db.query.statements.findMany({
      where: eq(statements.userId, userId),
      orderBy: [desc(statements.uploadDate)],
      with: {
        transactions: {
          columns: {
            id: true, // Only need to count, so fetching just id is efficient
          },
        },
      },
    });

    return NextResponse.json(userStatements);
  } catch (error) {
    console.error("Error fetching statements:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 