import { Application } from "@acme/db";
import { z } from "zod";
import { backendAddApplicationSchema } from "../../../schemas/applicationSchema";
import filterApplicationsListSchema from "../../../schemas/filterApplicationsListSchema";
import { router, protectedProcedure } from "../trpc";

export const applicationsRouter = router({
  add: protectedProcedure
    .input(backendAddApplicationSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.application.create({
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
      return await ctx.prisma.application.findUnique({
        where: {
          name: input.name,
        },
      });
    }),
  getFiltered: protectedProcedure
    .input(filterApplicationsListSchema)
    .query(async ({ input, ctx }) => {
      const filters = {
        OR: [
          {
            name: {
              contains: input?.search,
            },
          },
          {
            invoices: {
              some: {
                name: {
                  contains: input?.search,
                },
              },
            },
          },
          {
            createdBy: {
              contains: input?.search,
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
            [input.sortBy || "createdAt"]: input.sortDir,
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
