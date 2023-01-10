import { Prisma } from "@ekosystem/db";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import defaultFilteringSchema from "../../../schemas/defaultFilteringSchema";
import { TRPCError } from "@trpc/server";
import { baseStockIssueSchema } from "../../../schemas/stockIssueSchema";

export const stockIssuesRouter = router({
  checkInvoice: protectedProcedure
    .input(
      z.object({
        invoiceName: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const invoice = await ctx.prisma.invoice.findFirstOrThrow({
          where: {
            AND: [
              {
                name: {
                  equals: input.invoiceName,
                  mode: "insensitive",
                },
              },
            ],
          },
          include: {
            stockIssues: true,
          },
        });
        return {
          ...invoice,
          stockIssues: undefined,
          ecoPeaCoalWithdrawn: invoice?.stockIssues.reduce(
            (acc, { ecoPeaCoalIssued }) =>
              ecoPeaCoalIssued ? acc + ecoPeaCoalIssued.toNumber() : acc,
            0,
          ),
          nutCoalWithdrawn: invoice?.stockIssues.reduce(
            (acc, { nutCoalIssued }) =>
              nutCoalIssued ? acc + nutCoalIssued.toNumber() : acc,
            0,
          ),
        };
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Taka faktura nie istnieje",
        });
      }
    }),
  update: protectedProcedure
    .input(
      baseStockIssueSchema.extend({
        id: z.string(),
        invoiceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.stockIssue.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
          updatedBy: ctx.session.user.email,
        },
      });
    }),
  getDetails: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.stockIssue.findUniqueOrThrow({
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
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Takie wydanie nie istnieje",
        });
      }
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
