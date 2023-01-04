import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { Alert, Table } from "flowbite-react";
import { useFormContext } from "react-hook-form";
import { FilterApplicationsListSchemaType } from "../../../schemas/filterApplicationsListSchema";
import { RouterOutputs } from "../../../utils/trpc";
import ApplicationsTableRow from "./ApplicationsTableRow";

export default function ApplicationsTable({
  applications,
  isError,
}: {
  applications:
    | RouterOutputs["applications"]["getFiltered"]["applications"]
    | undefined;
  isError: boolean;
}) {
  const { setValue, getValues, watch } =
    useFormContext<FilterApplicationsListSchemaType>();

  if (isError) {
    return <Alert color="failure">Błąd ładowania listy wniosków</Alert>;
  }

  const onHeaderClick = (id: FilterApplicationsListSchemaType["sortBy"]) => {
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

  const showChevron = (id: FilterApplicationsListSchemaType["sortBy"]) => {
    if (getValues("sortBy") === id) {
      if (getValues("sortDir") === "asc") {
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
          onClick={() => onHeaderClick("applicantName")}
        >
          <div className="flex">
            Imię i nazwisko
            {showChevron("applicantName")}
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
          <div className="flex">Numery faktur</div>
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
        <Table.HeadCell>Ilość węgla wydana w fakturach - orzech</Table.HeadCell>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => onHeaderClick("declaredEcoPeaCoal")}
        >
          <div className="flex">
            Zadeklarowana ilość węgla - groszek
            {showChevron("declaredEcoPeaCoal")}
          </div>
        </Table.HeadCell>
        <Table.HeadCell>
          Ilość węgla wydana w fakturach - groszek
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className={`divide-y`}>
        {applications?.map((application) => (
          <ApplicationsTableRow
            key={application.id}
            application={application}
          />
        ))}
      </Table.Body>
    </Table>
  );
}
