import { FilteringChevron, useFilteringContext } from "@ekosystem/ui";
import { Alert, Table } from "flowbite-react";
import { RouterOutputs } from "../../../../utils/trpc";
import StockIssuesTableRow from "./StockIssuesTableRow";

type StockIssuesType =
  RouterOutputs["stockIssues"]["getFiltered"]["stockIssues"];

export default function StockIssuesTable({
  stockIssues,
  isError,
}: {
  stockIssues: StockIssuesType | undefined;
  isError: boolean;
}) {
  const { onHeaderClick } = useFilteringContext();

  if (isError) {
    return <Alert color="failure">Błąd ładowania listy wydań towaru</Alert>;
  }

  const headerClickHandler = onHeaderClick<keyof StockIssuesType[number]>();
  const ShowChevron = FilteringChevron<keyof StockIssuesType[number]>;

  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>
          <div className="flex">Numer faktury</div>
        </Table.HeadCell>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => headerClickHandler("createdAt")}
        >
          <div className="flex items-center">
            Data wydania
            <ShowChevron id="createdAt" />
          </div>
        </Table.HeadCell>
        <Table.HeadCell>
          <div className="flex">Wydane przez</div>
        </Table.HeadCell>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => headerClickHandler("nutCoalIssued")}
        >
          <div className="flex items-center">
            Ilość węgla wydana - orzech
            <ShowChevron id="nutCoalIssued" />
          </div>
        </Table.HeadCell>
        <Table.HeadCell
          className="hover:cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-600"
          onClick={() => headerClickHandler("ecoPeaCoalIssued")}
        >
          <div className="flex items-center">
            Ilość węgla wydana - groszek
            <ShowChevron id="ecoPeaCoalIssued" />
          </div>
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {stockIssues?.map((stockIssue) => (
          <StockIssuesTableRow key={stockIssue.id} stockIssue={stockIssue} />
        ))}
      </Table.Body>
    </Table>
  );
}
