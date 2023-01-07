import { Table } from "flowbite-react";
import { useRouter } from "next/router";
import { RouterOutputs } from "../../../utils/trpc";

export default function StockIssuesTableRow({
  stockIssue: stockIssue,
}: {
  stockIssue: RouterOutputs["stockIssues"]["getFiltered"]["stockIssues"][number];
}) {
  const router = useRouter();
  return (
    <Table.Row
      className="bg-white hover:cursor-pointer dark:border-gray-700 dark:bg-gray-800"
      onClick={() => router.push(`/stock-issues/${stockIssue.id}`)}
    >
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {stockIssue.invoiceName}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {stockIssue.createdAt.toLocaleString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {stockIssue?.nutCoalIssued && stockIssue.nutCoalIssued.toString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {stockIssue?.ecoPeaCoalIssued && stockIssue.ecoPeaCoalIssued.toString()}
      </Table.Cell>
    </Table.Row>
  );
}
