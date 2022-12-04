import addInvoiceSchema from "../../../schemas/addInvoiceSchema";

import { router, protectedProcedure } from "../trpc";

export const invoicesRouter = router({
  addInvoice: protectedProcedure
    .input(addInvoiceSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.prisma.invoice.create({
        data: { ...input },
      });
      return data;
    }),
});
