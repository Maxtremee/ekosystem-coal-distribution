import { Alert, Table } from "flowbite-react";
import { useFilteringContext } from "../../../components/FilteringContext";
import { RouterOutputs } from "../../../utils/trpc";
import ApplicationsTableRow from "./ApplicationsTableRow";

type ApplicationsType =
  RouterOutputs["applications"]["getFiltered"]["applications"];

export default function ApplicationsTable({
  applications,
  isError,
}: {
  applications: ApplicationsType | undefined;
  isError: boolean;
}) {
  const { onHeaderClick, showChevron } = useFilteringContext();

  if (isError) {
    return <Alert color="failure">Błąd ładowania listy wniosków</Alert>;
  }
  
  const headerClickHandler = onHeaderClick<keyof ApplicationsType[number]>();
  const showChevronHandler = showChevron<keyof ApplicationsType[number]>();

  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => headerClickHandler("applicantName")}
        >
          <div className="flex">
            Imię i nazwisko
            {showChevronHandler("applicantName")}
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
          <div className="flex">Numery faktur</div>
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
        <Table.HeadCell>Ilość węgla wydana w fakturach - orzech</Table.HeadCell>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => headerClickHandler("declaredEcoPeaCoal")}
        >
          <div className="flex">
            Zadeklarowana ilość węgla - groszek
            {showChevronHandler("declaredEcoPeaCoal")}
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
