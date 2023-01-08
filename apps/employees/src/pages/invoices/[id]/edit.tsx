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
  const utils = trpc.useContext();
  const prefetchedInvoice = utils.invoices.getDetails.getData({
    id,
  });
  const {
    data: newInvoice,
    isInitialLoading: isInitialLoadingInvoice,
    error: invoiceError,
  } = trpc.invoices.get.useQuery(
    {
      id,
    },
    {
      enabled: !!id && !prefetchedInvoice,
    },
  );

  const prefetchedApplication = utils.invoices.checkIfApplicationExists.getData(
    {
      id: (prefetchedInvoice?.applicationId ||
        newInvoice?.applicationId) as string,
    },
  );
  const {
    data: newApplication,
    isInitialLoading: isInitialLoadingApplication,
    error: applicationError,
  } = trpc.invoices.checkIfApplicationExists.useQuery(
    {
      id: (prefetchedInvoice?.applicationId ||
        newInvoice?.applicationId) as string,
    },
    {
      enabled: !!id && !prefetchedApplication,
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

  const invoice = (prefetchedInvoice || newInvoice) as Invoice;
  const application = (prefetchedApplication || newApplication) as Exclude<
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
