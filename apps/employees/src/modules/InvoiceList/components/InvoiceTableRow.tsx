import { Table } from "flowbite-react";
import { RouterOutputs } from "../../../utils/trpc";

export default function InvoiceTableRow({
  invoice,
}: {
  invoice: RouterOutputs["invoices"]["getFiltered"]["invoices"][number];
}) {
  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.name}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.issueDate.toLocaleDateString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.Application?.applicantName}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.declaredNutCoal && invoice.declaredNutCoal.toString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.declaredEcoPeaCoal && invoice.declaredEcoPeaCoal.toString()}
      </Table.Cell>
    </Table.Row>
  );
}
