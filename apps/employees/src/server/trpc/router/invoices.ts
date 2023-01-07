import { z } from "zod";
import defaultFilteringSchema from "../../../schemas/defaultFilteringSchema";
import { backendAddInvoiceSchema } from "../../../schemas/invoiceSchema";
import { router, protectedProcedure } from "../trpc";
import { Prisma } from "@ekosystem/db";

export const invoicesRouter = router({
  add: protectedProcedure
    .input(backendAddInvoiceSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.invoice.create({
        data: { ...input, createdBy: ctx.session.user.email },
      });
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
      const invoice = await ctx.prisma.invoice.findUnique({
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
    }),
  getFiltered: protectedProcedure
    .input(
      defaultFilteringSchema.extend({
        applicationId: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const filters: Prisma.InvoiceWhereInput = {
        applicationId: input?.applicationId,
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
});
