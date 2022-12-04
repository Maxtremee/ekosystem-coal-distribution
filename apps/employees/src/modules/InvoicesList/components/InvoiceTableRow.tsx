import { Invoice } from "@acme/db";
import { Table } from "flowbite-react";
import { Decimal } from "decimal.js";

export default function InvoicesTableRow({ invoice }: { invoice: Invoice }) {
  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.applicationId}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.issueDate.toLocaleDateString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.name}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.declaredNutCoal &&
          new Decimal(invoice.declaredNutCoal).toString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.nutCoalLeft && new Decimal(invoice.nutCoalLeft).toString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.declaredEcoPeaCoal &&
          new Decimal(invoice.declaredEcoPeaCoal).toString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.ecoPeaCoalLeft &&
          new Decimal(invoice.ecoPeaCoalLeft).toString()}
      </Table.Cell>
    </Table.Row>
  );
}
