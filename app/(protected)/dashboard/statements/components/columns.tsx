"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import { SelectStatementWithTransactionsWithIDsOnly } from "../api";

export const columns: ColumnDef<SelectStatementWithTransactionsWithIDsOnly>[] = [
  {
    accessorKey: "filename",
    header: "Filename",
    cell: ({ row }) => (
      <Link href={`/dashboard/statements/${row.original.id}`} className="hover:underline">
        {row.getValue("filename")}
      </Link>
    ),
  },
  {
    accessorKey: "uploadDate",
    header: "Upload Date",
    cell: ({ row }) => formatDate(row.original.uploadDate),
  },
  {
    accessorKey: "processingStatus",
    header: "Status",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.processingStatus}</span>
    ),
  },
  {
    accessorKey: "transactions",
    header: "Transactions",
    cell: ({ row }) => row.original.transactions.length,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const statement = row.original;
      return (
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
      );
    },
  },
]; 