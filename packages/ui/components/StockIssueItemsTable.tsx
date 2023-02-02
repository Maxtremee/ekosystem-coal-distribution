import { Table } from "flowbite-react";
import { CoalIssue } from "@ekosystem/db";
import Text from "./Text";

export default function StockIssueItemsTable({
  items,
}: {
  items: CoalIssue[];
}) {
  return (
    <div className="max-w-md pt-6">
      <Text>Podsumowanie</Text>
      <Table>
        <Table.Head>
          <Table.HeadCell>Towar</Table.HeadCell>
          <Table.HeadCell>Ilość</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {items?.map(({ amount, type }) => (
            <Table.Row key={`${type}${amount}`}>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
                {type}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-300">
                {amount.toString()} kg
              </Table.Cell>
            </Table.Row>
          ))}
          <Table.Row className="bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <Table.Cell>Łącznie</Table.Cell>
            <Table.Cell>
              {items.reduce<number>(
                (acc, { amount }) => Number(amount.toString()) + acc,
                0,
              )}{" "}
              kg
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}
