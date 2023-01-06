import { Text } from "@ekosystem/ui";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Card } from "flowbite-react";
import Register from "../modules/Register";

function RegisterPage() {
  return (
    <Card>
      <Text>
        Wygląda na to, że korzystasz z systemu pierwszy raz. Podaj dane Twojej
        firmy, aby przejść dalej
      </Text>
      <Register />
    </Card>
  );
}

export default withPageAuthRequired(RegisterPage);
