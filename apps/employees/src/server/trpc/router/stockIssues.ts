import { Prisma } from "@ekosystem/db";
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
                  applicationId: true,
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
        distributionCenter: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const filters: Prisma.StockIssueWhereInput = {
        DistributionCenter: {
          id:
            input?.distributionCenter === "all"
              ? undefined
              : input.distributionCenter,
        },
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
          invoiceName: stockIssue.Invoice?.name,
        })),
      };
    }),
  downloadFiltered: protectedProcedure
    .input(
      defaultFilteringSchema.extend({
        distributionCenter: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const stockIssues = await ctx.prisma.stockIssue.findMany({
        where: {
          DistributionCenter: {
            id:
              input?.distributionCenter === "all"
                ? undefined
                : input.distributionCenter,
          },
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
          ],
        },
        orderBy: {
          [input.sortBy]: input.sortDir,
        },
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
      });
      const data = stockIssues?.map((stockIssue) => [
        stockIssue.id,
        stockIssue.createdAt.toLocaleString("pl").replace(", ", " "),
        stockIssue.DistributionCenter?.name,
        stockIssue.nutCoalIssued?.toString(),
        stockIssue.nutCoalIssued?.toString(),
        stockIssue.additionalInformation,
        stockIssue.Invoice?.name,
      ]);
      const header = [
        "identyfikator",
        "data",
        "nazwa składu",
        "orzech [kg]",
        "groszek [kg]",
        "dodatkowe informacje",
        "numer faktury",
      ];
      return { data, header };
    }),
});
