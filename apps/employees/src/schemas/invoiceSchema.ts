import { z } from "zod";

export const baseAddInvoiceSchema = z.object({
  invoiceId: z.string(),
  issueDate: z.coerce.date(),
  paidForCoal: z.coerce.number().nonnegative(),
  additionalInformation: z.string().optional(),
});

export type AddInvoiceSchemaType = z.infer<typeof baseAddInvoiceSchema>;

export default baseAddInvoiceSchema;
