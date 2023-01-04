import { Text } from "@acme/ui";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Card } from "flowbite-react";
import AddApplicationForm from "../../modules/AddApplication/components/AddApplicationForm";

function AddInvoicePage() {
  return (
    <Card className="w-full">
      <Text as="h5">Dodaj nowy wniosek</Text>
      <AddApplicationForm />
    </Card>
  );
}

export default withPageAuthRequired(AddInvoicePage);
