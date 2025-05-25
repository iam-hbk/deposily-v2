"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// For now, we'll use the SelectClient type from our schema.
// We might need to extend this later to include payment status.
import { SelectClient } from "@/db/schema/app"; // Assuming this path is correct

export type ClientRow = SelectClient & {
  // We'll add payment status here later if needed for direct display logic
  // For now, we can compute it during data fetching or cell rendering
  hasPaidThisMonth?: boolean; 
};

export const columns: ColumnDef<ClientRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "clientReference",
    header: "Client Reference",
  },
  {
    accessorKey: "expectedPaymentDay",
    header: "Expected Payment Day",
    cell: ({ row }) => {
      const day = row.original.expectedPaymentDay;
      return day ? day : <span className="text-muted-foreground">N/A</span>;
    }
  },
  {
    id: "paymentStatus",
    header: "Payment Status (Current Month)",
    cell: ({ row }) => {
      // Placeholder for payment status logic
      // This will be updated once we fetch transaction data
      const hasPaid = row.original.hasPaidThisMonth; // This will be populated later

      if (hasPaid === undefined) {
        return <Badge variant="outline">Loading...</Badge>; // Or some other indicator
      }
      
      return hasPaid ? <Badge variant="default">Paid</Badge> : <Badge variant="destructive">Pending</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(client.id)}
            >
              Copy client ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/clients/${client.id}`}>View/Edit Client</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              {/* Add delete functionality here */}
              Delete Client
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 