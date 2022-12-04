import { Text } from "@acme/ui";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

function InvoicesPage() {
  return <Text>Dashboard page</Text>;
}

export default withPageAuthRequired(InvoicesPage);
