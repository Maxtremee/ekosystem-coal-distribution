import { Table } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEventHandler } from "react";
import { RouterOutputs } from "../../../../utils/trpc";

export default function InvoicesTableRow({
  invoice,
}: {
  invoice: RouterOutputs["invoices"]["getFiltered"]["invoices"][number];
}) {
  const router = useRouter();
  const stopPropagation: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.stopPropagation();
  };

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
        <Link
          href={`/applications/${invoice.Application?.id}`}
          className="cursor-pointer underline"
          onClick={stopPropagation}
        >
          {invoice.Application?.applicationId}
        </Link>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.paidForCoal.toString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.nutCoalWithdrawn}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {invoice.ecoPeaCoalWithdrawn}
      </Table.Cell>
    </Table.Row>
  );
}
