import { Invoice } from "@acme/db";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { Alert, Table } from "flowbite-react";
import { useFormContext } from "react-hook-form";
import { FilterInvoicesListSchemaType } from "../../../schemas/filterInvoicesListSchema";
import InvoicesTableRow from "./InvoiceTableRow";

export default function InvoicesTable({
  invoices,
  isError,
}: {
  invoices: Invoice[];
  isError: boolean;
}) {
  const { setValue, getValues, watch } =
    useFormContext<FilterInvoicesListSchemaType>();

  if (isError) {
    return <Alert color="failure">Błąd ładowania listy faktur</Alert>;
  }

  const onHeaderClick = (id: FilterInvoicesListSchemaType["sortBy"]) => {
    if (getValues("sortBy") !== id) {
      setValue("sortBy", id);
      setValue("sortDir", "desc");
    } else {
      if (getValues("sortDir") === "desc") {
        setValue("sortDir", "asc");
      } else {
        setValue("sortDir", "desc");
      }
    }
  };

  const showChevron = (id: FilterInvoicesListSchemaType["sortBy"]) => {
    if (getValues("sortBy") === id) {
      if (getValues("sortDir") === "asc") {
        return <ChevronUpIcon width={30} />;
      }
      return <ChevronDownIcon width={30} />;
    }
  };

  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell
          className="hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => onHeaderClick("applicationId")}
        >
          <div className="flex">
            Numer wniosku
            {showChevron("applicationId")}
          </div>
        </Table.HeadCell>
        <Table.HeadCell
          className="hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => onHeaderClick("issueDate")}
        >
          <div className="flex">
            Data złożenia
            {showChevron("issueDate")}
          </div>
        </Table.HeadCell>
        <Table.HeadCell
          className="hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => onHeaderClick("name")}
        >
          <div className="flex">
            Numer faktury
            {showChevron("name")}
          </div>
        </Table.HeadCell>
        <Table.HeadCell>Zadeklarowana ilość węgla - orzech</Table.HeadCell>
        <Table.HeadCell>Pozostała ilość węgla - orzech</Table.HeadCell>
        <Table.HeadCell>Zadeklarowana ilość węgla - groszek</Table.HeadCell>
        <Table.HeadCell>Pozostała ilość węgla - groszek</Table.HeadCell>
      </Table.Head>
      <Table.Body className={`divide-y`}>
        {invoices.map((invoice) => (
          <InvoicesTableRow key={invoice.applicationId} invoice={invoice} />
        ))}
      </Table.Body>
    </Table>
  );
}
