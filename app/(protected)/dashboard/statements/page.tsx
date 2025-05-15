import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getStatements } from "./api";
import StatementsTable from "./components/statements-table";

export default async function StatementsPage() {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ["statements"],
      queryFn: getStatements,
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
