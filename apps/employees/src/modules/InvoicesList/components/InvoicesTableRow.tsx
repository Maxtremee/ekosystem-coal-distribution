import { Table } from "flowbite-react";
import { useRouter } from "next/router";
import { RouterOutputs } from "../../../utils/trpc";

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
        {invoice.nutCoalWitdhrawn}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.declaredEcoPeaCoal && invoice.declaredEcoPeaCoal.toString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.ecoPeaCoalWitdhrawn}
      </Table.Cell>
    </Table.Row>
  );
}
