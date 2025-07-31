import { z } from "zod";

const validPaymentDays = [1, 15, 25, 30] as const;

export const addClientFormSchema = z
  .object({
    name: z.string().min(2, { message: "Client name must be at least 2 characters long." }).max(255),
    clientReference: z.string().max(100).optional(), // Mark optional here, will validate in superRefine
    expectedPaymentDay: z.coerce
      .number({
        invalid_type_error: "Expected payment day must be a number.",
        required_error: "Expected payment day is required.",
      })
      .refine((day) => validPaymentDays.includes(day as typeof validPaymentDays[number]), {
        message: `Expected payment day must be one of the following: ${validPaymentDays.join(", ")}.`,
      })
      .nullable()
      .optional(),
    autoGenerateRef: z.boolean(), // <-- Add this to receive toggle state
  })
  .superRefine((data, ctx) => {
    if (!data.autoGenerateRef && (!data.clientReference || data.clientReference.trim() === "")) {
      ctx.addIssue({
        path: ["clientReference"],
        code: z.ZodIssueCode.custom,
        message: "Client reference is required when auto-generate is off.",
      });
    }
  });

export type AddClientFormValues = z.infer<typeof addClientFormSchema>;
