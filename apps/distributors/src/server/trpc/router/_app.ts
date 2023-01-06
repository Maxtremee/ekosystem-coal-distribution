import { router } from "../trpc";
import { authRouter } from "./auth";
import { distributionCentersRouter } from "./distributionCenters";
import { stockIssuesRouter } from "./stockIssues";

export const appRouter = router({
  auth: authRouter,
  stockIssues: stockIssuesRouter,
  distributionCenters: distributionCentersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
