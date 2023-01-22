import { useFilteringContext, FilteringChevron } from "@ekosystem/ui";
import { Alert, Table } from "flowbite-react";
import { RouterOutputs } from "../../../../utils/trpc";
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
  const { onHeaderClick } = useFilteringContext();

  if (isError) {
    return <Alert color="failure">Błąd ładowania listy wniosków</Alert>;
  }

  const headerClickHandler = onHeaderClick<keyof ApplicationsType[number]>();
  const ShowChevron = FilteringChevron<keyof ApplicationsType[number]>;

  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => headerClickHandler("applicationId")}
        >
          <div className="flex align-middle">
            Numer wniosku
            <ShowChevron id="applicationId" />
          </div>
        </Table.HeadCell>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => headerClickHandler("issueDate")}
        >
          <div className="flex items-center">
            Data złożenia
            <ShowChevron id="issueDate" />
          </div>
        </Table.HeadCell>

        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => headerClickHandler("declaredNutCoal")}
        >
          <div className="flex items-center">
            Zadeklarowana ilość węgla - orzech [kg]
            <ShowChevron id="declaredNutCoal" />
          </div>
        </Table.HeadCell>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => headerClickHandler("declaredEcoPeaCoal")}
        >
          <div className="flex items-center">
            Zadeklarowana ilość węgla - groszek [kg]
            <ShowChevron id="declaredEcoPeaCoal" />
          </div>
        </Table.HeadCell>
        <Table.HeadCell>
          <div className="flex items-center">Numery faktur</div>
        </Table.HeadCell>
        <Table.HeadCell>Opłacono [kg]</Table.HeadCell>
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
