import { ZodError } from "zod";

export type ParsingError = {
  lineNumber: number;
  message: string | ZodError;
};
