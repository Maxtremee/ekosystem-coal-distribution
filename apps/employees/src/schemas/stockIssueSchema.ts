import { z } from "zod";

export const baseStockIssueSchema = z.object({
  createdAt: z.coerce.date(),
  distributionCenterId: z.string(),
  additionalInformation: z.string().optional(),
  items: z
    .object({
      amount: z.coerce.number().min(1),
      type: z.string(),
    })
    .array()
    .nonempty(),
});

export type BaseStockIssueSchemaType = Zod.infer<typeof baseStockIssueSchema>;

export default baseStockIssueSchema;
