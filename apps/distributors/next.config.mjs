// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    transpilePackages: ["@acme/db"],
  },
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
};

export default config;