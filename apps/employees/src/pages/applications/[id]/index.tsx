import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Text } from "@ekosystem/ui";
import { Alert, Button, Spinner } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ApplicationDetails,
  ApplicationTimeline,
} from "../../../modules/Application/ApplicationDetails";
import { trpc } from "../../../utils/trpc";

function ApplicationDetailsPage() {
  const router = useRouter();
  const utils = trpc.useContext();
  const id = router.query.id as string;

  const { data, isLoading, error } = trpc.applications.getDetails.useQuery(
    {
      id,
    },
    {
      onSuccess: (res) => {
        utils.applications.get.setData(
          {
            id,
          },
          () => res,
        );
      },
    },
  );

  if (error) {
    return (
      <Alert color="failure">
        {error?.message || "Błąd wczytywania wniosku"}
      </Alert>
    );
  }

  if (isLoading) {
    return <Spinner size="xl" color="success" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Text as="h1" className="text-2xl font-bold">
          {data.applicationId}
        </Text>
        <div className="flex gap-3">
          <Link
            href={{
              pathname: `/invoices/add`,
              query: {
                applicationId: data.id,
              },
            }}
            passHref
          >
            <Button>Dodaj fakturę</Button>
          </Link>
          <Link
            href={{
              pathname: `/applications/${data.id}/edit`,
            }}
            passHref
          >
            <Button color="warning">Edytuj</Button>
          </Link>
        </div>
      </div>
      <ApplicationDetails application={data} />
      <ApplicationTimeline id={id} />
    </div>
  );
}

export default withPageAuthRequired(ApplicationDetailsPage);
