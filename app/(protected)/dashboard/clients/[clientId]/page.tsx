import React from 'react';
interface Props {
  params: Promise<{
    clientId: string;
  }>;
}
export default async function ClientDetailPage(props: Props) {

  const {clientId} = await props.params

  return (
    <div>
      <h1>Client Details</h1>
      <p>Client ID: {clientId}</p>
      {/* Client details, payment history, and actions will go here */}
    </div>
  );
} 