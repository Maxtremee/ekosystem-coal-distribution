import { Prisma, PrismaPromise } from "@ekosystem/db";
import { z } from "zod";
import { baseAddApplicationSchema } from "../../../schemas/applicationSchema";
import { router, protectedProcedure } from "../trpc";
import defaultFilteringSchema from "../../../schemas/defaultFilteringSchema";
import { TRPCError } from "@trpc/server";

export const applicationsRouter = router({
  add: protectedProcedure
    .input(baseAddApplicationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.application.create({
          data: {
            ...input,
            createdBy: ctx.session.user.email,
          },
        });
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2002"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Wniosek o takim numerze już istnieje. Numer wniosku musi być unikalny",
          });
        } else {
          throw err;
        }
      }
    }),
  update: protectedProcedure
    .input(
      baseAddApplicationSchema.extend({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.application.update({
          where: {
            id: input.id,
          },
          data: {
            ...input,
            updatedBy: ctx.session.user.email,
          },
        });
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2002"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Wniosek o takim numerze już istnieje. Numer wniosku musi być unikalny",
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
        return await ctx.prisma.application.findUniqueOrThrow({
          where: {
            id: input.id,
          },
        });
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Nie ma takiego wniosku",
        });
      }
    }),
  getDetails: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const application = await ctx.prisma.application.findUniqueOrThrow({
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
          coalInInvoices: application.invoices.reduce(
            (acc, { paidForCoal }) =>
              paidForCoal ? acc + paidForCoal.toNumber() : acc,
            0,
          ),
          stockIssuesTotal: application?.invoices?.reduce(
            (ac, { stockIssues }) => ac + stockIssues?.length,
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
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Nie ma takiego wniosku",
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
      return await ctx.prisma.application.findUnique({
        where: {
          id: input.id,
        },
        select: {
          invoices: {
            select: {
              id: true,
              invoiceId: true,
              issueDate: true,
              paidForCoal: true,
              stockIssues: {
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
          },
        },
      });
    }),
  getFiltered: protectedProcedure
    .input(defaultFilteringSchema)
    .query(async ({ input, ctx }) => {
      const filters: Prisma.ApplicationWhereInput = {
        OR: [
          {
            applicationId: {
              contains: input?.search,
              mode: "insensitive",
            },
          },
          {
            invoices: {
              some: {
                invoiceId: {
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
          coalInInvoices: application.invoices.reduce(
            (acc, { paidForCoal }) =>
              paidForCoal ? acc + paidForCoal.toNumber() : acc,
            0,
          ),
        })),
      };
    }),
  downloadFiltered: protectedProcedure
    .input(defaultFilteringSchema)
    .mutation(async ({ input, ctx }) => {
      const filters: Prisma.ApplicationWhereInput = {
        OR: [
          {
            applicationId: {
              contains: input?.search,
              mode: "insensitive",
            },
          },
          {
            invoices: {
              some: {
                invoiceId: {
                  contains: input?.search,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      };
      const applications = await ctx.prisma.application.findMany({
        include: {
          invoices: {
            select: {
              invoiceId: true,
              paidForCoal: true,
            },
          },
        },
        orderBy: {
          [input.sortBy]: input.sortDir,
        },
        where: filters,
      });
      const mappedApplications = applications.map((application) => ({
        ...application,
        coalInInvoices: application.invoices.reduce(
          (acc, { paidForCoal }) =>
            paidForCoal ? acc + paidForCoal.toNumber() : acc,
          0,
        ),
        invoiceIds: application.invoices
          .reduce((acc, { invoiceId }) => `${acc}${invoiceId};`, "")
          ?.slice(0, -1),
      }));
      const data = mappedApplications.map((application) => [
        application.id,
        application?.applicationId,
        application?.additionalInformation,
        application.issueDate.toLocaleString("pl").replace(", ", " "),
        application?.declaredNutCoal?.toString(),
        application?.declaredEcoPeaCoal?.toString(),
        application.invoices.length,
        application.invoiceIds,
        application?.coalInInvoices,
      ]);
      const header = [
        "identyfikator",
        "numer wniosku",
        "dodatkowe informacje",
        "data",
        "zadeklarowano: orzech [kg]",
        "zadeklarowano: groszek [kg]",
        "liczba faktur",
        "numery faktur",
        "opłacono [kg]",
      ];
      return { data, header };
    }),
});
