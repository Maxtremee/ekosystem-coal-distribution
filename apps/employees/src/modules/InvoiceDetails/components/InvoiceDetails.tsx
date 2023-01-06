import { Text } from "@ekosystem/ui";
import { Card } from "flowbite-react";
import Link from "next/link";
import { RouterOutputs } from "../../../utils/trpc";

export default function InvoiceDetails({
  invoice,
}: {
  invoice: RouterOutputs["invoices"]["getDetails"];
}) {
  return (
    <Card className="flex flex-col gap-4">
      <Text as="h5">Szczegóły faktury</Text>
      <div className="grid grid-flow-row grid-cols-2">
        <p className="text-gray-500">Numer faktury</p>
        <Text>{invoice.name}</Text>
        <p className="text-gray-500">Identyfikator wniosku</p>
        <Link href={`/applications/${invoice?.Application?.id}`} passHref>
          <Text as="span" className="underline hover:cursor-pointer">
            {invoice?.Application?.id} ({invoice?.Application?.applicantName})
          </Text>
        </Link>
        <p className="text-gray-500">Data wydania</p>
        <Text>{invoice.issueDate?.toLocaleDateString()}</Text>
        <div className="h-6" />
        <div className="h-6" />
        <p className="text-gray-500">Opłacono: ekogroszek</p>
        <Text>{invoice.declaredEcoPeaCoal?.toString() || 0} kg</Text>
        <p className="text-gray-500">Opłacono: orzech</p>
        <Text>{invoice.declaredNutCoal?.toString() || 0} kg</Text>
        <p className="text-gray-500">Liczba wydań towaru</p>
        <Text>{invoice.stockIssues?.length}</Text>
        <p className="text-gray-500">Odebrano: ekogroszek</p>
        <Text>{invoice.ecoPeaCoalWithdrawn || 0} kg</Text>
        <p className="text-gray-500">Odebrano: orzech</p>
        <Text>{invoice.nutCoalWithdrawn || 0} kg</Text>
        <div className="h-6" />
        <div className="h-6" />
        <p className="text-gray-500">Dodano dnia</p>
        <Text>{invoice.createdAt?.toLocaleDateString()}</Text>
        <p className="text-gray-500">Dodano przez</p>
        <Text className="break-all">{invoice.createdBy}</Text>
        <p className="text-gray-500">Ostatnio aktualizowano dnia</p>
        <Text>{invoice.updatedAt?.toLocaleDateString() || "-"}</Text>
        <p className="text-gray-500">Ostatnio aktualizowano przez</p>
        <Text className="break-all">{invoice.updatedBy || "-"}</Text>
      </div>
    </Card>
  );
}
