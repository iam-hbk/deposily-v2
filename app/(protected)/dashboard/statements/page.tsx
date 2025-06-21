import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { statements } from "@/db/schema/app";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import StatementsTable from "./components/statements-table";
import { SelectStatementWithTransactionsWithIDsOnly } from "./api";

// Server-side function for prefetching
async function getStatementsServer(): Promise<SelectStatementWithTransactionsWithIDsOnly[]> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user || !session.user.id) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    const userStatements = await db.query.statements.findMany({
      where: eq(statements.userId, userId),
      orderBy: [desc(statements.uploadDate)],
      with: {
        transactions: {
          columns: {
            id: true,
          },
        },
      },
    });

    return userStatements as SelectStatementWithTransactionsWithIDsOnly[];
  } catch (error) {
    console.error("Error fetching statements:", error);
    throw new Error("Failed to fetch statements");
  }
}

export default async function StatementsPage() {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ["statements"],
      queryFn: getStatementsServer,
    });
    console.log("Statements prefetched successfully on server.");
  } catch (error) {
    console.error("Error prefetching statements on server:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StatementsTable />
    </HydrationBoundary>
  );
}
