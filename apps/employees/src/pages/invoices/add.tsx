import { Text } from "@acme/ui";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Card } from "flowbite-react";
import AddInvoiceForm from "../../modules/components/AddInvoiceForm";

function AddInvoicePage() {
  return (
    <Card className="w-full">
      <Text as="h5">Dodaj nową fakturę</Text>
      <AddInvoiceForm />
    </Card>
  );
}

export default withPageAuthRequired(AddInvoicePage);
