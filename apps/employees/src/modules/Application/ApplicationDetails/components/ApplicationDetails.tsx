import { Text } from "@ekosystem/ui";
import { Card } from "flowbite-react";
import { RouterOutputs } from "../../../../utils/trpc";

export default function ApplicationDetails({
  application,
}: {
  application: RouterOutputs["applications"]["getDetails"];
}) {
  return (
    <Card className="flex flex-col gap-4">
      <Text as="h2" className="text-lg font-semibold">
        Szczegóły
      </Text>
      <div className="grid grid-flow-row grid-cols-2">
        <p className="text-gray-500">Imię i nazwisko</p>
        <Text>{application.applicantName}</Text>
        <p className="text-gray-500">Numer wniosku</p>
        <Text>{application.applicationId || "-"}</Text>
        <p className="text-gray-500">Data wydania</p>
        <Text>{application.issueDate?.toLocaleString()}</Text>
        <p className="text-gray-500">Dodatkowe informacje</p>
        <Text className="break-all">
          {application.additionalInformation || "-"}
        </Text>
        <div className="h-6" />
        <div className="h-6" />
        <p className="text-gray-500">Zadeklarowano: ekogroszek</p>
        <Text>{application.declaredEcoPeaCoal?.toString() || 0} kg</Text>
        <p className="text-gray-500">Zadeklarowano: orzech</p>
        <Text>{application.declaredNutCoal?.toString() || 0} kg</Text>
        <div className="h-6" />
        <div className="h-6" />
        <p className="text-gray-500">Liczba faktur</p>
        <Text>{application.invoices?.length}</Text>
        <p className="text-gray-500">Ilość w fakturach: ekogroszek</p>
        <Text>{application.ecoPeaCoalInInvoices || 0} kg</Text>
        <p className="text-gray-500">Ilość w fakturach: orzech</p>
        <Text>{application.nutCoalInInvoices || 0} kg</Text>
        <div className="h-6" />
        <div className="h-6" />
        <p className="text-gray-500">Liczba wydań towaru</p>
        <Text>{application.stockIssuesTotal}</Text>
        <p className="text-gray-500">Odebrano: ekogroszek</p>
        <Text>{application.ecoPeaCoalWithdrawn || 0} kg</Text>
        <p className="text-gray-500">Odebrano: orzech</p>
        <Text>{application.nutCoalWithdrawn || 0} kg</Text>
        <div className="h-6" />
        <div className="h-6" />
        <p className="text-gray-500">Dodano dnia</p>
        <Text>{application.createdAt?.toLocaleString()}</Text>
        <p className="text-gray-500">Dodano przez</p>
        <Text className="break-all">{application.createdBy}</Text>
        <p className="text-gray-500">Ostatnio aktualizowano dnia</p>
        <Text>{application.updatedAt?.toLocaleString() || "-"}</Text>
        <p className="text-gray-500">Ostatnio aktualizowano przez</p>
        <Text className="break-all">{application.updatedBy || "-"}</Text>
      </div>
    </Card>
  );
}