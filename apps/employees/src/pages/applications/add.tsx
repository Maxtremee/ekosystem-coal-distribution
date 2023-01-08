import { Text } from "@ekosystem/ui";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Card } from "flowbite-react";
import UpsertApplicationForm from "../../modules/Application/AddApplication/components/AddApplicationForm";

function AddInvoicePage() {
  return (
    <Card className="w-full">
      <Text as="h2" className="text-lg font-semibold">
        Dodaj nowy wniosek
      </Text>
      <UpsertApplicationForm />
    </Card>
  );
}

export default withPageAuthRequired(AddInvoicePage);
