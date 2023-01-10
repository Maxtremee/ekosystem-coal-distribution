import { z } from "zod";

export const baseStockIssueSchema = z.object({
  additionalInformation: z.string().optional(),
  nutCoalIssued: z.coerce.number().nonnegative().optional(),
  ecoPeaCoalIssued: z.coerce.number().nonnegative().optional(),
  distributionCenterId: z.string(),
});

export const frontendStockIssueSchema = baseStockIssueSchema.refine(
  ({ nutCoalIssued, ecoPeaCoalIssued }) => nutCoalIssued || ecoPeaCoalIssued,
  {
    message: "Przynajmniej jedna wartość musi być wypełniona",
    path: ["nutCoalIssued", "ecoPeaCoalIssued"],
  },
);

export type FrontendStockIssueSchemaType = z.infer<
  typeof frontendStockIssueSchema
>;

export default frontendStockIssueSchema;
