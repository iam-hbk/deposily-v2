import { UploadStatementResponse } from "./schema";

type UploadStatementError = {
  error: string;
  reason: string;
};

export async function uploadStatement(
  file: File,
): Promise<UploadStatementResponse> {
  const formData = new FormData();
  formData.append("statement", file);

  const response = await fetch("/api/statements/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let error =
      response.status === 404 && `Page ${response.statusText}`.toUpperCase();
    if (!error) {
      const errorData = (await response.json()) as UploadStatementError;
      error =
        `${errorData.error} ${errorData.reason ? `- ${errorData.reason}` : ""}` ||
        "Something went wrong";
    }
    throw new Error(error);
  }

  return response.json();
}
