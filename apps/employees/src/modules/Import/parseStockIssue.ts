import { z } from "zod";
import { stringOrUndefined } from "../../utils/stringOrUndefined";
import NotEnoughArgumentsError from "./NotEnoughArgumentsError";

const stockIssueSchema = z
  .object({
    numerFaktury: z.string(),
    dataWydania: z.coerce.date(),
    emailSkupu: z.string().email().optional(),
    dodatkoweInformacje: z.string().optional(),
    wydanoOrzech: z.coerce.number().nonnegative().optional(),
    wydanoGroszek: z.coerce.number().nonnegative().optional(),
  })
  .refine(({ wydanoOrzech, wydanoGroszek }) => wydanoOrzech || wydanoGroszek, {
    message:
      "Przynajmniej jedna wartość musi być wypełniona (orzech lub groszek).",
    path: ["wydanoOrzech", "wydanoGroszek"],
  });

export const parseStockIssue = (line: string[]) => {
  console.log(line.length);
  if (line.length > 5) {
    const stockIssue = {
      numerFaktury: line[0],
      dataWydania: line[1],
      emailSkupu: stringOrUndefined(line[2]),
      dodatkoweInformacje: stringOrUndefined(line[3]),
      wydanoOrzech: stringOrUndefined(line[4]),
      wydanoGroszek: stringOrUndefined(line[5]),
    };
    return stockIssueSchema.parse(stockIssue);
  } else {
    throw new NotEnoughArgumentsError(6, line.length);
  }
};

export default parseStockIssue;
