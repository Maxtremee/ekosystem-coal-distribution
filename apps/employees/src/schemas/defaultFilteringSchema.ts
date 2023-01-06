import { z } from "zod";

export const defaultFilteringSchema = z.object({
  skip: z.number().optional().default(0),
  take: z.number().optional().default(20),
  search: z.string().optional().default(""),
  sortDir: z.enum(["asc", "desc"]).optional().default("desc"),
  sortBy: z.string().optional().default("createdAt"),
});

export type DefaultFilteringSchemaType = z.infer<typeof defaultFilteringSchema>;

export default defaultFilteringSchema;
