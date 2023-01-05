import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { Alert, Table } from "flowbite-react";
import { useFilteringContext } from "../../../components/FilteringContext";
import { RouterOutputs } from "../../../utils/trpc";
import { InvoiceAdditionalParamsType } from "./InvoiceList";
import InvoiceTableRow from "./InvoiceTableRow";

type InvoicesType =
  RouterOutputs["invoices"]["getFilteredWithApplicationId"]["invoices"];

export default function InvoiceTable({
  invoices,
  isError,
}: {
  invoices: InvoicesType | undefined;
  isError: boolean;
}) {
  const { values, setValue } =
    useFilteringContext<InvoiceAdditionalParamsType>();

  if (isError) {
    return <Alert color="failure">Błąd ładowania listy faktur</Alert>;
  }
  const onHeaderClick = (id: keyof InvoicesType[number]) => {
    if (values.sortBy !== id) {
      setValue("sortBy", id);
      setValue("sortDir", "desc");
    } else {
      if (values.sortDir === "desc") {
        setValue("sortDir", "asc");
      } else {
        setValue("sortDir", "desc");
      }
    }
  };

  const showChevron = (id: keyof InvoicesType[number]) => {
    if (values.sortBy === id) {
      if (values.sortDir === "asc") {
        return <ChevronUpIcon width={30} height={30} />;
      }
      return <ChevronDownIcon width={30} height={30} />;
    }
  };

  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => onHeaderClick("id")}
        >
          <div className="flex">
            Numer faktury
            {showChevron("id")}
          </div>
        </Table.HeadCell>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => onHeaderClick("issueDate")}
        >
          <div className="flex">
            Data złożenia
            {showChevron("issueDate")}
          </div>
        </Table.HeadCell>
        <Table.HeadCell>
          <div className="flex">Osoba składająca wniosek</div>
        </Table.HeadCell>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => onHeaderClick("declaredNutCoal")}
        >
          <div className="flex">
            Zadeklarowana ilość węgla - orzech
            {showChevron("declaredNutCoal")}
          </div>
        </Table.HeadCell>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => onHeaderClick("declaredEcoPeaCoal")}
        >
          <div className="flex">
            Zadeklarowana ilość węgla - groszek
            {showChevron("declaredEcoPeaCoal")}
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
