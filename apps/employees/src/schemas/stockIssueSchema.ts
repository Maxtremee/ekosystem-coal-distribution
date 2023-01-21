import { z } from "zod";

export const baseStockIssueSchema = z.object({
  distributionCenterId: z.string(),
  additionalInformation: z.string().optional(),
  nutCoalIssued: z.coerce.number().nonnegative().optional(),
  ecoPeaCoalIssued: z.coerce.number().nonnegative().optional(),
});

export const frontendStockIssueSchema = baseStockIssueSchema.refine(
  ({ nutCoalIssued, ecoPeaCoalIssued }) =>
    nutCoalIssued !== 0 || ecoPeaCoalIssued !== 0,
  {
    message: "Przynajmniej jedna wartość musi być wypełniona",
    path: ["nutCoalIssued", "ecoPeaCoalIssued"],
  },
);

export type FrontendStockIssueSchemaType = z.infer<
  typeof frontendStockIssueSchema
>;

export default frontendStockIssueSchema;
