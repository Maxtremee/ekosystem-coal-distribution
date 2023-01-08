export default function createCsv(
  header: string[],
  data: (string | number | null | undefined)[][],
) {
  const lineEnd = "\r\n";
  const createLine = (lineData: (string | number | null | undefined)[]) =>
    lineData
      .reduce<string>(
        (acc, value) => `${acc}${(value || "").toString().replace(",", ";")},`,
        "",
      )
      .slice(0, -1) + lineEnd;
  return new Blob([createLine(header), ...data.map(createLine)], {
    type: "text/csv",
  });
}
