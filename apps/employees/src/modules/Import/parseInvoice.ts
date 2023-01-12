import { z } from "zod";
import { stringOrUndefined } from "../../utils/stringOrUndefined";
import NotEnoughArgumentsError from "./NotEnoughArgumentsError";

export const invoiceSchema = z
  .object({
    numerFaktury: z.string(),
    numerWniosku: z.string().optional(),
    dataWydania: z.coerce.date(),
    oplaconoOrzech: z.coerce.number().nonnegative().optional(),
    oplaconoGroszek: z.coerce.number().nonnegative().optional(),
  })
  .refine(
    ({ oplaconoGroszek, oplaconoOrzech }) => oplaconoGroszek || oplaconoOrzech,
    {
      message:
        "Przynajmniej jedna wartość musi być wypełniona (orzech lub groszek).",
      path: ["oplaconoGroszek", "oplaconoOrzech"],
    },
  );

export const parseInvoice = (line: string[]) => {
  if (line.length > 4) {
    const invoice = {
      numerFaktury: line[0],
      numerWniosku: stringOrUndefined(line[1]),
      dataWydania: line[2],
      oplaconoOrzech: stringOrUndefined(line[3]),
      oplaconoGroszek: stringOrUndefined(line[4]),
    };
    return invoiceSchema.parse(invoice);
  } else {
    throw new NotEnoughArgumentsError(5, line.length);
  }
};

export default parseInvoice;
