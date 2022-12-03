// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0/client";

import { trpc } from "../utils/trpc";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
};

export default trpc.withTRPC(MyApp);
