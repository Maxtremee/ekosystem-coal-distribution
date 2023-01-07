import { useUser } from "@auth0/nextjs-auth0/client";
import { Text } from "@ekosystem/ui";
import { Avatar, Button } from "flowbite-react";

export default function NavbarItems() {
  const { user } = useUser();
  return (
    <>
      <div className="flex h-[42px] items-center gap-2 rounded-md bg-gray-200 py-2 px-3 dark:bg-gray-700">
        {user?.picture && <Avatar img={user?.picture} size="xs" rounded />}
        <Text>{user?.email}</Text>
      </div>
      <Button href="/api/auth/logout" color="success">
        Wyloguj się
      </Button>
    </>
  );
}
