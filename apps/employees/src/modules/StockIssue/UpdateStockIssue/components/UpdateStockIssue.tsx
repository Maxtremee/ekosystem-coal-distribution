import { InputError } from "@ekosystem/ui";
import { Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { useDebounce } from "react-use";
import { RouterOutputs, trpc } from "../../../../utils/trpc";
import UpdateStockIssueForm from "./UpdateStockIssueForm";

export default function UpdateStockIssue({
  stockIssue,
}: {
  stockIssue: RouterOutputs["stockIssues"]["getDetails"];
}) {
  const [invoiceName, setInvoiceName] = useState(
    stockIssue?.Invoice?.name || "",
  );
  const [debouncedInvoiceName, setDebouncedInvoiceName] = useState(invoiceName);

  useDebounce(
    () => {
      setDebouncedInvoiceName(invoiceName);
    },
    600,
    [invoiceName],
  );

  const { data, isInitialLoading, error } =
    trpc.stockIssues.checkInvoice.useQuery(
      {
        invoiceName: debouncedInvoiceName,
      },
      {
        enabled: !!debouncedInvoiceName,
      },
    );

  return (
    <>
      <div>
        <div className="flex gap-2">
          <Label htmlFor="invoiceName">Numer faktury</Label>
          {isInitialLoading && <Spinner size="sm" color="success" />}
        </div>
        <TextInput
          id="invoiceName"
          placeholder="Numer faktury"
          value={invoiceName}
          onChange={(e) => setInvoiceName(e.target.value)}
        />
        <InputError error={error?.message} />
      </div>
      <div className={`${!data && "pointer-events-none opacity-50"}`}>
        <UpdateStockIssueForm stockIssue={stockIssue} invoice={data} />
      </div>
    </>
  );
}
