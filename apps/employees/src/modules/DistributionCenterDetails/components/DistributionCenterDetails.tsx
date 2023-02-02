import { Text } from "@ekosystem/ui";
import { Card } from "flowbite-react";
import { RouterOutputs } from "../../../utils/trpc";

export default function DistributionCenterDetails({
  distributionCenter,
}: {
  distributionCenter: RouterOutputs["distributionCenters"]["getDetails"];
}) {
  const center = distributionCenter[0];
  const issuesCount = distributionCenter[1];
  return (
    <Card className="flex flex-col gap-4">
      <Text as="h2" className="text-lg font-semibold">
        Szczegóły
      </Text>
      <div className="grid grid-flow-row grid-cols-2">
        <p className="text-gray-500">Nazwa</p>
        <Text>{center.name}</Text>
        <p className="text-gray-500">Adres</p>
        <Text>{center.address}</Text>
        <p className="text-gray-500">Adres email</p>
        <Text>{center.email}</Text>
        <p className="text-gray-500">Zarejestrowano</p>
        <Text>{center.createdAt.toLocaleString()}</Text>
        <div className="h-6" />
        <div className="h-6" />
        <p className="text-gray-500">Łączna liczba wydań towaru</p>
        <Text>{issuesCount}</Text>
      </div>
    </Card>
  );
}
