import { z } from "zod";
import addInvoiceSchema from "./addInvoiceSchema";

const filterInvoicesListSchema = z
  .object({
    search: z.string().optional(),
    sortDir: z.enum(["asc", "desc"]).optional(),
    sortBy: z.enum(["applicationId", "issueDate", "name"]).optional(),
  })

export type FilterInvoicesListSchemaType = z.infer<typeof filterInvoicesListSchema>;

export default filterInvoicesListSchema;
