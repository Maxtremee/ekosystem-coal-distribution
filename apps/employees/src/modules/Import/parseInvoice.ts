import { z } from "zod";
import { stringOrUndefined } from "../../utils/stringOrUndefined";
import NotEnoughArgumentsError from "./NotEnoughArgumentsError";

export const invoiceSchema = z.object({
  numerFaktury: z.string().min(1),
  numerWniosku: z.string().optional(),
  dataWydania: z.coerce.date(),
  kwota: z.coerce
    .number()
    .nonnegative()
    .transform((val) => Math.floor(val / 2)),
});

export const parseInvoice = (line: string[]) => {
  if (line.length > 3) {
    const invoice = {
      numerFaktury: line[0],
      numerWniosku: stringOrUndefined(line[1]),
      dataWydania: line[2],
      kwota: line[3],
    };
    return invoiceSchema.parse(invoice);
  } else {
    throw new NotEnoughArgumentsError(4, line.length);
  }
};

export default parseInvoice;
