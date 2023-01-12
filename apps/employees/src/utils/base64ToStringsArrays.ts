import readline from "readline";
import { Readable } from "stream";

export const base64ToStringsArrays = async (input: string) => {
  const buffer = Buffer.from(input, "base64");
  const stream = Readable.from(buffer);
  const read = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });
  const lines: string[] = [];
  for await (const line of read) {
    lines.push(line);
  }
  return lines.map((line) => line.split(","));
};

export default base64ToStringsArrays;
