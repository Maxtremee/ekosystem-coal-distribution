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
  getTimeline: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 3;
      const { cursor } = input;
      const items = await ctx.prisma.stockIssue.findMany({
        take: limit,
        ...(cursor && {
          skip: 1,
          cursor: {
            id: cursor,
          },
        }),
        where: {
          distributionCenterId: input.id,
        },
        orderBy: {
          id: "desc",
        },
        select: {
          id: true,
          createdAt: true,
          distributionCenterId: true,
          ecoPeaCoalIssued: true,
          nutCoalIssued: true,
          DistributionCenter: {
            select: {
              name: true,
            },
          },
        },
      });
      let nextCursor: typeof cursor = undefined;
      const adjustedLimit = limit - 1;
      if (items.length > adjustedLimit) {
        nextCursor = items[adjustedLimit]!.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
});
