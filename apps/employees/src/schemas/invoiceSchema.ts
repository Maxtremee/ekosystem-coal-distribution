import { z } from "zod";

export const baseAddInvoiceSchema = z.object({
  name: z.string(),
  issueDate: z.string().or(z.date()),
  declaredNutCoal: z.coerce.number().nonnegative().optional(),
  declaredEcoPeaCoal: z.coerce.number().nonnegative().optional(),
});

export const frontendAddInvoiceSchema = baseAddInvoiceSchema.refine(
  ({ declaredEcoPeaCoal, declaredNutCoal }) =>
    declaredEcoPeaCoal || declaredNutCoal,
  {
    message: "Przynajmniej jedna wartość musi być wypełniona",
    path: ["declaredEcoPeaCoal", "declaredNutCoal"],
  },
);

export type FrontendAddInvoiceSchemaType = z.infer<
  typeof frontendAddInvoiceSchema
>;

export default frontendAddInvoiceSchema;
