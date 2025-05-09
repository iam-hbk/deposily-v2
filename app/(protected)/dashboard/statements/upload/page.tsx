"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Loader } from "lucide-react";
import { uploadStatement } from "./api";
import { uploadStatementSchema, type UploadStatementSchema } from "./schema";
import { FileUpload } from "@/components/file-upload";
import { toast } from "sonner";

export default function UploadStatementPage() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadStatementSchema>({
    resolver: zodResolver(uploadStatementSchema),
  });

  const uploadMutation = useMutation({
    mutationFn: (data: UploadStatementSchema) =>
      uploadStatement(data.statement),
    onSuccess: (data) => {
      // Redirect to the statement detail page after successful upload
      // router.push(`/dashboard/statements/${data.id}`);
      toast.success("Statement uploaded successfully", {
        description: "You can now view your statement",
        duration: 15000,
        action: {
          label: "View Statement",
          onClick: () => router.push(`/dashboard/statements/${data.id}`),
        },
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to upload statement", {
        description: error.message,
        duration: 15000,
      });
    },
  });

  const onSubmit = handleSubmit((data) => {
    uploadMutation.mutate(data);
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Statement</h1>
        <p className="text-muted-foreground">
          Upload a bank statement to extract credit transactions
        </p>
      </div>

      <Card className="mx-auto max-w-2xl">
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle>Upload Bank Statement</CardTitle>
            <CardDescription>
              Upload a PDF or CSV file of your bank statement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {uploadMutation.isSuccess ? (
              <div className="flex flex-col items-center justify-center py-6">
                <CheckCircle className="text-primary mb-4 h-12 w-12" />
                <h3 className="mb-2 text-xl font-medium">Upload Successful!</h3>
                <p className="text-muted-foreground text-center">
                  Your statement has been uploaded and is being processed.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/dashboard/statements/${uploadMutation.data.id}`,
                    )
                  }
                >
                  View Statements
                </Button>
              </div>
            ) : (
              <>
                <Controller
                  name="statement"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FileUpload
                      accept=".pdf,.csv"
                      maxSize={10 * 1024 * 1024} // 10MB
                      onChange={onChange}
                      value={value}
                      error={errors.statement?.message}
                      disabled={uploadMutation.isPending}
                    />
                  )}
                />

                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Processing Steps:</h3>
                  <ol className="text-muted-foreground list-inside list-decimal space-y-1 pl-2 text-sm">
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
              disabled={uploadMutation.isPending}
            >
              Cancel
            </Button>
            {!uploadMutation.isSuccess && (
              <Button type="submit" disabled={uploadMutation.isPending}>
                {uploadMutation.isPending ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
