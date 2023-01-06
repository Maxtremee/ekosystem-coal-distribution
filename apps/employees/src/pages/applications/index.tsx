import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import ApplicationsList from "../../modules/ApplicationsList";

function ApplicationsPage() {
  return <ApplicationsList />;
}

export default withPageAuthRequired(ApplicationsPage);
