import React from 'react';

export default function ClientDetailPage({ params }: { params: { clientId: string } }) {
  return (
    <div>
      <h1>Client Details</h1>
      <p>Client ID: {params.clientId}</p>
      {/* Client details, payment history, and actions will go here */}
    </div>
  );
} 