import { router } from "../trpc";
import { authRouter } from "./auth";
import { distributionCentersRouter } from "./distributionCenters";
import { importRouter } from "./import";
import { invoicesRouter } from "./invoices";
import { statsRouter } from "./stats";
import { stockIssuesRouter } from "./stockIssues";

export const appRouter = router({
  auth: authRouter,
  distributionCenters: distributionCentersRouter,
  import: importRouter,
  invoices: invoicesRouter,
  stats: statsRouter,
  stockIssues: stockIssuesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
