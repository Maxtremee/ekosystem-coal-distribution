import { useFilteringContext, FilteringChevron } from "@ekosystem/ui";
import { Alert, Table } from "flowbite-react";
import { RouterOutputs } from "../../../../utils/trpc";
import InvoicesTableRow from "./InvoicesTableRow";

type InvoicesType = RouterOutputs["invoices"]["getFiltered"]["invoices"];

export default function InvoicesTable({
  invoices,
  isError,
}: {
  invoices: InvoicesType | undefined;
  isError: boolean;
}) {
  const { onHeaderClick } = useFilteringContext();

  if (isError) {
    return <Alert color="failure">Błąd ładowania listy faktur</Alert>;
  }

  const headerClickHandler = onHeaderClick<keyof InvoicesType[number]>();
  const ShowChevron = FilteringChevron<keyof InvoicesType[number]>;

  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => headerClickHandler("name")}
        >
          <div className="flex items-center">
            Numer faktury
            <ShowChevron id="name" />
          </div>
        </Table.HeadCell>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => headerClickHandler("issueDate")}
        >
          <div className="flex items-center">
            Data
            <ShowChevron id="issueDate" />
          </div>
        </Table.HeadCell>
        <Table.HeadCell>
          <div className="flex items-center">Osoba składająca wniosek</div>
        </Table.HeadCell>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => headerClickHandler("declaredNutCoal")}
        >
          <div className="flex items-center">
            Zadeklarowana ilość węgla - orzech
            <ShowChevron id="declaredNutCoal" />
          </div>
        </Table.HeadCell>
        <Table.HeadCell>Ilość węgla wydana - orzech</Table.HeadCell>

        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => headerClickHandler("declaredEcoPeaCoal")}
        >
          <div className="flex items-center">
            Zadeklarowana ilość węgla - groszek
            <ShowChevron id="declaredEcoPeaCoal" />
          </div>
        </Table.HeadCell>
        <Table.HeadCell>Ilość węgla wydana - groszek</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {invoices?.map((invoice) => (
          <InvoicesTableRow key={invoice.id} invoice={invoice} />
        ))}
      </Table.Body>
    </Table>
  );
}
