import { Text } from "@ekosystem/ui";
import { Card } from "flowbite-react";
import Link from "next/link";
import { RouterOutputs } from "../../../utils/trpc";

export default function StockIssueDetails({
  stockIssue,
}: {
  stockIssue: RouterOutputs["stockIssues"]["getDetails"];
}) {
  return (
    <Card className="flex flex-col gap-4">
      <Text as="h5">Szczegóły wydania towaru</Text>
      <div className="grid grid-flow-row grid-cols-2">
        <p className="text-gray-500">Numer faktury</p>
        <Link href={`/invoices/${stockIssue?.invoiceId}`} passHref>
          <Text as="span" className="underline hover:cursor-pointer">
            {stockIssue?.Invoice?.name}
          </Text>
        </Link>
        <p className="text-gray-500">Imię i nazwisko wnioskodawcy</p>
        <Link
          href={`/applications/${stockIssue?.Invoice?.Application?.id}`}
          passHref
        >
          <Text as="span" className="underline hover:cursor-pointer">
            {stockIssue?.Invoice?.Application?.applicantName}
          </Text>
        </Link>
        <p className="text-gray-500">Numer wniosku</p>
        <Link
          href={`/applications/${stockIssue?.Invoice?.Application?.id}`}
          passHref
        >
          <Text as="span" className="underline hover:cursor-pointer">
            {stockIssue?.Invoice?.Application?.applicationId}
          </Text>
        </Link>
        <div className="h-6" />
        <div className="h-6" />
        <p className="text-gray-500">Data wydania</p>
        <Text>{stockIssue?.createdAt.toLocaleDateString()}</Text>
        <p className="text-gray-500">Wydano: ekogroszek</p>
        <Text>{stockIssue?.ecoPeaCoalIssued?.toString() || 0} kg</Text>
        <p className="text-gray-500">Wydano: orzech</p>
        <Text>{stockIssue?.nutCoalIssued?.toString() || 0} kg</Text>
        <div className="h-6" />
        <div className="h-6" />
        <p className="text-gray-500">Dodano dnia</p>
        <Text>{stockIssue?.createdAt.toLocaleDateString()}</Text>
        <p className="text-gray-500">Dodano przez</p>
        <Text className="break-all">{stockIssue?.createdBy}</Text>
        <p className="text-gray-500">Ostatnio aktualizowano dnia</p>
        <Text>{stockIssue?.updatedAt?.toLocaleDateString() || "-"}</Text>
        <p className="text-gray-500">Ostatnio aktualizowano przez</p>
        <Text className="break-all">{stockIssue?.updatedBy || "-"}</Text>
      </div>
    </Card>
  );
}
