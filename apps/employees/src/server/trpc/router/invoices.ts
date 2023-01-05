import { Prisma } from "@acme/db";
import { z } from "zod";
import filterApplicationsListSchema from "../../../schemas/filterApplicationsListSchema";
import { backendAddInvoiceSchema } from "../../../schemas/invoiceSchema";
import { router, protectedProcedure } from "../trpc";

export const invoicesRouter = router({
  add: protectedProcedure
    .input(backendAddInvoiceSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.invoice.create({
        data: input,
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
  getFilteredWithApplicationId: protectedProcedure
    .input(
      filterApplicationsListSchema.extend({
        applicationId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const filters: Prisma.InvoiceWhereInput = {
        applicationId: input.applicationId,
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
            [input.sortBy || "createdAt"]: input.sortDir,
          },
        }),
      ]);
      return {
        total: data[0],
        invoices: data[1],
      };
    }),
});
