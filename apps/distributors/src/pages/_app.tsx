// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0/client";

import { trpc } from "../utils/trpc";
import RenderLayout from "../components/RenderLayout";
import Head from "next/head";

const App: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <>
      <Head>
        <title>EkoSystem Coal Distribution Employees</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UserProvider>
        <RenderLayout>
          <Component {...pageProps} />
        </RenderLayout>
      </UserProvider>
    </>
  );
};

export default trpc.withTRPC(App);
