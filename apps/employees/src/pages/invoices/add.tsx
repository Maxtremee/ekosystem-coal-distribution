import { InputError, Text } from "@acme/ui";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { Card, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useDebounce } from "react-use";
import AddInvoiceForm from "../../modules/AddInvoice/components/AddInvoiceForm";
import { trpc } from "../../utils/trpc";

function AddInvoicePage() {
  const [debouncedApplicationName, setDebouncedApplicationName] = useState("");

  const [applicationName, setApplicationName] = useState("");
  const [applicationError, setApplicationError] = useState("");

  const { data: application, isInitialLoading } =
    trpc.invoices.checkIfApplicationExists.useQuery(
      { name: debouncedApplicationName },
      {
        enabled: !!debouncedApplicationName,
        onSuccess: (data) => {
          if (!data) {
            setApplicationError("Taki numer wniosku nie istnieje");
          } else {
            setApplicationError("");
          }
        },
      },
    );

  useDebounce(
    () => {
      setDebouncedApplicationName(applicationName);
    },
    600,
    [applicationName],
  );

  return (
    <Card className="w-full">
      <Text as="h5">Dodaj nową fakturę</Text>
      <div>
        <Label htmlFor="invoiceName">
          Nazwa wniosku
          {isInitialLoading && (
            <ArrowPathIcon className="ml-2 inline h-4 animate-spin" />
          )}
        </Label>
        <TextInput
          id="applicationName"
          placeholder="Nazwa wniosku"
          value={applicationName}
          onChange={(event) => setApplicationName(event.target.value)}
        />
        <InputError error={applicationError} />
      </div>
      <AddInvoiceForm application={application} />
    </Card>
  );
}

export default withPageAuthRequired(AddInvoicePage);
