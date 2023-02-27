import dayjs from "dayjs";
import { z } from "zod";

export const defaultFilteringSchema = z.object({
  skip: z.number().optional().default(0),
  take: z.number().optional().default(20),
  search: z.string().optional().default(""),
  sortDir: z.enum(["asc", "desc"]).optional().default("desc"),
  sortBy: z.string().optional().default("createdAt"),
  after: z.coerce.date().optional(),
  before: z.coerce
    .date()
    .optional()
    .transform((val) => (val ? dayjs(val).endOf("day").toDate() : undefined)),
});

export type DefaultFilteringSchemaType = z.infer<typeof defaultFilteringSchema>;

export default defaultFilteringSchema;
