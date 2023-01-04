import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, [router]);

  return <div />;
}
