/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from "react";
import { useRouter } from "next/router";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

import { trpc } from "../utils/trpc";

const useDistributorRegistered = () => {
  const router = useRouter();

  const { data, isLoading } =
    trpc.distributionCenters.checkIfRegistered.useQuery(undefined, {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  if (!isLoading) {
    if (data) {
      if (!data.isRegistered && !router.pathname.startsWith("/register")) {
        router.replace("/register");
      }
      if (data.isRegistered && router.pathname.startsWith("/register")) {
        router.replace("/");
      }
    }
  }
};

const withDistributorRegistered =
  (Component: ComponentType) => (props: any) => {
    useDistributorRegistered();
    return <Component {...props} />;
  };

export const withAuth = (Component: ComponentType) =>
  withPageAuthRequired(withDistributorRegistered(Component));
