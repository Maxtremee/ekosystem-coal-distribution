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
        invoiceId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const invoice = await ctx.prisma.invoice.findFirstOrThrow({
          where: {
            AND: [
              {
                invoiceId: {
                  equals: input.invoiceId,
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
          coalLeftToIssue:
            invoice.paidForCoal.toNumber() -
            invoice?.stockIssues.reduce(
              (acc, { ecoPeaCoalIssued, nutCoalIssued }) => {
                const ecoPea = ecoPeaCoalIssued
                  ? ecoPeaCoalIssued.toNumber()
                  : 0;
                const nut = nutCoalIssued ? nutCoalIssued.toNumber() : 0;
                return acc + ecoPea + nut;
              },
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
                invoiceId: true,
                id: true,
                Application: {
                  select: {
                    id: true,
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
              invoiceId: {
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
                invoiceId: true,
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
          invoiceId: stockIssue.Invoice?.invoiceId,
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
                invoiceId: {
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
              invoiceId: true,
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
        stockIssue.Invoice?.invoiceId,
        stockIssue.nutCoalIssued?.toString(),
        stockIssue.nutCoalIssued?.toString(),
        stockIssue.additionalInformation,
      ]);
      const header = [
        "identyfikator",
        "data",
        "nazwa składu",
        "numer faktury",
        "orzech [kg]",
        "groszek [kg]",
        "dodatkowe informacje",
      ];
      return { data, header };
    }),
});
