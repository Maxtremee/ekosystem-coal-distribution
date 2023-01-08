import { protectedProcedure, router } from "../trpc";

export const distributionCentersRouter = router({
  getIdsAndNames: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.distributionCenter.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }),
});
