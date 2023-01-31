import { Prisma } from "@ekosystem/db";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import defaultFilteringSchema from "../../../schemas/defaultFilteringSchema";
import { TRPCError } from "@trpc/server";
import { baseStockIssueSchema } from "../../../schemas/stockIssueSchema";
import calculateTotalCoalInIssue from "../../../utils/calculateTotalCoalInIssue";

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
            stockIssues: {
              select: {
                items: true,
              },
            },
          },
        });
        return {
          ...invoice,
          stockIssues: undefined,
          coalLeftToIssue:
            invoice.amount.toNumber() -
            calculateTotalCoalInIssue(invoice?.stockIssues),
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
        const stockIssue = await ctx.prisma.stockIssue.findUniqueOrThrow({
          where: {
            id: input.id,
          },
          include: {
            items: true,
            DistributionCenter: {
              select: {
                name: true,
                id: true,
              },
            },
            Invoice: {
              select: {
                invoiceId: true,
              },
            },
          },
        });
        return {
          ...stockIssue,
          coalIssued: stockIssue.items.reduce(
            (acc, { amount }) => acc + amount.toNumber(),
            0,
          ),
        };
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
            items: true,
            Invoice: {
              select: {
                invoiceId: true,
                id: true,
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
          invoiceIdName: stockIssue.Invoice?.invoiceId,
          invoiceId: stockIssue.Invoice?.id,
          coalIssued: stockIssue.items.reduce(
            (acc, { amount }) => acc + amount.toNumber(),
            0,
          ),
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
          items: true,
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
        stockIssue.items.reduce(
          (acc, { amount }) => acc + amount.toNumber(),
          0,
        ),
        stockIssue.additionalInformation,
      ]);
      const header = [
        "identyfikator",
        "data",
        "nazwa składu",
        "numer faktury",
        "łącznie [kg]",
        "dodatkowe informacje",
      ];
      return { data, header };
    }),
});
