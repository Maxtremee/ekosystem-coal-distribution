import { z } from "zod";
import defaultFilteringSchema from "../../../schemas/defaultFilteringSchema";
import { baseAddInvoiceSchema } from "../../../schemas/invoiceSchema";
import { router, protectedProcedure } from "../trpc";
import { Prisma } from "@ekosystem/db";
import { TRPCError } from "@trpc/server";
import calculateTotalCoalInIssue from "../../../utils/calculateTotalCoalInIssue";

export const invoicesRouter = router({
  add: protectedProcedure
    .input(baseAddInvoiceSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.invoice.create({
          data: { ...input, createdBy: ctx.session.user.email },
        });
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2002"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Faktura o takim numerze już istnieje. Numer faktury musi być unikalny",
          });
        } else {
          throw err;
        }
      }
    }),
  update: protectedProcedure
    .input(
      baseAddInvoiceSchema.extend({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.invoice.update({
          where: {
            id: input.id,
          },
          data: { ...input, updatedBy: ctx.session.user.email },
        });
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2002"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Faktura o takim numerze już istnieje. Numer faktury musi być unikalny",
          });
        } else {
          throw err;
        }
      }
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
              items: true,
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
                items: true,
              },
            },
          },
        });
        return (
          invoice && {
            ...invoice,
            coalWithdrawn: calculateTotalCoalInIssue(invoice?.stockIssues),
          }
        );
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
            invoiceId: {
              contains: input?.search,
              mode: "insensitive",
            },
          },
          {
            applicationId: {
              contains: input?.search,
              mode: "insensitive",
            },
          },
        ],
        issueDate: {
          lte: input?.before,
          gte: input?.after,
        },
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
            stockIssues: {
              include: {
                items: true,
              },
            },
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
          coalWithdrawn: calculateTotalCoalInIssue(invoice?.stockIssues),
        })),
      };
    }),
  downloadFiltered: protectedProcedure
    .input(defaultFilteringSchema)
    .mutation(async ({ ctx, input }) => {
      const filters: Prisma.InvoiceWhereInput = {
        OR: [
          {
            invoiceId: {
              contains: input?.search,
              mode: "insensitive",
            },
          },
        ],
        issueDate: {
          lte: input?.before,
          gte: input?.after,
        },
      };
      const invoices = await ctx.prisma.invoice.findMany({
        where: filters,
        include: {
          stockIssues: {
            select: {
              items: true,
              id: true,
            },
          },
        },
        orderBy: {
          [input.sortBy]: input.sortDir,
        },
      });

      const mappedInvoices = invoices.map((invoice) => ({
        ...invoice,
        coalWithdrawn: calculateTotalCoalInIssue(invoice?.stockIssues),
      }));
      const data = mappedInvoices.map((invoice) => [
        invoice.id,
        invoice.invoiceId,
        invoice.issueDate.toLocaleString("pl").replace(", ", " "),
        invoice.applicationId,
        invoice?.amount?.toString(),
        invoice.stockIssues.length,
        invoice.coalWithdrawn,
        invoice.additionalInformation,
      ]);
      const header = [
        "identyfikator",
        "numer faktury",
        "data",
        "numer wniosku",
        "opłacono węgla [kg]",
        "liczba wydań",
        "odebrano łącznie [kg]",
        "dodatkowe informacje",
      ];
      return { data, header };
    }),
});
