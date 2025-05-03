import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

// This would typically be fetched from your database based on the statementId
const mockTransactions = [
  {
    id: "1",
    date: "2023-05-15",
    description: "Salary Payment",
    amount: 2500.0,
  },
  {
    id: "2",
    date: "2023-05-20",
    description: "Refund - Online Store",
    amount: 45.99,
  },
  {
    id: "3",
    date: "2023-05-25",
    description: "Interest Payment",
    amount: 12.34,
  },
]

export default function StatementDetailPage({ params }: { params: { statementId: string } }) {
  const { statementId } = params

  // Mock statement data - would be fetched from database
  const statement = {
    id: statementId,
    filename: "May_2023_Statement.pdf",
    uploadedAt: "2023-06-01T12:00:00Z",
    status: "Processed",
    transactionCount: mockTransactions.length,
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/statements">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{statement.filename}</h1>
          </div>
          <p className="text-muted-foreground">Uploaded on {new Date(statement.uploadedAt).toLocaleDateString()}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statement Details</CardTitle>
          <CardDescription>Information about this bank statement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Filename</p>
              <p className="text-lg font-medium">{statement.filename}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="text-lg font-medium">{statement.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Credit Transactions</p>
              <p className="text-lg font-medium">{statement.transactionCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credit Transactions</CardTitle>
          <CardDescription>All credit transactions extracted from this statement</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="text-right font-medium">${transaction.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
