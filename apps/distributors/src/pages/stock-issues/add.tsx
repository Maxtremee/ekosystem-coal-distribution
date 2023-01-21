import { Invoice } from "@ekosystem/db";
import { InputError, Text } from "@ekosystem/ui";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { Alert, Card, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { useDebounce } from "react-use";
import { withAuth } from "../../hoc/withAuth";
import AddStockIssue from "../../modules/AddStockIssue";
import { trpc } from "../../utils/trpc";

function AddStockIssuePage() {
  const [invoiceId, setInvoiceId] = useState("");
  const [debouncedInvoiceId, setDebouncedInvoiceId] = useState(invoiceId);

  const { data, isInitialLoading, error } =
    trpc.stockIssues.checkInvoice.useQuery(
      {
        invoiceId: debouncedInvoiceId,
      },
      {
        enabled: !!debouncedInvoiceId,
        retry: false,
      },
    );

  useDebounce(
    () => {
      setDebouncedInvoiceId(invoiceId);
    },
    600,
    [invoiceId],
  );

  return (
    <Card className="w-full">
      <Text as="h2" className="text-lg font-semibold">
        Wydaj towar
      </Text>
      {!data && (
        <Alert color="info" icon={QuestionMarkCircleIcon}>
          Podaj prawidłowy numer faktury aby odblokować resztę formularza
        </Alert>
      )}
      <div className="w-full">
        <div className="flex gap-2">
          <Label htmlFor="invoiceName">Numer faktury</Label>
          {isInitialLoading && <Spinner size="sm" color="success" />}
        </div>
        <TextInput
          id="invoiceName"
          placeholder="Numer faktury"
          value={invoiceId}
          onChange={(event) => setInvoiceId(event.currentTarget.value)}
        />
        <InputError error={error?.message} />
      </div>
      <AddStockIssue invoice={data} />
    </Card>
  );
}

export default withAuth(AddStockIssuePage);
