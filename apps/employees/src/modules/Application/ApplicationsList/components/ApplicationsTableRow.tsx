import { MouseEventHandler } from "react";
import { Table } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { RouterOutputs } from "../../../../utils/trpc";

export default function ApplicationsTableRow({
  application,
}: {
  application: RouterOutputs["applications"]["getFiltered"]["applications"][number];
}) {
  const router = useRouter();
  const stopPropagation: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.stopPropagation();
  };

  return (
    <Table.Row
      className="bg-white hover:cursor-pointer dark:border-gray-700 dark:bg-gray-800"
      onClick={() => router.push(`/applications/${application.id}`)}
    >
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {application.applicationId}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {application.issueDate.toLocaleString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {application?.declaredNutCoal && application.declaredNutCoal.toString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {application?.declaredEcoPeaCoal &&
          application.declaredEcoPeaCoal.toString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {application.invoices?.map(({ invoiceId, id }) => (
          <Link
            key={id}
            href={`/invoices/${id}`}
            className="cursor-pointer underline"
            onClick={stopPropagation}
          >
            {invoiceId} <br />
          </Link>
        ))}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {application.coalInInvoices}
      </Table.Cell>
    </Table.Row>
  );
}
