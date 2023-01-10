import { TRPCError } from "@trpc/server";
import { z } from "zod";
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
  getDetails: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.$transaction([
          ctx.prisma.distributionCenter.findUniqueOrThrow({
            where: {
              id: input.id,
            },
          }),
          ctx.prisma.stockIssue.count({
            where: {
              distributionCenterId: input.id,
            },
          }),
        ]);
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Nie ma takiego skupu",
        });
      }
    }),
});
