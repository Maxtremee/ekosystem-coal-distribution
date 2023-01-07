import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import ApplicationsList from "../../modules/Application/ApplicationsList";

function ApplicationsPage() {
  return <ApplicationsList />;
}

export default withPageAuthRequired(ApplicationsPage);
