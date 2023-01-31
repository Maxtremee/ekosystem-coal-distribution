import { Text } from "@ekosystem/ui";
import { Alert, Spinner } from "flowbite-react";
import { useRouter } from "next/router";
import DistributionCenterDetails, {
  DistributionCenterTimeline,
} from "../../modules/DistributionCenterDetails";
import { trpc } from "../../utils/trpc";

export default function DistributionCenterDetailsPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, isLoading, error } =
    trpc.distributionCenters.getDetails.useQuery(
      {
        id,
      },
      {
        enabled: !!id,
      },
    );

  if (error) {
    return (
      <Alert color="failure">
        {error?.message || "Błąd wczytywania skupu"}
      </Alert>
    );
  }

  if (isLoading) {
    return <Spinner size="xl" color="success" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Text as="h2" className="text-lg font-semibold">
        {data[0].name}
      </Text>
      <DistributionCenterDetails distributionCenter={data} />
      <DistributionCenterTimeline id={id} />
    </div>
  );
}
