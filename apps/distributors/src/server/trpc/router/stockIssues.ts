import { Prisma } from "@ekosystem/db";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import defaultFilteringSchema from "../../../schemas/defaultFilteringSchema";
import { backendAddStockIssueSchema } from "../../../schemas/addStockIssueSchema";
import { TRPCError } from "@trpc/server";
import Decimal from "decimal.js";

export const stockIssuesRouter = router({
  checkInvoice: protectedProcedure
    .input(
      z.object({
        invoiceName: z.string(),
        appNameOrId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const invoice = await ctx.prisma.invoice.findFirstOrThrow({
          where: {
            AND: [
              {
                invoiceId: {
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
        return (
          invoice && {
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
          }
        );
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Taka faktura nie istnieje",
        });
      }
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
          stockIssues: true,
        },
      });
      if (!invoice) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Nie ma takiej faktury",
        });
      }

      if (!input?.ecoPeaCoalIssued && !input?.nutCoalIssued) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Przynajmniej jedna wartość musi być wypełniona: groszek, orzech",
        });
      }

      // check if issued values aren't bigger than left to issue
      const coalLeft = invoice.paidForCoal.minus(
        invoice?.stockIssues.reduce(
          (acc, { ecoPeaCoalIssued, nutCoalIssued }) => {
            const ecoPea = ecoPeaCoalIssued ? ecoPeaCoalIssued.toNumber() : 0;
            const nut = nutCoalIssued ? nutCoalIssued.toNumber() : 0;
            return acc + ecoPea + nut;
          },
          0,
        ),
      );
      const issuedSum = new Decimal(input?.ecoPeaCoalIssued || 0)
        .plus(new Decimal(input?.nutCoalIssued || 0))
        .toNumber();

      if (coalLeft.minus(issuedSum).lessThan(0)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Wartość wydania towaru przekracza wartość pozostałą do odebrania",
        });
      }

      return await ctx.prisma.stockIssue.create({
        data: {
          ...input,
          createdBy: ctx.session.user.email,
          distributionCenterId: distributionCenter.id,
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
        })),
      };
    }),
});
