import NextAuth, { type NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@acme/db";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Auth0Provider({
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      issuer: env.AUTH0_ISSUER_BASE_URL,
      authorization: {
        params: {
          audience: env.AUTH0_AUDIENCE,
        },
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
