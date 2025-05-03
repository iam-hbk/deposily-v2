"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUp, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function UploadStatementPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadStatus("idle")
      setErrorMessage("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setUploadStatus("error")
      setErrorMessage("Please select a file to upload")
      return
    }

    // Check file type
    const allowedTypes = ["application/pdf", "text/csv"]
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus("error")
      setErrorMessage("Only PDF and CSV files are supported")
      return
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      setUploadStatus("error")
      setErrorMessage("File size exceeds the 10MB limit")
      return
    }

    setIsUploading(true)

    try {
      // This is where you would implement the actual file upload logic
      // For now, we'll simulate the process

      // 1. Upload the file
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 2. Validate with AI
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 3. Extract transactions
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUploadStatus("success")

      // Redirect to statements page after a short delay
      setTimeout(() => {
        router.push("/dashboard/statements")
      }, 2000)
    } catch (error) {
      console.error("Upload failed:", error)
      setUploadStatus("error")
      setErrorMessage("An error occurred during upload. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Statement</h1>
        <p className="text-muted-foreground">Upload a bank statement to extract credit transactions</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Upload Bank Statement</CardTitle>
            <CardDescription>Upload a PDF or CSV file of your bank statement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {uploadStatus === "success" ? (
              <div className="flex flex-col items-center justify-center py-6">
                <CheckCircle className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-medium">Upload Successful!</h3>
                <p className="text-center text-muted-foreground">Your statement has been processed successfully.</p>
              </div>
            ) : (
              <>
                {uploadStatus === "error" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="statement">Bank Statement</Label>
                  <div className="grid w-full items-center gap-1.5">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="statement"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileUp className="w-8 h-8 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PDF or CSV (MAX. 10MB)</p>
                        </div>
                        <Input
                          id="statement"
                          type="file"
                          accept=".pdf,.csv"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    {file && (
                      <p className="text-sm text-muted-foreground">
                        Selected file: <span className="font-medium">{file.name}</span> (
                        {(file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Processing Steps:</h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 pl-2">
                    <li>Upload your bank statement file</li>
                    <li>AI validates the statement format</li>
                    <li>Extract credit transactions automatically</li>
                    <li>View and analyze your transactions</li>
                  </ol>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/statements")}
              disabled={isUploading}
            >
              Cancel
            </Button>
            {uploadStatus !== "success" && (
              <Button type="submit" disabled={!file || isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Upload & Process"
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
