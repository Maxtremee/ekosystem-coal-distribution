import { z } from "zod";

const registerDistributionCenterSchema = z.object({
  name: z.string(),
  address: z.string(),
});

export type RegisterDistributionCenterSchemaType = z.infer<
  typeof registerDistributionCenterSchema
>;

export default registerDistributionCenterSchema;
