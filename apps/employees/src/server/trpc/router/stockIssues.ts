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
            OR: [
              {
                invoiceId: {
                  equals: input.invoiceId,
                  mode: "insensitive",
                },
              },
              {
                id: {
                  equals: input.invoiceId,
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
  add: protectedProcedure
    .input(
      baseStockIssueSchema.extend({
        invoiceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // check if passed any items
      if (input.items.length < 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Przynajmniej jeden rodzaj węgla musi zostać wybrany",
        });
      }

      return await ctx.prisma.stockIssue.create({
        data: {
          invoiceId: input.invoiceId,
          createdBy: ctx.session.user.email,
          distributionCenterId:
            input.distributionCenterId === ""
              ? undefined
              : input.distributionCenterId,
          items: {
            create: input.items,
          },
        },
        select: {
          id: true,
        },
      });
    }),
  update: protectedProcedure
    .input(
      baseStockIssueSchema.extend({ id: z.string(), invoiceId: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.stockIssue.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
          distributionCenterId:
            input.distributionCenterId === ""
              ? undefined
              : input.distributionCenterId,
          updatedBy: ctx.session.user.email,
          items: {
            deleteMany: {},
            create: input.items,
          },
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.stockIssue.delete({
        where: {
          id: input.id,
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
        createdAt: {
          lte: input?.before,
          gte: input?.after,
        },
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
          createdAt: {
            lte: input?.before,
            gte: input?.after,
          },
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
              email: true,
            },
          },
        },
      });

      const stockIssueHeader = [
        "identyfikator",
        "data",
        "nazwa składu",
        "numer faktury",
        "łącznie [kg]",
        "dodatkowe informacje",
      ];
      const stockIssuesFormatted = stockIssues?.map((stockIssue) => [
        stockIssue.id,
        stockIssue.createdAt.toLocaleString("pl").replace(", ", " "),
        stockIssue.DistributionCenter?.email,
        stockIssue.Invoice?.invoiceId,
        stockIssue.items.reduce(
          (acc, { amount }) => acc + amount.toNumber(),
          0,
        ),
        stockIssue.additionalInformation,
      ]);

      const itemsHeader = [
        "identyfikator wydania",
        "numer faktury",
        "rodzaj",
        "ilosc",
      ];
      const itemsFormatted = stockIssues
        ?.map((stockIssue) =>
          stockIssue.items.map((item) => [
            stockIssue.id,
            stockIssue.invoiceId,
            item.type,
            item.amount.toString(),
          ]),
        )
        .flat();

      return [
        {
          data: stockIssuesFormatted,
          header: stockIssueHeader,
          title: "wydania_towaru",
        },
        { data: itemsFormatted, header: itemsHeader, title: "towary" },
      ];
    }),
});
