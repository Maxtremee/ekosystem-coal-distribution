import { Button } from "flowbite-react";

export default function NavbarItems() {
  return (
    <>
      <Button href="/api/auth/logout" color="success">
        Wyloguj się
      </Button>
    </>
  );
}
