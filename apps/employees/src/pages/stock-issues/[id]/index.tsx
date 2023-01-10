import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Text } from "@ekosystem/ui";
import { Alert, Button, Spinner } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import StockIssueDetails from "../../../modules/StockIssue/StockIssueDetails";
import { trpc } from "../../../utils/trpc";

function StockIssueDetailsPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, isLoading, error } = trpc.stockIssues.getDetails.useQuery({
    id,
  });

  if (isLoading) {
    return <Spinner size="xl" color="success" />;
  }

  if (error) {
    return (
      <Alert color="failure">
        {error?.message || "Błąd wczytywania wydania towaru"}
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Text as="h2" className="text-lg font-semibold">
          Wydanie z {data?.createdAt.toLocaleString()}
        </Text>
        <div className="flex gap-3">
          <Link
            href={{
              pathname: `/stock-issues/${data?.id}/edit`,
            }}
            passHref
          >
            <Button color="warning">Edytuj</Button>
          </Link>
        </div>
      </div>
      <StockIssueDetails stockIssue={data} />;
    </div>
  );
}

export default withPageAuthRequired(StockIssueDetailsPage);
