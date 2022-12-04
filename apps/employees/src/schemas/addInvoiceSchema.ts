import { z } from "zod";

const addInvoiceSchema = z
  .object({
    createdBy: z.string().email(),
    name: z.string(),
    issueDate: z.string().or(z.date()),
    applicationId: z.string(),
    declaredNutCoal: z.preprocess(
      (a) => Number(a as string),
      z.number().optional(),
    ),
    declaredEcoPeaCoal: z.preprocess(
      (a) => Number(a as string),
      z.number().optional(),
    ),
  })
  .refine(
    ({ declaredEcoPeaCoal, declaredNutCoal, ...rest }) =>
      (declaredEcoPeaCoal || declaredNutCoal) &&
      Object.values(rest).every((val) =>
        typeof val !== undefined ? !!val : true,
      ),
    {
      message: "Przynajmniej jedna wartość musi być wypełniona",
      path: ["declaredEcoPeaCoal", "declaredNutCoal"],
    },
  );

export type AddInvoiceSchemaType = z.infer<typeof addInvoiceSchema>;

export default addInvoiceSchema;
