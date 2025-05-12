"use client"; // Make it a client component

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, Eye, MoreHorizontal, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Define the type for a statement, including nested transactions for count
// This should ideally match the structure returned by your API
interface Statement {
  id: string;
  filename: string;
  uploadDate: string; // Or Date, depending on what your API returns and how you process it
  processingStatus: string;
  transactions: { id: string }[]; // Array of transactions, we only need id for count
  // Add other statement properties if needed
}

// Function to fetch statements
async function getStatements(): Promise<Statement[]> {
  const response = await fetch("/api/statements");
  if (!response.ok) {
    // Consider more specific error handling based on response status
    throw new Error("Failed to fetch statements");
  }
  return response.json();
}

export default function StatementsPage() {
  const { data: statements, isLoading, error, refetch } = useQuery<Statement[], Error>({
    queryKey: ["statements"],
    queryFn: getStatements,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-10 w-48" />
            <Skeleton className="mt-2 h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-5 w-1/5" />
                  <Skeleton className="h-5 w-1/6" />
                  <Skeleton className="h-5 w-1/6" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Statements</h1>
            <p className="text-muted-foreground">
              View and manage your uploaded bank statements
            </p>
          </div>
          <Link href="/dashboard/statements/upload">
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Statement
            </Button>
          </Link>
        </div>
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error Loading Statements
            </CardTitle>
            <CardDescription className="text-destructive/80">
              There was an issue retrieving your statements. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive/90 mb-4">{error.message}</p>
            <Button onClick={() => refetch()} className="gap-2">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statements</h1>
          <p className="text-muted-foreground">
            View and manage your uploaded bank statements
          </p>
        </div>
        <Link href="/dashboard/statements/upload">
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Statement
          </Button>
        </Link>
      </div>

      {statements && statements.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Statements</CardTitle>
            <CardDescription>
              You haven't uploaded any bank statements yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-primary/10 mb-4 rounded-full p-6">
                <Image
                  src="/logo-no-text.svg"
                  alt="deposily"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
              </div>
              <h3 className="mb-2 text-xl font-medium">No statements found</h3>
              <p className="text-muted-foreground mb-6 text-center">
                Upload your first bank statement to get started
              </p>
              <Link href="/dashboard/statements/upload">
                <Button size="lg" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Statement
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Statements</CardTitle>
            <CardDescription>
              Manage your uploaded bank statements and view extracted
              transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statements && statements.map((statement) => (
                  <TableRow key={statement.id}>
                    <TableCell className="font-medium">
                      {statement.filename}
                    </TableCell>
                    <TableCell>
                      {formatDate(statement.uploadDate)}
                    </TableCell>
                    <TableCell className="capitalize">{statement.processingStatus}</TableCell>
                    <TableCell>{statement.transactions.length}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/dashboard/statements/${statement.id}`}>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </Link>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
