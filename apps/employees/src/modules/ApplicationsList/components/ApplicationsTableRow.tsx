import { Table } from "flowbite-react";
import { Fragment } from "react";
import { RouterOutputs } from "../../../utils/trpc";

export default function ApplicationsTableRow({
  application,
}: {
  application: RouterOutputs["applications"]["getFiltered"][number];
}) {
  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {application.name}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {application.issueDate.toLocaleDateString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {application.invoices?.map(({ name }) => (
          <Fragment key={name}>
            {name} <br />
          </Fragment>
        ))}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {application.declaredNutCoal && application.declaredNutCoal.toString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {application.nutCoalInInvoices}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {application.declaredEcoPeaCoal &&
          application.declaredEcoPeaCoal.toString()}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
        {application.ecoPealCoalInInvoices}
      </Table.Cell>
    </Table.Row>
  );
}
