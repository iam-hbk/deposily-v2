"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getStatements,
  SelectStatementWithTransactionsWithIDsOnly,
} from "../api";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "./columns";

const StatementsTable = () => {
  const router = useRouter();
  const {
    data: statements,
    isLoading,
    error,
    refetch,
  } = useQuery<SelectStatementWithTransactionsWithIDsOnly[], Error>({
    queryKey: ["statements"],
    queryFn: getStatements,
  });

  const table = useReactTable({
    data: statements ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
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
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Loading Statements
            </CardTitle>
            <CardDescription className="text-destructive/80">
              There was an issue retrieving your statements. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive/90 mb-4 text-sm">{error.message}</p>
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
              You haven&apos;t uploaded any bank statements yet
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        onClick={(e) => {
                          if (e.target instanceof HTMLElement && e.target.closest('a, button')) {
                            return;
                          }
                          router.push(`/dashboard/statements/${row.original.id}`);
                        }}
                        className="cursor-pointer"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatementsTable;
