import { Text } from "@acme/ui";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import InvoicesList from "../../modules/InvoicesList";

function InvoicesPage() {
  return (
    <div className="flex flex-col gap-4">
      <Text>Lista faktur</Text>
      <InvoicesList />
    </div>
  );
}

export default withPageAuthRequired(InvoicesPage);
