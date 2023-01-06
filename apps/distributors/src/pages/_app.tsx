import "../styles/globals.css";
import type { AppType } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { NextAdapter } from "next-query-params";
import { QueryParamProvider } from "use-query-params";

import { trpc } from "../utils/trpc";
import RenderLayout from "../components/RenderLayout";
import Head from "next/head";

const App: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <>
      <Head>
        <title>EkoSystem Coal Distributors</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <QueryParamProvider adapter={NextAdapter}>
        <UserProvider>
          <RenderLayout>
            <Component {...pageProps} />
          </RenderLayout>
        </UserProvider>
      </QueryParamProvider>
    </>
  );
};

export default trpc.withTRPC(App);
