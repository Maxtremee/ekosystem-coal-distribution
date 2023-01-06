import { InputError, Text } from "@ekosystem/ui";
import { Card, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { useDebounce } from "react-use";
import { withAuth } from "../../hoc/withAuth";
import AddStockIssue from "../../modules/AddStockIssue";
import { trpc } from "../../utils/trpc";

function AddStockIssuePage() {
  const [invoiceName, setInvoiceName] = useState("");
  const [debouncedInvoiceName, setDebouncedInvoiceName] = useState(invoiceName);
  const [invoiceError, setInvoiceError] = useState("");

  const { data, isInitialLoading } = trpc.stockIssues.checkForInvoice.useQuery(
    {
      name: debouncedInvoiceName,
    },
    {
      enabled: !!debouncedInvoiceName,
      onSuccess: (res) => {
        if (!res?.id) {
          setInvoiceError("Taka faktura nie istnieje");
        } else {
          setInvoiceError("");
        }
      },
      onError: (err) => {
        setInvoiceError(err.message);
      },
    },
  );

  useDebounce(
    () => {
      setDebouncedInvoiceName(invoiceName);
    },
    600,
    [invoiceName],
  );

  return (
    <Card className="w-full">
      <Text as="h5">Wydaj towar</Text>
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
      {!!invoiceError && <InputError error={invoiceError} />}
      <AddStockIssue invoice={data} />
    </Card>
  );
}

export default withAuth(AddStockIssuePage);
