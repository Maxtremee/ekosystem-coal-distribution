import { z } from "zod";

const filterApplicationsListSchema = z.object({
  skip: z.number().optional(),
  take: z.number().optional(),
  search: z.string().optional(),
  sortDir: z.enum(["asc", "desc"]).optional(),
  sortBy: z
    .enum([
      "id",
      "issueDate",
      "applicantName",
      "additionalDetails",
      "declaredEcoPeaCoal",
      "declaredNutCoal",
    ])
    .optional(),
});

export type FilterApplicationsListSchemaType = z.infer<
  typeof filterApplicationsListSchema
>;

export default filterApplicationsListSchema;
