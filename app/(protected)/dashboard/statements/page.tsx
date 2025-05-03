import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Eye, MoreHorizontal } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// This would typically come from your database
const statements: any[] = []

export default function StatementsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statements</h1>
          <p className="text-muted-foreground">View and manage your uploaded bank statements</p>
        </div>
        <Link href="/dashboard/statements/upload">
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Statement
          </Button>
        </Link>
      </div>

      {statements.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Statements</CardTitle>
            <CardDescription>You haven't uploaded any bank statements yet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 rounded-full bg-primary/10 p-6">
                <Image src="/logo-no-text.svg" alt="deposily" width={40} height={40} className="h-10 w-10" />
              </div>
              <h3 className="mb-2 text-xl font-medium">No statements found</h3>
              <p className="mb-6 text-center text-muted-foreground">Upload your first bank statement to get started</p>
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
            <CardDescription>Manage your uploaded bank statements and view extracted transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statements.map((statement) => (
                  <TableRow key={statement.id}>
                    <TableCell className="font-medium">{statement.filename}</TableCell>
                    <TableCell>{new Date(statement.uploadedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{statement.status}</TableCell>
                    <TableCell>{statement.transactionCount}</TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
