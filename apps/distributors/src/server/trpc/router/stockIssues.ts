import { CoalIssue, Invoice, Prisma } from "@ekosystem/db";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import defaultFilteringSchema from "../../../schemas/defaultFilteringSchema";
import { backendAddStockIssueSchema } from "../../../schemas/addStockIssueSchema";
import { TRPCError } from "@trpc/server";
import calculateTotalCoalInIssue from "../../../utils/calculateTotalCoalInIssue";

export const stockIssuesRouter = router({
  checkInvoice: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let invoice: Invoice & {
        stockIssues: {
          DistributionCenter: {
            email: string;
          } | null;
          items: CoalIssue[];
        }[];
      };
      try {
        invoice = await ctx.prisma.invoice.findFirstOrThrow({
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
                DistributionCenter: {
                  select: {
                    email: true,
                  },
                },
              },
            },
          },
        });
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Taka faktura nie istnieje",
        });
      }

      // check if some other distribution center didn't already claim this invoice
      if (
        invoice?.stockIssues.length > 0 &&
        !invoice?.stockIssues?.some(
          ({ DistributionCenter }) =>
            DistributionCenter?.email === ctx.session.user?.email,
        )
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Ta faktura została przyjęta przez inny skład",
        });
      }

      return (
        invoice && {
          ...invoice,
          stockIssues: undefined,
          coalLeftToIssue: invoice.amount
            .minus(calculateTotalCoalInIssue(invoice?.stockIssues))
            .toNumber(),
        }
      );
    }),
  add: protectedProcedure
    .input(backendAddStockIssueSchema)
    .mutation(async ({ ctx, input }) => {
      // check for distribution center
      const distributionCenter =
        await ctx.prisma.distributionCenter.findUniqueOrThrow({
          where: {
            email: ctx.session.user.email,
          },
          select: {
            id: true,
          },
        });

      if (!distributionCenter) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Skup nie istnieje",
        });
      }

      //check if invoice actually exists
      const invoice = await ctx.prisma.invoice.findFirst({
        where: {
          id: input.invoiceId,
        },
        include: {
          stockIssues: {
            select: {
              items: true,
            },
          },
        },
      });

      if (!invoice) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Nie ma takiej faktury",
        });
      }

      // check if passed any items
      if (input.items.length < 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Przynajmniej jeden rodzaj węgla musi zostać wybrany",
        });
      }

      // check if issued values aren't bigger than left to issue
      const coalLeft = invoice.amount.minus(
        calculateTotalCoalInIssue(invoice.stockIssues),
      );
      const issuedSum = input.items.reduce<number>(
        (acc, { amount }) => acc + amount,
        0,
      );
      if (coalLeft.minus(issuedSum).lessThan(0)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Wartość wydania towaru przekracza wartość pozostałą do odebrania",
        });
      }

      return await ctx.prisma.stockIssue.create({
        data: {
          invoiceId: input.invoiceId,
          createdBy: ctx.session.user.email,
          distributionCenterId: distributionCenter.id,
          items: {
            create: input.items,
          },
        },
        select: {
          id: true,
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
        invoiceId: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const filters: Prisma.StockIssueWhereInput = {
        DistributionCenter: {
          email: ctx.session.user.email,
        },
        invoiceId: input?.invoiceId,
        OR: [
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
          invoiceId: stockIssue.Invoice?.invoiceId,
          coalIssued: stockIssue.items.reduce(
            (acc, { amount }) => acc + amount.toNumber(),
            0,
          ),
        })),
      };
    }),
});
