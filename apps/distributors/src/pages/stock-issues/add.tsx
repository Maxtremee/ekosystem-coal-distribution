import { InputError, Text } from "@ekosystem/ui";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { Alert, Card, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { useDebounce } from "react-use";
import { withAuth } from "../../hoc/withAuth";
import AddStockIssue from "../../modules/AddStockIssue";
import { trpc } from "../../utils/trpc";

function AddStockIssuePage() {
  const [invoiceName, setInvoiceName] = useState("");
  const [appNameOrId, setAppNameOrId] = useState("");
  const [debouncedInvoiceName, setDebouncedInvoiceName] = useState(invoiceName);
  const [debouncedAppNameOrId, setDebouncedAppNameOrId] = useState(appNameOrId);

  const { data, isInitialLoading, error } =
    trpc.stockIssues.checkInvoice.useQuery(
      {
        invoiceName: debouncedInvoiceName,
        appNameOrId: debouncedAppNameOrId,
      },
      {
        enabled: !!debouncedInvoiceName && !!debouncedAppNameOrId,
        retry: false,
      },
    );

  useDebounce(
    () => {
      setDebouncedInvoiceName(invoiceName);
    },
    600,
    [invoiceName],
  );

  useDebounce(
    () => {
      setDebouncedAppNameOrId(appNameOrId);
    },
    600,
    [appNameOrId],
  );

  return (
    <Card className="w-full">
      <Text as="h2" className="text-lg font-semibold">
        Wydaj towar
      </Text>
      {!data && (
        <Alert color="info" icon={QuestionMarkCircleIcon}>
          Podaj prawidłowe dane aby odblokować resztę formularza
        </Alert>
      )}
      <div className="flex w-full items-center gap-4">
        <div className="w-full">
          <div className="flex gap-2">
            <Label htmlFor="invoiceName">Numer faktury</Label>
            {isInitialLoading && <Spinner size="sm" color="success" />}
          </div>
          <TextInput
            id="invoiceName"
            placeholder="Numer faktury"
            type="string"
            value={invoiceName}
            onChange={(event) => setInvoiceName(event.currentTarget.value)}
          />
          <InputError error={error?.message} />
        </div>
        <div className="w-full">
          <div className="flex gap-2">
            <Label htmlFor="applicationIdentification">
              Identyfikator wniosku
            </Label>
            {isInitialLoading && <Spinner size="sm" color="success" />}
          </div>
          <TextInput
            id="applicationIdentification"
            placeholder="Numer wniosku lub imię i nazwisko"
            type="string"
            value={appNameOrId}
            onChange={(event) => setAppNameOrId(event.currentTarget.value)}
          />
          <InputError error={error?.message} />
        </div>
      </div>
      <AddStockIssue invoice={data} />
    </Card>
  );
}

export default withAuth(AddStockIssuePage);
