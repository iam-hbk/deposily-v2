"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { use } from "react";
import { SelectStatementWithTransactions } from "@/db/schema/app";
// Function to fetch statement by ID
async function getStatementWithTransactions(
  statementId: string,
): Promise<SelectStatementWithTransactions> {
  const response = await fetch(`/api/statements/${statementId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch statement");
  }
  return response.json();
}

export default function StatementDetailPage(props: {
  params: Promise<{ statementId: string }>;
}) {
  const params = use(props.params);
  const { statementId } = params;

  // Fetch statement data using React Query
  const {
    data: statement,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["statement", statementId],
    queryFn: () => getStatementWithTransactions(statementId),
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/statements">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <Skeleton className="h-8 w-64" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Statement Details</CardTitle>
            <CardDescription>
              Information about this bank statement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton className="mb-2 h-4 w-32" />
                  <Skeleton className="h-6 w-40" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credit Transactions</CardTitle>
            <CardDescription>
              All credit transactions extracted from this statement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/statements">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Error</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">
              Failed to load statement details. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!statement) {
    return <div>No statement found</div>;
  }

  // Calculate the number of credit transactions (positive amounts)
  const creditTransactions = statement.transactions.filter(
    (transaction) => parseFloat(transaction.amount) > 0,
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/statements">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              {statement.filename}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Uploaded on {formatDate(statement.uploadDate)}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statement Details</CardTitle>
          <CardDescription>
            Information about this bank statement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Filename
              </p>
              <p className="text-lg font-medium">{statement.filename}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Status
              </p>
              <p className="text-lg font-medium capitalize">
                {statement.processingStatus}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Credit Transactions
              </p>
              <p className="text-lg font-medium">{creditTransactions.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credit Transactions</CardTitle>
          <CardDescription>
            All credit transactions extracted from this statement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount (in Rands)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creditTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {formatDate(transaction.transactionDate)}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="text-right font-medium">
                    {parseFloat(transaction.amount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {creditTransactions.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-muted-foreground py-4 text-center"
                  >
                    No credit transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
