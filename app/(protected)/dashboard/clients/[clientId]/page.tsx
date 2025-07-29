"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


import { getClientDetails, updateClient, deleteClient } from "@/app/(protected)/dashboard/clients/api";

interface Props {
  params: Promise<{
    clientId: string;
  }>;
}

interface Transaction {
  id: string;
  transactionDate: string;
  description: string;
  extractedReference?: string;
  amount: number;
}

interface ClientWithTransactions {
  id: string;
  name: string;
  clientReference: string;
  expectedPaymentDay: number;
  transactions: Transaction[];
}

export default function ClientDetailPage(props: Props) {
  const [clientId, setClientId] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const resolveParams = async () => {
      const { clientId } = await props.params;
      setClientId(clientId);
    };
    resolveParams();
  }, [props.params]);

  const {
    data: client,
    isLoading,
    isError,
    error,
  } = useQuery<ClientWithTransactions, Error>({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const data = await getClientDetails(clientId);
      const allTransactions = data.transactions || [];

      // Filter transactions by matching description to clientReference
      const filteredTransactions = allTransactions.filter(
        (tx: any) =>
          tx.description?.toLowerCase().includes(data.clientReference.toLowerCase()) ||
          tx.extractedReference?.toLowerCase().includes(data.clientReference.toLowerCase())
      );

      return {
        ...data,
        expectedPaymentDay: data.expectedPaymentDay !== null ? Number(data.expectedPaymentDay) : 0,
        transactions: filteredTransactions.map((tx: any) => ({
          ...tx,
          amount: typeof tx.amount === "string" ? Number(tx.amount) : tx.amount,
        })),
      };
    },
    enabled: !!clientId,
  });

  const updateClientMutation = useMutation({
    mutationFn: updateClient,
    onSuccess: () => {
      toast.success("Client updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update client: ${error.message}`);
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      toast.success("Client deleted successfully!");
      // Optionally redirect or refresh
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete client: ${error.message}`);
    },
  });

  const [editableClient, setEditableClient] = useState<ClientWithTransactions | null>(null);

  useEffect(() => {
    if (client) setEditableClient(client);
  }, [client]);

  const handleSave = async () => {
    if (editableClient) {
      const { transactions, ...clientData } = editableClient;
      await updateClientMutation.mutateAsync({
        ...clientData,
        expectedPaymentDay:
          editableClient.expectedPaymentDay !== null
            ? editableClient.expectedPaymentDay.toString()
            : null,
      });
    }
  };

  // const handleDelete = async () => {
  //   if (clientId) {
  //     await deleteClientMutation.mutateAsync(clientId);
  //   }
  // };



const router = useRouter();

const handleDelete = async () => {
  const confirmed = window.confirm("Are you sure you want to delete this client?");
  if (!confirmed) return;

  await deleteClientMutation.mutateAsync(clientId);
  router.push("/dashboard/clients"); // or the correct route for your client list page
};


  if (isLoading) return <div>Loading client details...</div>;
  if (isError) return <div>Error fetching client: {error?.message || "Unknown error"}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Client Details</h1>

      {editableClient && (
        <Card>
          <CardContent className="space-y-4">
            <div>
              <label className="font-semibold">Client Name</label>
              <Input
                value={editableClient.name}
                disabled={!isEditing}
                onChange={(e) =>
                  setEditableClient({ ...editableClient, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="font-semibold">Reference</label>
              <Input
                value={editableClient.clientReference}
                disabled={!isEditing}
                onChange={(e) =>
                  setEditableClient({ ...editableClient, clientReference: e.target.value })
                }
              />
            </div>
            <div>
              <label className="font-semibold">Expected Payment Day</label>
              <select
                className="w-full border border-input rounded-md px-3 py-2 text-sm"
                value={editableClient.expectedPaymentDay}
                disabled={!isEditing}
                onChange={(e) =>
                  setEditableClient({
                    ...editableClient,
                    expectedPaymentDay: parseInt(e.target.value),
                  })
                }
              >
                {[1, 15, 25, 30].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              ) : (
                <Button onClick={handleSave} disabled={updateClientMutation.isPending}>
                  Save
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteClientMutation.isPending}
              >
                Delete Client
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-semibold mt-8">Payment History</h2>
        <div className="space-y-2 mt-4">
          {editableClient?.transactions.map((tx) => (
            <Card key={tx.id} className="bg-gray-50">
              <CardContent className="flex justify-between items-center">
                <div>
                  <p><strong>Date:</strong> {new Date(tx.transactionDate).toLocaleDateString()}</p>
                  <p><strong>Amount:</strong> R{tx.amount.toFixed(2)}</p>
                  <p><strong>Reference:</strong> {tx.extractedReference || tx.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
