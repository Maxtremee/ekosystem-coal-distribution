import { useFilteringContext } from "@ekosystem/ui";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { Button, Spinner } from "flowbite-react";
import downloadCsv from "../../../../utils/downloadCsv";
import { trpc } from "../../../../utils/trpc";

export default function DownloadInvoicesButton() {
  const { values } = useFilteringContext();
  const { mutate, isLoading } = trpc.invoices.downloadFiltered.useMutation({
    onSuccess: (res) => downloadCsv(res, "faktury"),
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
