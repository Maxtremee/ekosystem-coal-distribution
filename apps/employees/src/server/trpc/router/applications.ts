import { Prisma } from "@ekosystem/db";
import { z } from "zod";
import { baseAddApplicationSchema } from "../../../schemas/applicationSchema";
import { router, protectedProcedure } from "../trpc";
import defaultFilteringSchema from "../../../schemas/defaultFilteringSchema";

export const applicationsRouter = router({
  add: protectedProcedure
    .input(baseAddApplicationSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.application.create({
        data: {
          ...input,
          createdBy: ctx.session.user.email,
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
      const application = await ctx.prisma.application.findUnique({
        where: {
          id: input.id,
        },
        include: {
          invoices: {
            include: {
              stockIssues: true,
            },
          },
        },
      });
      return {
        ...application,
        ecoPeaCoalInInvoices: application?.invoices.reduce(
          (acc, { declaredEcoPeaCoal }) =>
            declaredEcoPeaCoal ? acc + declaredEcoPeaCoal.toNumber() : acc,
          0,
        ),
        nutCoalInInvoices: application?.invoices.reduce(
          (acc, { declaredNutCoal }) =>
            declaredNutCoal ? acc + declaredNutCoal.toNumber() : acc,
          0,
        ),
        stockIssuesTotal: application?.invoices?.reduce(
          (invoiceAcc, { stockIssues }) => invoiceAcc + stockIssues?.length,
          0,
        ),
        ecoPeaCoalWithdrawn: application?.invoices?.reduce(
          (invoiceAcc, { stockIssues }) =>
            invoiceAcc +
            stockIssues?.reduce(
              (acc, { ecoPeaCoalIssued }) =>
                ecoPeaCoalIssued ? acc + ecoPeaCoalIssued.toNumber() : acc,
              0,
            ),

          0,
        ),
        nutCoalWithdrawn: application?.invoices?.reduce(
          (invoiceAcc, { stockIssues }) =>
            invoiceAcc +
            stockIssues?.reduce(
              (acc, { nutCoalIssued }) =>
                nutCoalIssued ? acc + nutCoalIssued.toNumber() : acc,
              0,
            ),
          0,
        ),
      };
    }),
  getFiltered: protectedProcedure
    .input(defaultFilteringSchema)
    .query(async ({ input, ctx }) => {
      const filters: Prisma.ApplicationWhereInput = {
        OR: [
          {
            applicantName: {
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
          {
            invoices: {
              some: {
                name: {
                  contains: input?.search,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      };
      const data = await ctx.prisma.$transaction([
        ctx.prisma.application.count({
          where: filters,
        }),
        ctx.prisma.application.findMany({
          skip: input?.skip,
          take: input?.take,
          include: {
            invoices: true,
          },
          orderBy: {
            [input.sortBy]: input.sortDir,
          },
          where: filters,
        }),
      ]);
      return {
        total: data[0],
        applications: data[1].map((application) => ({
          ...application,
          ecoPealCoalInInvoices: application.invoices.reduce(
            (acc, { declaredEcoPeaCoal }) =>
              declaredEcoPeaCoal ? acc + declaredEcoPeaCoal.toNumber() : acc,
            0,
          ),
          nutCoalInInvoices: application.invoices.reduce(
            (acc, { declaredNutCoal }) =>
              declaredNutCoal ? acc + declaredNutCoal.toNumber() : acc,
            0,
          ),
        })),
      };
    }),
});
