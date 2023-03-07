import { z } from "zod";
import { PERIOD_TYPE } from "../utils/periodTypes";

export const statsSchema = z.object({
  period: z.nativeEnum(PERIOD_TYPE),
  after: z.coerce.date().optional(),
  before: z.coerce.date().optional(),
});
export type StatsSchema = z.infer<typeof statsSchema>;
