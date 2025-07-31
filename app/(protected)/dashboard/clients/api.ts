// import { ClientRow } from "./components/columns";
import { SelectClient, SelectClientWithTransactions } from "@/db/schema/app";
import { AddClientFormValues } from "./components/add-client-form-schema"; // Import form values type

// type ApiClientResponse = Omit<
//   SelectClient,
//   "createdAt" | "updatedAt" | "expectedPaymentDay"
// > & {
//   createdAt: string;
//   updatedAt: string;
//   expectedPaymentDay: string | null;
//   hasPaidThisMonth: boolean;
// };

export async function getClients(): Promise<SelectClientWithTransactions[]> {
  const response = await fetch("/api/clients");
  if (!response.ok) {
    // Consider more specific error handling based on response status
    throw new Error("Failed to fetch clients");
  }
  return response.json();
}

// Function to add a new client
export async function addClient(
  clientData: AddClientFormValues,
): Promise<SelectClient> {
  try {
    const response = await fetch(`/api/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    });

    const responseData = await response.json(); // Always try to parse JSON

    if (!response.ok) {
      // Log more detailed error if possible from responseData
      console.error(
        `Error adding client: ${response.status} ${response.statusText}`,
        responseData,
      );
      throw new Error(
        responseData.error || responseData.message || "Failed to add client",
      );
    }

    // Assuming the API returns the created client object matching SelectClient type
    // Potentially, dates might be strings and need conversion, but for now, trust API contract.
    return responseData as SelectClient;
  } catch (error) {
    console.error("Error in addClient utility:", error);
    // Rethrow the error so the calling component (e.g., form) can handle it
    throw error;
  }
}

// Get a single client with transactions
export async function getClientDetails(clientId: string): Promise<SelectClientWithTransactions> {
  const response = await fetch(`/api/clients/${clientId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch client details");
  }
  return response.json();
}

// Update an existing client
export async function updateClient(client: Partial<SelectClientWithTransactions> & { id: string }) {
  const response = await fetch(`/api/clients/${client.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(client),
  });

  const responseData = await response.json();

  if (!response.ok) {
    console.error("Update error:", responseData);
    throw new Error(responseData.message || "Failed to update client");
  }

  return responseData as SelectClientWithTransactions;
}

// Delete a client
export async function deleteClient(clientId: string) {
  const response = await fetch(`/api/clients/${clientId}`, {
    method: "DELETE",
  });

  const responseData = await response.json();

  if (!response.ok) {
    console.error("Delete error:", responseData);
    throw new Error(responseData.message || "Failed to delete client");
  }

  return responseData;
}

