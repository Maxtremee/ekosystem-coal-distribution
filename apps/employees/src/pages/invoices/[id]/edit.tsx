import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Invoice } from "@ekosystem/db";
import { Text } from "@ekosystem/ui";
import { Alert, Card, Spinner } from "flowbite-react";
import { useRouter } from "next/router";
import UpdateInvoice from "../../../modules/Invoice/UpdateInvoice";
import { RouterOutputs, trpc } from "../../../utils/trpc";

function EditInvoicePage() {
  const router = useRouter();
  const id = router.query.id as string;

  const {
    data: newInvoice,
    isInitialLoading: isInitialLoadingInvoice,
    error: invoiceError,
  } = trpc.invoices.get.useQuery(
    {
      id,
    },
    {
      enabled: !!id,
    },
  );

  const {
    data: newApplication,
    isInitialLoading: isInitialLoadingApplication,
    error: applicationError,
  } = trpc.invoices.checkIfApplicationExists.useQuery(
    {
      id: newInvoice?.applicationId as string,
    },
    {
      enabled: !!id,
    },
  );

  if (invoiceError || applicationError) {
    return (
      <Alert color="failure">
        {invoiceError?.message ||
          applicationError?.message ||
          "Błąd wczytywania faktury"}
      </Alert>
    );
  }

  if (isInitialLoadingInvoice || isInitialLoadingApplication) {
    return <Spinner size="xl" color="success" />;
  }

  const invoice = newInvoice as Invoice;
  const application = newApplication as Exclude<
    RouterOutputs["invoices"]["checkIfApplicationExists"],
    null
  >;

  return (
    <Card className="w-full">
      <Text as="h2" className="text-lg font-semibold">
        Edytujesz fakturę: {invoice.name}
      </Text>
      <UpdateInvoice invoice={invoice} application={application} />
    </Card>
  );
}

export default withPageAuthRequired(EditInvoicePage);
