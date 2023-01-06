import { Prisma } from "@ekosystem/db";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import defaultFilteringSchema from "../../../schemas/defaultFilteringSchema";
import { backendAddStockIssueSchema } from "../../../schemas/addStockIssueSchema";
import { TRPCError } from "@trpc/server";

export const stockIssuesRouter = router({
  checkForInvoice: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const invoice = await ctx.prisma.invoice.findFirst({
        where: {
          name: input.name,
        },
        include: {
          stockIssues: true,
        },
      });
      return {
        ...invoice,
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
    }),
  add: protectedProcedure
    .input(backendAddStockIssueSchema)
    .mutation(async ({ ctx, input }) => {
      const distributionCenterId =
        await ctx.prisma.distributionCenter.findUnique({
          where: {
            email: ctx.session.user.email,
          },
          select: {
            id: true,
          },
        });
      if (!distributionCenterId?.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Skup nie istnieje",
        });
      }
      return await ctx.prisma.stockIssue.create({
        data: {
          ...input,
          createdBy: ctx.session.user.email,
          distributionCenterId: distributionCenterId.id,
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
          invoiceName: stockIssue.Invoice?.name,
        })),
      };
    }),
});
