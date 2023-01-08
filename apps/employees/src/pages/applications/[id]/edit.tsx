import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Application } from "@ekosystem/db";
import { Text } from "@ekosystem/ui";
import { Alert, Card, Spinner } from "flowbite-react";
import { useRouter } from "next/router";
import UpdateApplication from "../../../modules/Application/UpdateApplication";
import { trpc } from "../../../utils/trpc";

function EditApplicationPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const utils = trpc.useContext();
  const prefetched = utils.applications.getDetails.getData({
    id,
  });
  const {
    data: newData,
    isInitialLoading,
    error,
  } = trpc.applications.get.useQuery(
    {
      id,
    },
    {
      enabled: !!id && !prefetched,
    },
  );

  if (error) {
    return (
      <Alert color="failure">
        {error?.message || "Błąd wczytywania wniosku"}
      </Alert>
    );
  }

  if (isInitialLoading) {
    return <Spinner size="xl" color="success" />;
  }
  const data = (prefetched || newData) as Application;

  return (
    <Card className="w-full">
      <Text as="h2" className="text-lg font-semibold">
        Edytujesz wniosek: {data?.applicationId || data.applicantName}
      </Text>
      <UpdateApplication application={data} />
    </Card>
  );
}

export default withPageAuthRequired(EditApplicationPage);
