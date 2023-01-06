import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Alert, Button, Spinner } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import InvoiceDetails from "../../modules/InvoiceDetails";
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
      {/* <div className="flex gap-3"></div> */}
      {/* <StockIssueDetails invoice={data} /> */}
      {JSON.stringify(data, undefined, 2)}
    </div>
  );
}

export default withPageAuthRequired(StockIssueDetailsPage);
