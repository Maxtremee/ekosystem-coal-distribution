import { router } from "../trpc";
import { authRouter } from "./auth";
import { distributionCentersRouter } from "./distributionCenters";
import { importRouter } from "./import";
import { invoicesRouter } from "./invoices";
import { stockIssuesRouter } from "./stockIssues";

export const appRouter = router({
  auth: authRouter,
  invoices: invoicesRouter,
  stockIssues: stockIssuesRouter,
  distributionCenters: distributionCentersRouter,
  import: importRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
