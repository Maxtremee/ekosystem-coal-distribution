import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Alert, Button, Spinner } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import InvoiceDetails from "../../modules/InvoiceDetails";
import { trpc } from "../../utils/trpc";

function InvoiceDetailsPage() {
  const router = useRouter();

  const { data, isLoading, error } = trpc.invoices.getDetails.useQuery({
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
      <div className="flex gap-3">
        <Link
          href={{
            pathname: `/invoices/${data.id}/edit`,
          }}
          passHref
        >
          <Button color="warning">Edytuj</Button>
        </Link>
      </div>
      <InvoiceDetails invoice={data} />
    </div>
  );
}

export default withPageAuthRequired(InvoiceDetailsPage);
