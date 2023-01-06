import { Prisma } from "@acme/db";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import defaultFilteringSchema from "../../../schemas/defaultFilteringSchema";

export const stockIssuesRouter = router({
  getDetails: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.stockIssue.findUnique({
        where: {
          id: input.id,
        },
        include: {
          DistributionCenter: {
            select: {
              name: true,
              id: true,
            },
          },
          Invoice: {
            select: {
              name: true,
              id: true,
              Application: {
                select: {
                  id: true,
                  applicantName: true,
                },
              },
            },
          },
        },
      });
    }),
  getFiltered: protectedProcedure
    .input(
      defaultFilteringSchema.extend({
        invoiceId: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const filters: Prisma.StockIssueWhereInput = {
        invoiceId: input?.invoiceId,
        OR: [
          {
            DistributionCenter: {
              name: {
                contains: input?.search,
                mode: "insensitive",
              },
            },
          },
          {
            Invoice: {
              name: {
                contains: input?.search,
                mode: "insensitive",
              },
            },
          },
          {
            Invoice: {
              Application: {
                applicantName: {
                  contains: input?.search,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      };
      const data = await ctx.prisma.$transaction([
        ctx.prisma.stockIssue.count({
          where: filters,
        }),
        ctx.prisma.stockIssue.findMany({
          skip: input?.skip,
          take: input?.take,
          include: {
            Invoice: {
              select: {
                name: true,
              },
            },
            DistributionCenter: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            [input.sortBy]: input.sortDir,
          },
          where: filters,
        }),
      ]);
      return {
        total: data[0],
        stockIssues: data[1].map((stockIssue) => ({
          ...stockIssue,
          distributionCenterName: stockIssue.DistributionCenter?.name,
          invoiceName: stockIssue.DistributionCenter?.name,
        })),
      };
    }),
});
