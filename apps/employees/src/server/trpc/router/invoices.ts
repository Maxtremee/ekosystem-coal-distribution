import { z } from "zod";
import defaultFilteringSchema from "../../../schemas/defaultFilteringSchema";
import { baseAddInvoiceSchema } from "../../../schemas/invoiceSchema";
import { router, protectedProcedure } from "../trpc";
import { Prisma } from "@ekosystem/db";
import { TRPCError } from "@trpc/server";

export const invoicesRouter = router({
  add: protectedProcedure
    .input(
      baseAddInvoiceSchema.extend({
        applicationId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.invoice.create({
        data: { ...input, createdBy: ctx.session.user.email },
      });
    }),
  update: protectedProcedure
    .input(
      baseAddInvoiceSchema.extend({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.invoice.update({
        where: {
          id: input.id,
        },
        data: { ...input, updatedBy: ctx.session.user.email },
      });
    }),
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.invoice.findUniqueOrThrow({
          where: {
            id: input.id,
          },
        });
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Nie ma takiej faktury",
        });
      }
    }),
  checkIfUnique: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.invoice.findUnique({
        where: {
          name: input.name,
        },
      });
    }),
  checkIfApplicationExists: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const application = await ctx.prisma.application.findUnique({
        where: {
          id: input.id,
        },
        include: {
          invoices: true,
        },
      });
      return (
        application && {
          ...application,
          ecoPeaCoalInInvoices:
            application.invoices.reduce(
              (acc, { declaredEcoPeaCoal }) =>
                declaredEcoPeaCoal ? acc + declaredEcoPeaCoal.toNumber() : acc,
              0,
            ) || 0,
          nutCoalInInvoices: application.invoices.reduce(
            (acc, { declaredNutCoal }) =>
              declaredNutCoal ? acc + declaredNutCoal.toNumber() : acc,
            0,
          ),
        }
      );
    }),
  getTimeline: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.invoice.findUnique({
        where: {
          id: input.id,
        },
        select: {
          stockIssues: {
            orderBy: {
              createdAt: "desc",
            },
            select: {
              id: true,
              createdAt: true,
              distributionCenterId: true,
              ecoPeaCoalIssued: true,
              nutCoalIssued: true,
              DistributionCenter: {
                select: {
                  name: true,
                },
              },
            },
          },
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
        const invoice = await ctx.prisma.invoice.findUniqueOrThrow({
          where: {
            id: input.id,
          },
          include: {
            stockIssues: {
              select: {
                ecoPeaCoalIssued: true,
                nutCoalIssued: true,
              },
            },
            Application: {
              select: {
                id: true,
                applicationId: true,
                applicantName: true,
              },
            },
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
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Nie ma takiej faktury",
        });
      }
    }),
  getFiltered: protectedProcedure
    .input(defaultFilteringSchema)
    .query(async ({ input, ctx }) => {
      const filters: Prisma.InvoiceWhereInput = {
        OR: [
          {
            name: {
              contains: input?.search,
              mode: "insensitive",
            },
          },
          {
            Application: {
              applicantName: {
                contains: input?.search,
                mode: "insensitive",
              },
            },
          },
        ],
      };
      const data = await ctx.prisma.$transaction([
        ctx.prisma.invoice.count({
          where: filters,
        }),
        ctx.prisma.invoice.findMany({
          where: filters,
          skip: input?.skip,
          take: input?.take,
          include: {
            stockIssues: true,
            Application: true,
          },
          orderBy: {
            [input.sortBy]: input.sortDir,
          },
        }),
      ]);
      return {
        total: data[0],
        invoices: data[1].map((invoice) => ({
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
        })),
      };
    }),
  downloadFiltered: protectedProcedure
    .input(defaultFilteringSchema)
    .mutation(async ({ ctx, input }) => {
      const filters: Prisma.InvoiceWhereInput = {
        OR: [
          {
            name: {
              contains: input?.search,
              mode: "insensitive",
            },
          },
          {
            Application: {
              applicantName: {
                contains: input?.search,
                mode: "insensitive",
              },
            },
          },
        ],
      };
      const invoices = await ctx.prisma.invoice.findMany({
        where: filters,
        include: {
          stockIssues: {
            select: {
              ecoPeaCoalIssued: true,
              nutCoalIssued: true,
              id: true,
            },
          },
          Application: {
            select: {
              applicantName: true,
              applicationId: true,
            },
          },
        },
        orderBy: {
          [input.sortBy]: input.sortDir,
        },
      });

      const mappedInvoices = invoices.map((invoice) => ({
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
        stockIssuesIds: invoice?.stockIssues
          .reduce((acc, { id }) => `${acc}${id};`, "")
          ?.slice(0, -1),
      }));
      const data = mappedInvoices.map((invoice) => [
        invoice.id,
        invoice.name,
        invoice.issueDate.toLocaleString("pl").replace(", ", " "),
        invoice.Application?.applicantName,
        invoice.Application?.applicationId,
        invoice?.declaredNutCoal?.toString(),
        invoice?.declaredEcoPeaCoal?.toString(),
        invoice.stockIssues.length,
        invoice.stockIssuesIds,
        invoice.nutCoalWithdrawn,
        invoice.ecoPeaCoalWithdrawn,
      ]);
      const header = [
        "identyfikator",
        "numer faktury",
        "data",
        "imię i nazwisko wnioskodawcy",
        "numer wniosku",
        "opłacono: orzech [kg]",
        "opłacono: groszek [kg]",
        "liczba wydań",
        "identyfikatory wydań",
        "odebrano: orzech [kg]",
        "odebrano: groszek [kg]",
      ];
      return { data, header };
    }),
});
