import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ClientDataTable } from "./components/client-data-table"; // ClientRow type is now implicitly handled by getClients
import { getClients } from "./api"; // Import the refactored getClients function

export default async function ClientsPage() {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["clients"],
      queryFn: getClients,
    });
    console.log("Clients prefetched successfully on server.");
  } catch (error) {
    console.error("Error prefetching clients on server:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container mx-auto py-10">
        <h1 className="mb-6 text-3xl font-bold">Clients</h1>
        <ClientDataTable />
      </div>
    </HydrationBoundary>
  );
}
