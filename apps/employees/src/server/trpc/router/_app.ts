import { router } from "../trpc";
import { authRouter } from "./auth";
import { invoicesRouter } from "./invoices";

export const appRouter = router({
  invoices: invoicesRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
