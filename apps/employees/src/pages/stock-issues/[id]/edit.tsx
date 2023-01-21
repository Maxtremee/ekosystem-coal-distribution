import { Text } from "@ekosystem/ui";
import { Alert, Card, Spinner } from "flowbite-react";
import { useRouter } from "next/router";
import UpdateStockIssue from "../../../modules/StockIssue/UpdateStockIssue";
import { trpc } from "../../../utils/trpc";

export default function UpdateStockIssuePage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, isInitialLoading, error } =
    trpc.stockIssues.getDetails.useQuery(
      {
        id,
      },
      {
        enabled: !!id,
        retry: 1,
      },
    );

  if (isInitialLoading) {
    return <Spinner size="xl" color="success" />;
  }

  if (error || !data) {
    return (
      <Alert color="failure">
        {error?.message || "Błąd wczytywania wydania towaru"}
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <Text as="h2" className="text-lg font-semibold">
        Edytujesz wydanie z {data?.createdAt.toLocaleString()}
      </Text>
      <UpdateStockIssue stockIssue={data} />
    </Card>
  );
}
