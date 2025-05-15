import { SelectStatementWithTransactions } from "@/db/schema/app";

export type SelectStatementWithTransactionsWithIDsOnly = Omit<
  SelectStatementWithTransactions,
  "transactions"
> & {
  transactions: {
    id: string;
  }[];
};
// Function to fetch statements
export async function getStatements(): Promise<
  SelectStatementWithTransactionsWithIDsOnly[]
> {
  const response = await fetch("/api/statements");
  if (!response.ok) {
    // Consider more specific error handling based on response status
    throw new Error("Failed to fetch statements");
  }
  return response.json();
}
