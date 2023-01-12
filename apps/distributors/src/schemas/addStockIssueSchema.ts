import { z } from "zod";

const baseAddStockIssueSchema = z.object({
  additionalInformation: z.string().optional(),
  nutCoalIssued: z.coerce.number().nonnegative().optional(),
  ecoPeaCoalIssued: z.coerce.number().nonnegative().optional(),
});

export const backendAddStockIssueSchema = baseAddStockIssueSchema.extend({
  invoiceId: z.string(),
});

export const frontendAddStockIssueSchema = baseAddStockIssueSchema.refine(
  ({ nutCoalIssued, ecoPeaCoalIssued }) =>
    nutCoalIssued !== 0 || ecoPeaCoalIssued !== 0,
  {
    message: "Przynajmniej jedna wartość musi być wypełniona",
    path: ["nutCoalIssued", "ecoPeaCoalIssued"],
  },
);

export type FrontendAddStockIssueSchemaType = z.infer<
  typeof frontendAddStockIssueSchema
>;

export default frontendAddStockIssueSchema;
