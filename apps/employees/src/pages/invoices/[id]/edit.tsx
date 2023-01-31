import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Invoice } from "@ekosystem/db";
import { Text } from "@ekosystem/ui";
import { Alert, Card, Spinner } from "flowbite-react";
import { useRouter } from "next/router";
import UpdateInvoice from "../../../modules/Invoice/UpdateInvoice";
import { trpc } from "../../../utils/trpc";

function EditInvoicePage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, isInitialLoading, error } = trpc.invoices.get.useQuery(
    {
      id,
    },
    {
      enabled: !!id,
    },
  );

  if (error) {
    return (
      <Alert color="failure">
        {error?.message || "Błąd wczytywania faktury"}
      </Alert>
    );
  }

  if (isInitialLoading) {
    return <Spinner size="xl" color="success" />;
  }

  return (
    <Card className="w-full">
      <Text as="h2" className="text-lg font-semibold">
        Edytujesz fakturę: {data?.invoiceId}
      </Text>
      <UpdateInvoice invoice={data as Invoice} />
    </Card>
  );
}

export default withPageAuthRequired(EditInvoicePage);
