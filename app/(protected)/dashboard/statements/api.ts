import { SelectStatementWithTransactions } from "@/db/schema/app";

export type SelectStatementWithTransactionsWithIDsOnly = Omit<
  SelectStatementWithTransactions,
  "transactions"
> & {
  transactions: {
    id: string;
  }[];
};

// Client-side function to fetch statements via API
export async function getStatements(): Promise<
  SelectStatementWithTransactionsWithIDsOnly[]
> {
  const response = await fetch("/api/statements");
  if (!response.ok) {
    throw new Error("Failed to fetch statements");
  }
  return response.json();
}
