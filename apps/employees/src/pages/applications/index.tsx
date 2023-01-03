import { Text } from "@acme/ui";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import ApplicationsList from "../../modules/ApplicationsList";

function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-4">
      <Text>Lista wniosków</Text>
      <ApplicationsList />
    </div>
  );
}

export default withPageAuthRequired(ApplicationsPage);
