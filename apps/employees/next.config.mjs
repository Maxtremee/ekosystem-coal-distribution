// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

import { withSentryConfig } from "@sentry/nextjs";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["@ekosystem/db", "@ekosystem/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ekosystem.wroc.pl",
        port: "",
        pathname: "/wp-content/**",
      },
    ],
  },
  sentry: {
    hideSourceMaps: true,
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
};

export default withSentryConfig(config, sentryWebpackPluginOptions);
