import createCsv from "./createCsv";

export default function downloadCsv(
  res: { header: string[]; data: (string | number | null | undefined)[][] },
  filename: string,
) {
  const csv = createCsv(res.header, res.data);
  const a = document.createElement("a"),
    url = URL.createObjectURL(csv);
  a.href = url;
  a.download = `${filename}_${new Date()
    .toLocaleString("pl")
    .replace(", ", "_")}.csv`;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}
