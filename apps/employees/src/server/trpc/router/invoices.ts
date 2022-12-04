import { z } from "zod";
import addInvoiceSchema from "../../../schemas/addInvoiceSchema";
import filterInvoicesListSchema from "../../../schemas/filterInvoicesListSchema";
import { router, protectedProcedure } from "../trpc";

export const invoicesRouter = router({
  add: protectedProcedure
    .input(addInvoiceSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.prisma.invoice.create({
        data: {
          ...input,
          nutCoalLeft: input?.declaredNutCoal,
          ecoPeaCoalLeft: input?.declaredEcoPeaCoal,
        },
      });
      return data;
    }),
  checkApplicationIdUnique: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const data = await ctx.prisma.invoice.findUnique({
        where: {
          applicationId: input.applicationId,
        },
      });
      return data;
    }),
  getFiltered: protectedProcedure
    .input(filterInvoicesListSchema)
    .query(async ({ input, ctx }) => {
      const data = await ctx.prisma.invoice.findMany({
        orderBy: {
          [input.sortBy || "createdAt"]: input.sortDir,
        },
        where: {
          OR: [
            {
              applicationId: {
                contains: input?.search,
              },
            },
            {
              name: {
                contains: input?.search,
              },
            },
            {
              createdBy: {
                contains: input?.search,
              },
            },
          ],
        },
      });
      return data;
    }),
});
