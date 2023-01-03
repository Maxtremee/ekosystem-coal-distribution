import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "flowbite-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user?.email) {
      router.push("/applications");
    }
  }, [user]);

  return (
    <Button href="/api/auth/login?returnTo=/applications" color="success">
      Zaloguj się
    </Button>
  );
};

export default Home;
