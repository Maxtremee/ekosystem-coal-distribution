import { Alert, Table } from "flowbite-react";
import { useFilteringContext } from "../../../components/FilteringContext";
import { RouterOutputs } from "../../../utils/trpc";
import InvoiceTableRow from "./InvoiceTableRow";

type InvoicesType = RouterOutputs["invoices"]["getFiltered"]["invoices"];

export default function InvoiceTable({
  invoices,
  isError,
}: {
  invoices: InvoicesType | undefined;
  isError: boolean;
}) {
  const { onHeaderClick, showChevron } = useFilteringContext();

  if (isError) {
    return <Alert color="failure">Błąd ładowania listy faktur</Alert>;
  }

  const headerClickHandler = onHeaderClick<keyof InvoicesType[number]>();
  const showChevronHandler = showChevron<keyof InvoicesType[number]>();

  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => headerClickHandler("name")}
        >
          <div className="flex">
            Numer faktury
            {showChevronHandler("name")}
          </div>
        </Table.HeadCell>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => headerClickHandler("issueDate")}
        >
          <div className="flex">
            Data złożenia
            {showChevronHandler("issueDate")}
          </div>
        </Table.HeadCell>
        <Table.HeadCell>
          <div className="flex">Osoba składająca wniosek</div>
        </Table.HeadCell>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => headerClickHandler("declaredNutCoal")}
        >
          <div className="flex">
            Zadeklarowana ilość węgla - orzech
            {showChevronHandler("declaredNutCoal")}
          </div>
        </Table.HeadCell>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => headerClickHandler("declaredEcoPeaCoal")}
        >
          <div className="flex">
            Zadeklarowana ilość węgla - groszek
            {showChevronHandler("declaredEcoPeaCoal")}
          </div>
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {invoices?.map((invoice) => (
          <InvoiceTableRow key={invoice.id} invoice={invoice} />
        ))}
      </Table.Body>
    </Table>
  );
}
