import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Text } from "@ekosystem/ui";
import { Alert, Card, Spinner } from "flowbite-react";
import { useRouter } from "next/router";
import AddInvoice from "../../modules/Invoice/AddInvoice";
import { trpc } from "../../utils/trpc";

function AddInvoicePage() {
  const router = useRouter();
  const params = new URLSearchParams(router.query as Record<string, string>);

  const { data, isInitialLoading, isError } =
    trpc.invoices.checkIfApplicationExists.useQuery(
      {
        id: params.get("applicationId") as string,
      },
      {
        enabled: !!params.get("applicationId"),
      },
    );

  if (isInitialLoading) {
    return <Spinner size="xl" color="success" />;
  }

  if (isError || !data) {
    return <Alert color="failure">Błąd dodawania faktury</Alert>;
  }

  return (
    <Card>
      <Text as="h2" className="text-lg font-semibold">
        Nowa faktura dla wniosku: {data.applicationId}
      </Text>
      <AddInvoice application={data} />
    </Card>
  );
}

export default withPageAuthRequired(AddInvoicePage);
