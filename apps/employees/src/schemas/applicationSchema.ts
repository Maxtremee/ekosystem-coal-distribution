import { z } from "zod";

export const baseAddApplicationSchema = z.object({
  applicantName: z.string(),
  additionalInformation: z.string().optional(),
  issueDate: z.string().or(z.date()),
  declaredNutCoal: z.coerce.number().nonnegative().optional(),
  declaredEcoPeaCoal: z.coerce.number().nonnegative().optional(),
});

export const frontendAddApplicationSchema = baseAddApplicationSchema.refine(
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

export type FrontendAddApplicationSchemaType = z.infer<
  typeof frontendAddApplicationSchema
>;

export default frontendAddApplicationSchema;
