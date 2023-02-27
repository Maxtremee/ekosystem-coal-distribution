import { useFilteringContext } from "@ekosystem/ui";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { Button, Spinner } from "flowbite-react";
import downloadCsv from "../../../../utils/downloadCsv";
import { trpc } from "../../../../utils/trpc";
import { StockIssuesFiltersType } from "./StockIssuesList";

export default function DownloadStockIssuesButton() {
  const { values } = useFilteringContext<StockIssuesFiltersType>();
  const { mutate, isLoading } = trpc.stockIssues.downloadFiltered.useMutation({
    onSuccess: (res) => res.forEach((csv) => downloadCsv(csv, csv.title)),
  });
  // @ts-ignore
  const clickHandler = () => mutate(values);
  return (
    <Button onClick={clickHandler} disabled={isLoading}>
      {isLoading ? (
        <Spinner color="gray" className="mr-2" />
      ) : (
        <ArrowDownTrayIcon height={20} className="mr-2" />
      )}
      Eksportuj do CSV
    </Button>
  );
}
