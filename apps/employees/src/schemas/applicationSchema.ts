import { z } from "zod";

export const baseAddApplicationSchema = z.object({
  applicationId: z.string(),
  additionalInformation: z.string().optional(),
  issueDate: z.coerce.date(),
  declaredNutCoal: z.coerce.number().nonnegative().optional(),
  declaredEcoPeaCoal: z.coerce.number().nonnegative().optional(),
});

export const frontendAddApplicationSchema = baseAddApplicationSchema.refine(
  ({ declaredEcoPeaCoal, declaredNutCoal }) =>
    declaredEcoPeaCoal !== 0 || declaredNutCoal !== 0,
  {
    message: "Przynajmniej jedna wartość musi być wypełniona",
    path: ["declaredEcoPeaCoal", "declaredNutCoal"],
  },
);

export type FrontendAddApplicationSchemaType = z.infer<
  typeof frontendAddApplicationSchema
>;

export default frontendAddApplicationSchema;
