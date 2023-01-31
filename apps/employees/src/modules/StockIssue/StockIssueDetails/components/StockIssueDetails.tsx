import { Text } from "@ekosystem/ui";
import { Card } from "flowbite-react";
import Link from "next/link";
import { RouterOutputs } from "../../../../utils/trpc";

export default function StockIssueDetails({
  stockIssue,
}: {
  stockIssue: RouterOutputs["stockIssues"]["getDetails"];
}) {
  return (
    <Card className="flex flex-col gap-4">
      <Text as="h2" className="text-lg font-semibold">
        Szczegóły wydania towaru
      </Text>
      <div className="grid grid-flow-row grid-cols-2">
        <p className="text-gray-500">Numer faktury</p>
        <Link href={`/invoices/${stockIssue?.invoiceId}`} passHref>
          <Text as="span" className="underline hover:cursor-pointer">
            {stockIssue?.Invoice?.invoiceId}
          </Text>
        </Link>
        <div className="h-6" />
        <div className="h-6" />
        <p className="text-gray-500">Miejsce wydania</p>
        <Link
          href={`/distribution-centers/${stockIssue?.distributionCenterId}`}
          passHref
        >
          <Text as="span" className="underline hover:cursor-pointer">
            {stockIssue?.DistributionCenter?.name}
          </Text>
        </Link>
        <p className="text-gray-500">Data wydania</p>
        <Text>{stockIssue?.createdAt.toLocaleString()}</Text>
        <p className="text-gray-500">Wydano łącznie</p>
        <Text>{stockIssue?.coalIssued} kg</Text>
        <p className="text-gray-500">Dodatkowe informacje</p>
        <Text className="break-all">
          {stockIssue?.additionalInformation || "-"}
        </Text>
        <div className="h-6" />
        <div className="h-6" />
        <p className="text-gray-500">Dodano dnia</p>
        <Text>{stockIssue?.createdAt.toLocaleString()}</Text>
        <p className="text-gray-500">Dodano przez</p>
        <Text className="break-all">{stockIssue?.createdBy}</Text>
        <p className="text-gray-500">Ostatnio aktualizowano dnia</p>
        <Text>{stockIssue?.updatedAt?.toLocaleString() || "-"}</Text>
        <p className="text-gray-500">Ostatnio aktualizowano przez</p>
        <Text className="break-all">{stockIssue?.updatedBy || "-"}</Text>
      </div>
    </Card>
  );
}
