import { Text } from "@ekosystem/ui";
import { Card } from "flowbite-react";
import { RouterOutputs } from "../../../../utils/trpc";

export default function InvoiceDetails({
  invoice,
}: {
  invoice: RouterOutputs["invoices"]["getDetails"];
}) {
  return (
    <Card className="flex flex-col gap-4">
      <Text as="h2" className="text-lg font-semibold">
        Szczegóły
      </Text>
      <div className="grid grid-flow-row grid-cols-2">
        <p className="text-gray-500">Numer faktury</p>
        <Text>{invoice.invoiceId}</Text>
        <p className="text-gray-500">Numer wniosku</p>
        <Text>{invoice.applicationId}</Text>
        <p className="text-gray-500">Data wydania</p>
        <Text>{invoice.issueDate?.toLocaleString()}</Text>
        <p className="text-gray-500">Opłacono węgla</p>
        <Text>{invoice.amount.toString()} kg</Text>
        <p className="text-gray-500">Dodatkowe informacje</p>
        <Text>{invoice?.additionalInformation}</Text>
        <div className="h-6" />
        <div className="h-6" />
        <p className="text-gray-500">Liczba wydań towaru</p>
        <Text>{invoice.stockIssues?.length}</Text>
        <p className="text-gray-500">Odebrano łącznie</p>
        <Text>{invoice.coalWithdrawn} kg</Text>
        <div className="h-6" />
        <div className="h-6" />
        <p className="text-gray-500">Dodano dnia</p>
        <Text>{invoice.createdAt?.toLocaleString()}</Text>
        <p className="text-gray-500">Dodano przez</p>
        <Text className="break-all">{invoice.createdBy}</Text>
        <p className="text-gray-500">Ostatnio aktualizowano dnia</p>
        <Text>{invoice.updatedAt?.toLocaleString() || "-"}</Text>
        <p className="text-gray-500">Ostatnio aktualizowano przez</p>
        <Text className="break-all">{invoice.updatedBy || "-"}</Text>
      </div>
    </Card>
  );
}
