import { Prisma } from "@acme/db";
import { z } from "zod";
import { backendAddApplicationSchema } from "../../../schemas/applicationSchema";
import { router, protectedProcedure } from "../trpc";
import defaultFilteringSchema from "../../../schemas/defaultFilteringSchema";

export const applicationsRouter = router({
  add: protectedProcedure
    .input(backendAddApplicationSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.application.create({
        data: input,
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
          invoices: true,
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
