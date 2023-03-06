import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Text } from "@ekosystem/ui";
import { Alert, Button, Spinner } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import DeleteInvoiceButton from "../../../modules/Invoice/DeleteInvoice/components/DeleteInvoiceButton";
import {
  InvoiceDetails,
  InvoiceTimeline,
} from "../../../modules/Invoice/InvoiceDetails";
import { trpc } from "../../../utils/trpc";

function InvoiceDetailsPage() {
  const router = useRouter();
  const utils = trpc.useContext();
  const id = router.query.id as string;

  const { data, isLoading, error } = trpc.invoices.getDetails.useQuery(
    {
      id,
    },
    {
      onSuccess: (res) => {
        utils.invoices.get.setData({ id }, () => res);
      },
    },
  );

  if (isLoading) {
    return <Spinner size="xl" color="success" />;
  }

  if (error) {
    return (
      <Alert color="failure">
        {error?.message || "Błąd wczytywania faktury"}
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Text as="h1" className="text-2xl font-bold">
          {data.invoiceId}
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
          <DeleteInvoiceButton id={data.id} invoiceId={data.invoiceId} />
        </div>
      </div>
      <InvoiceDetails invoice={data} />
      <InvoiceTimeline id={id} />
    </div>
  );
}

export default withPageAuthRequired(InvoiceDetailsPage);
