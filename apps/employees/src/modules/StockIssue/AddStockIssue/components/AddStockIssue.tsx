import { Text } from "@ekosystem/ui";
import { Alert, Spinner } from "flowbite-react";
import { useRouter } from "next/router";
import { trpc } from "../../../../utils/trpc";
import AddStockIssueForm from "./AddStockIssueForm";

export default function AddStockIssue() {
  const router = useRouter();

  const { data, isInitialLoading, isError } =
    trpc.stockIssues.checkInvoice.useQuery({
      invoiceId: router.query.invoiceId as string,
    });

  if (isInitialLoading) {
    return <Spinner size="xl" />;
  }

  if (isError) {
    return <Alert color="failure">Błąd ładowania faktury do wydania</Alert>;
  }

  return (
    <>
      <Text as="h2" className="text-lg font-semibold">
        Nowe wydanie do faktury {data?.invoiceId}
      </Text>
      <AddStockIssueForm invoice={data} />
    </>
  );
}
