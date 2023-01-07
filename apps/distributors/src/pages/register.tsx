import { Text } from "@ekosystem/ui";
import { Card } from "flowbite-react";
import Register from "../modules/Register";
import { withAuth } from "../hoc/withAuth";

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

export default withAuth(RegisterPage);
