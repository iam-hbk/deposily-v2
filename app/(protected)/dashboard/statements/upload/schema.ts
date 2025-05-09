import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "text/csv"];

export const uploadStatementSchema = z.object({
  statement: z
    .custom<File>((file) => file instanceof File, {
      message: "Please select a file",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size should be less than 10MB`,
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Only .pdf and .csv files are accepted",
    }),
});

export type UploadStatementSchema = z.infer<typeof uploadStatementSchema>;

export type UploadStatementResponse = {
  id: string;
  filename: string;
  status: "processing" | "completed" | "failed";
}; 