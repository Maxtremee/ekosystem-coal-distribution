import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Text } from "@ekosystem/ui";
import { Alert, Button, Spinner } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  InvoiceDetails,
  InvoiceTimeline,
} from "../../modules/Invoice/InvoiceDetails";
import { trpc } from "../../utils/trpc";

function InvoiceDetailsPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, isLoading, error } = trpc.invoices.getDetails.useQuery({
    id,
  });

  if (error) {
    return <Alert color="error">Błąd wczytywania faktury</Alert>;
  }

  if (isLoading) {
    return <Spinner size="xl" color="success" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Text as="h1" className="text-2xl font-bold">
          {data.name}
        </Text>
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
      </div>
      <InvoiceDetails invoice={data} />
      <InvoiceTimeline id={id} />
    </div>
  );
}

export default withPageAuthRequired(InvoiceDetailsPage);
