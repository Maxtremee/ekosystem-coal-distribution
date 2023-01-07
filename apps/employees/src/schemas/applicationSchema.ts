import { z } from "zod";

export const baseAddApplicationSchema = z.object({
  applicantName: z.string(),
  applicationId: z.string().optional(),
  additionalInformation: z.string().optional(),
  issueDate: z.coerce.date(),
  declaredNutCoal: z.coerce.number().nonnegative().optional(),
  declaredEcoPeaCoal: z.coerce.number().nonnegative().optional(),
});

export const frontendAddApplicationSchema = baseAddApplicationSchema
  .extend({
    showApplicationIdField: z.boolean().default(false),
  })
  .refine(
    ({ showApplicationIdField, applicationId }) =>
      showApplicationIdField && applicationId,
    {
      message: "Należy podać numer wniosku",
      path: ["applicationId"],
    },
  )
  .refine(
    ({ declaredEcoPeaCoal, declaredNutCoal }) =>
      declaredEcoPeaCoal || declaredNutCoal,
    {
      message: "Przynajmniej jedna wartość musi być wypełniona",
      path: ["declaredEcoPeaCoal", "declaredNutCoal"],
    },
  );

export type FrontendAddApplicationSchemaType = z.infer<
  typeof frontendAddApplicationSchema
>;

export default frontendAddApplicationSchema;
