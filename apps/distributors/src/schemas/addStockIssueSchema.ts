import { z } from "zod";

const baseAddStockIssueSchema = z.object({
  additionalInformation: z.string().optional(),
  items: z
    .object({
      amount: z.coerce.number().min(1),
      type: z.string(),
    })
    .array()
    .nonempty(),
});

export const backendAddStockIssueSchema = baseAddStockIssueSchema.extend({
  invoiceId: z.string(),
});

export type BaseAddStockIssueSchemaType = Zod.infer<
  typeof baseAddStockIssueSchema
>;

export default baseAddStockIssueSchema;
