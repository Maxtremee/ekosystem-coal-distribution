import { z } from "zod";

export const applicationSortByEnum = [
  "id",
  "issueDate",
  "applicantName",
  "additionalDetails",
  "declaredEcoPeaCoal",
  "declaredNutCoal",
];

const filterApplicationsListSchema = z.object({
  skip: z.number().optional(),
  take: z.number().optional(),
  search: z.string().optional(),
  sortDir: z.enum(["asc", "desc"]).optional(),
  sortBy: z.string().optional(),
});

export type FilterApplicationsListSchemaType = z.infer<
  typeof filterApplicationsListSchema
>;

export default filterApplicationsListSchema;
