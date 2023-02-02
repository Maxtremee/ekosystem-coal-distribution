import { z } from "zod";
import { stringOrUndefined } from "../../utils/stringOrUndefined";
import NotEnoughArgumentsError from "./NotEnoughArgumentsError";

const stockIssueSchema = z.object({
  numerFaktury: z.string(),
  dataWydania: z.coerce.date(),
  emailSkupu: z.string().email().optional(),
  dodatkoweInformacje: z.string().optional(),
  rodzaj: z.string(),
  ilosc: z.coerce.number().nonnegative(),
});

export const parseStockIssue = (line: string[]) => {
  if (line.length > 5) {
    const stockIssue = {
      numerFaktury: line[0],
      dataWydania: line[1],
      emailSkupu: stringOrUndefined(line[2]),
      dodatkoweInformacje: stringOrUndefined(line[3]),
      rodzaj: line[4],
      ilosc: line[5],
    };
    return stockIssueSchema.parse(stockIssue);
  } else {
    throw new NotEnoughArgumentsError(6, line.length);
  }
};

export default parseStockIssue;
