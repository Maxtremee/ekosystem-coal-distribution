import dayjs from "dayjs";
import { z } from "zod";
import { PERIOD_TYPE } from "../utils/periodTypes";

export const statsSchema = z.object({
  period: z.nativeEnum(PERIOD_TYPE),
  timezone: z.string(),
  after: z.coerce
    .date()
    .optional()
    .transform((val) => (val ? dayjs(val).startOf("day").toDate() : undefined)),
  before: z.coerce
    .date()
    .optional()
    .transform((val) => (val ? dayjs(val).endOf("day").toDate() : undefined)),
});
export type StatsSchema = z.infer<typeof statsSchema>;
