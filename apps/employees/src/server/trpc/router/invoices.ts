import { z } from "zod";
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
});
