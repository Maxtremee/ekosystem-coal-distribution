import { router } from "../trpc";
import { applicationsRouter } from "./application";
import { authRouter } from "./auth";
import { invoicesRouter } from "./invoices";

export const appRouter = router({
  auth: authRouter,
  applications: applicationsRouter,
  invoices: invoicesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
