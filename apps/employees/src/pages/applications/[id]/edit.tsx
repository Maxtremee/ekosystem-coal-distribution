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

  const { data, isInitialLoading, error } = trpc.applications.get.useQuery(
    {
      id,
    },
    {
      enabled: !!id,
    },
  );

  if (isInitialLoading) {
    return <Spinner size="xl" color="success" />;
  }

  if (error) {
    return (
      <Alert color="failure">
        {error?.message || "Błąd wczytywania wniosku"}
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <Text as="h2" className="text-lg font-semibold">
        Edytujesz wniosek: {data?.applicationId}
      </Text>
      <UpdateApplication application={data as Application} />
    </Card>
  );
}

export default withPageAuthRequired(EditApplicationPage);
