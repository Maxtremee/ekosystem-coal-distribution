import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Alert, Spinner } from "flowbite-react";
import { useRouter } from "next/router";
import StockIssueDetails from "../../modules/StockIssue/StockIssueDetails";
import { trpc } from "../../utils/trpc";

function StockIssueDetailsPage() {
  const router = useRouter();

  const { data, isLoading, error } = trpc.stockIssues.getDetails.useQuery({
    id: router.query.id as string,
  });

  if (error) {
    return <Alert color="error">Błąd wczytywania faktury</Alert>;
  }

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <StockIssueDetails stockIssue={data} />
    </div>
  );
}

export default withPageAuthRequired(StockIssueDetailsPage);
