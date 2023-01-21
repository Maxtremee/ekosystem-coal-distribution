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
  const [invoiceId, setInvoiceId] = useState(
    stockIssue?.Invoice?.invoiceId || "",
  );
  const [debouncedInvoiceId, setDebouncedInvoiceId] = useState(invoiceId);

  useDebounce(
    () => {
      setDebouncedInvoiceId(invoiceId);
    },
    600,
    [invoiceId],
  );

  const { data, isInitialLoading, error } =
    trpc.stockIssues.checkInvoice.useQuery(
      {
        invoiceId: debouncedInvoiceId,
      },
      {
        enabled: !!debouncedInvoiceId,
        retry: 1,
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
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
        />
        <InputError error={error?.message} />
      </div>
      <div className={`${!data && "pointer-events-none opacity-50"}`}>
        <UpdateStockIssueForm stockIssue={stockIssue} invoice={data} />
      </div>
    </>
  );
}
