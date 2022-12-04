import { LandingPageLayout } from "@acme/ui";
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
      router.push("/dashboard")
    }
  }, [user]);

  return <Button href="/api/auth/login" color="success">Zaloguj się</Button>;
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: session } = trpc.auth.getSession.useQuery();

//   const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
//     undefined,
//     { enabled: !!session?.user },
//   );

//   console.log(session, user);
//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       {session?.user && (
//         <p className="text-center text-2xl text-white">
//           {session && <span>Logged in as {session?.user?.name}</span>}
//           {secretMessage && <span> - {secretMessage}</span>}
//         </p>
//       )}
//       {session?.user && <p>{JSON.stringify(session.user)}</p>}
//       <a
//         href="/api/auth/login"
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//       >
//         {session ? "Sign out" : "Sign in"}
//       </a>
//     </div>
//   );
// };
