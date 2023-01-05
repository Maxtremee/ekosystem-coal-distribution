import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Alert, Button, Spinner } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import ApplicationDetails from "../../modules/ApplicationDetails";
import InvoiceList from "../../modules/InvoiceList";
import { trpc } from "../../utils/trpc";

function ApplicationDetailsPage() {
  const router = useRouter();

  const { data, isLoading, error } = trpc.applications.getDetails.useQuery({
    id: router.query.id as string,
  });

  if (error) {
    return <Alert color="error">Błąd wczytywania wniosku</Alert>;
  }

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <Link
          href={{
            pathname: `/invoices/add`,
            query: {
              applicationId: data.id,
            },
          }}
          passHref
        >
          <Button>Dodaj fakturę</Button>
        </Link>
        <Link
          href={{
            pathname: `/applications/${data.id}/edit`,
          }}
          passHref
        >
          <Button color="warning">Edytuj</Button>
        </Link>
      </div>
      <ApplicationDetails application={data} />
      <InvoiceList applicationId={data.id} />
    </div>
  );
}

export default withPageAuthRequired(ApplicationDetailsPage);
