import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Text } from "@ekosystem/ui";
import { Card } from "flowbite-react";
import AddInvoice from "../../modules/Invoice/AddInvoice";

function AddInvoicePage() {
  return (
    <Card>
      <Text as="h2" className="text-lg font-semibold">
        Nowa faktura
      </Text>
      <AddInvoice />
    </Card>
  );
}

export default withPageAuthRequired(AddInvoicePage);
