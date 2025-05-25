import { z } from "zod";

const validPaymentDays = [1, 15, 25, 30] as const;

export const addClientFormSchema = z.object({
  name: z.string().min(2, { message: "Client name must be at least 2 characters long." }).max(255),
  clientReference: z.string().min(1, { message: "Client reference is required." }).max(100),
  expectedPaymentDay: z.coerce // Coerce to number before validation
    .number({
      invalid_type_error: "Expected payment day must be a number.",
      required_error: "Expected payment day is required."
    })
    .refine((day) => validPaymentDays.includes(day as typeof validPaymentDays[number]), {
      message: `Expected payment day must be one of the following: ${validPaymentDays.join(", ")}.`,
    })
    .nullable() // Allow it to be optional, or remove .nullable() if it's required
    .optional(), // Making it optional to match the DB schema where it can be null
});

export type AddClientFormValues = z.infer<typeof addClientFormSchema>; 