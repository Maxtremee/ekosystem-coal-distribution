import { router } from "../trpc";
import { applicationsRouter } from "./applications";
import { authRouter } from "./auth";
import { distributionCentersRouter } from "./distributionCenters";
import { invoicesRouter } from "./invoices";
import { stockIssuesRouter } from "./stockIssues";

export const appRouter = router({
  auth: authRouter,
  applications: applicationsRouter,
  invoices: invoicesRouter,
  stockIssues: stockIssuesRouter,
  distributionCenters: distributionCentersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
