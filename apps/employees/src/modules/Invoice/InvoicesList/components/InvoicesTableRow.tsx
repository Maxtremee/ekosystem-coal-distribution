import { Table } from "flowbite-react";
import { useRouter } from "next/router";
import { RouterOutputs } from "../../../../utils/trpc";

export default function InvoicesTableRow({
  invoice,
}: {
  invoice: RouterOutputs["invoices"]["getFiltered"]["invoices"][number];
}) {
  const router = useRouter();

  return (
    <Table.Row
      className="bg-white hover:cursor-pointer dark:border-gray-700 dark:bg-gray-800"
      onClick={() => router.push(`/invoices/${invoice.id}`)}
    >
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.invoiceId}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.issueDate.toLocaleString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.applicationId}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.amount.toString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.coalWithdrawn}
      </Table.Cell>
    </Table.Row>
  );
}
