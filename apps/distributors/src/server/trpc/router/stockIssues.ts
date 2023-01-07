import { Prisma } from "@ekosystem/db";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import defaultFilteringSchema from "../../../schemas/defaultFilteringSchema";
import { backendAddStockIssueSchema } from "../../../schemas/addStockIssueSchema";
import { TRPCError } from "@trpc/server";

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
                name: {
                  equals: input.invoiceName,
                  mode: "insensitive",
                },
              },
              {
                Application: {
                  OR: [
                    {
                      applicantName: {
                        equals: input.appNameOrId,
                        mode: "insensitive",
                      },
                    },
                    {
                      applicationId: {
                        equals: input.appNameOrId,
                        mode: "insensitive",
                      },
                    },
                  ],
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

      // check if value issued isn't bigger than allowed
      if (input?.ecoPeaCoalIssued) {
        const ecoPeaCoalWithdrawn = invoice?.stockIssues?.reduce(
          (acc, { ecoPeaCoalIssued }) =>
            ecoPeaCoalIssued ? acc + ecoPeaCoalIssued.toNumber() : acc,
          0,
        );
        const ecoPeaCoalLeft =
          invoice?.declaredEcoPeaCoal?.minus(ecoPeaCoalWithdrawn).toNumber() ||
          0;
        if (input.ecoPeaCoalIssued > ecoPeaCoalLeft) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Wartość wydania towaru: groszek przekracza wartość pozostałą do odebrania",
          });
        }
      }
      if (input?.nutCoalIssued) {
        const nutCoalWithdrawn = invoice?.stockIssues?.reduce(
          (acc, { nutCoalIssued }) =>
            nutCoalIssued ? acc + nutCoalIssued.toNumber() : acc,
          0,
        );
        const nutCoalLeft =
          invoice?.declaredNutCoal?.minus(nutCoalWithdrawn).toNumber() || 0;
        if (input.nutCoalIssued > nutCoalLeft) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Wartość wydania towaru: orzech przekracza wartość pozostałą do odebrania",
          });
        }
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
          invoiceName: stockIssue.Invoice?.name,
        })),
      };
    }),
});
