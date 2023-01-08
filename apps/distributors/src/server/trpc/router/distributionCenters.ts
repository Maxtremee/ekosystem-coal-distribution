import registerDistributionCenterSchema from "../../../schemas/registerDistributionCenterSchema";
import { router, protectedProcedure } from "../trpc";

export const distributionCentersRouter = router({
  checkIfRegistered: protectedProcedure.query(async ({ ctx }) => {
    try {
      await ctx.prisma.distributionCenter.findUniqueOrThrow({
        where: {
          email: ctx.session.user?.email,
        },
      });
      return { isRegistered: true };
    } catch {
      return { isRegistered: false };
    }
  }),
  getDetails: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.distributionCenter.findUnique({
      where: {
        email: ctx.session.user?.email,
      },
    });
  }),
  register: protectedProcedure
    .input(registerDistributionCenterSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.distributionCenter.create({
        data: {
          ...input,
          email: ctx.session.user.email,
        },
      });
    }),
});
