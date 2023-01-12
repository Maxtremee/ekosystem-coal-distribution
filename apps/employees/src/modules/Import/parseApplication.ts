import { z } from "zod";
import { stringOrUndefined } from "../../utils/stringOrUndefined";
import NotEnoughArgumentsError from "./NotEnoughArgumentsError";

export const applicationSchema = z
  .object({
    wnioskodawca: z.string(),
    numerWniosku: z.string().optional(),
    dodatkoweInformacje: z.string().optional(),
    dataWydania: z.coerce.date(),
    zadeklarowanaIloscOrzech: z.coerce.number().nonnegative().optional(),
    zadeklarowanaIloscGroszek: z.coerce.number().nonnegative().optional(),
  })
  .refine(
    ({ zadeklarowanaIloscGroszek, zadeklarowanaIloscOrzech }) =>
      zadeklarowanaIloscGroszek || zadeklarowanaIloscOrzech,
    {
      message:
        "Przynajmniej jedna wartość musi być wypełniona (orzech lub groszek).",
      path: ["zadeklarowanaIloscGroszek", "zadeklarowanaIloscOrzech"],
    },
  );

export const parseApplication = (line: string[]) => {
  if (line.length > 5) {
    const application = {
      wnioskodawca: line[0],
      numerWniosku: stringOrUndefined(line[1]),
      dodatkoweInformacje: stringOrUndefined(line[2]),
      dataWydania: line[3],
      zadeklarowanaIloscOrzech: stringOrUndefined(line[4]),
      zadeklarowanaIloscGroszek: stringOrUndefined(line[5]),
    };
    return applicationSchema.parse(application);
  } else {
    throw new NotEnoughArgumentsError(6, line.length);
  }
};

export default parseApplication;
