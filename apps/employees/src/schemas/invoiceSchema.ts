import { z } from "zod";

export const baseAddInvoiceSchema = z.object({
  invoiceId: z.string().min(1),
  applicationId: z.string().optional(),
  issueDate: z.coerce.date(),
  amount: z.coerce.number().nonnegative(),
  additionalInformation: z.string().optional(),
});

export type AddInvoiceSchemaType = z.infer<typeof baseAddInvoiceSchema>;

export default baseAddInvoiceSchema;
