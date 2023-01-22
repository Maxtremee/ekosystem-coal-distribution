import { Prisma } from "@ekosystem/db";
import { TRPCError } from "@trpc/server";
import { z, ZodError } from "zod";
import { ErrorMessageOptions, generateErrorMessage } from "zod-error";
import NotEnoughArgumentsError from "../../../modules/Import/NotEnoughArgumentsError";
import parseApplication from "../../../modules/Import/parseApplication";
import parseInvoice from "../../../modules/Import/parseInvoice";
import parseStockIssue from "../../../modules/Import/parseStockIssue";
import { ParsingError } from "../../../modules/Import/ParsingError";
import base64ToStringsArrays from "../../../utils/base64ToStringsArrays";
import { protectedProcedure, router } from "../trpc";

const zodErrorOptions: ErrorMessageOptions = {
  prefix: " 🔥 ",
  code: {
    enabled: true,
    label: "Kod: ",
  },
  path: {
    enabled: true,
    label: "Pole: ",
    type: "breadcrumbs",
  },
  message: {
    enabled: true,
    label: "Wiadomość: ",
  },
};

export const importRouter = router({
  file: protectedProcedure
    .input(
      z.object({
        data: z.string(),
        type: z.enum(["applications", "invoices", "stockIssues"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const values = await base64ToStringsArrays(input.data);
      let curr = 0;
      try {
        if (input.type === "applications") {
          const applications = values.map((application, index) => {
            curr = index;
            return parseApplication(application);
          });
          await ctx.prisma.$transaction(
            applications.map((application) =>
              ctx.prisma.application.create({
                data: {
                  applicationId: application.numerWniosku,
                  issueDate: application.dataWydania,
                  additionalInformation: application.dodatkoweInformacje,
                  declaredEcoPeaCoal: application.zadeklarowanaIloscGroszek,
                  declaredNutCoal: application.zadeklarowanaIloscOrzech,
                  createdBy: ctx.session.user.email,
                },
              }),
            ),
          );
          return {
            imported: applications.length,
          };
        }
        if (input.type === "invoices") {
          const invoices = values.map((invoice, index) => {
            curr = index;
            return parseInvoice(invoice);
          });
          await ctx.prisma.$transaction(
            invoices.map((invoice) =>
              ctx.prisma.invoice.create({
                data: {
                  createdBy: ctx.session.user.email,
                  invoiceId: invoice.numerFaktury,
                  issueDate: invoice.dataWydania,
                  paidForCoal: invoice.kwota,
                  ...(invoice?.numerWniosku !== undefined && {
                    Application: {
                      connect: {
                        applicationId: invoice.numerWniosku,
                      },
                    },
                  }),
                },
              }),
            ),
          );
          return {
            imported: invoices.length,
          };
        }
        if (input.type === "stockIssues") {
          const stockIssues = values.map((invoice, index) => {
            curr = index;
            return parseStockIssue(invoice);
          });
          await ctx.prisma.$transaction(
            stockIssues.map((stockIssue) =>
              ctx.prisma.stockIssue.create({
                data: {
                  createdBy: ctx.session.user.email,
                  createdAt: stockIssue.dataWydania,
                  additionalInformation: stockIssue.dodatkoweInformacje,
                  ecoPeaCoalIssued: stockIssue.wydanoGroszek,
                  nutCoalIssued: stockIssue.wydanoOrzech,
                  Invoice: {
                    connect: {
                      invoiceId: stockIssue.numerFaktury,
                    },
                  },
                  ...(stockIssue?.emailSkupu !== undefined && {
                    DistributionCenter: {
                      connect: {
                        email: stockIssue.emailSkupu,
                      },
                    },
                  }),
                },
              }),
            ),
          );
          return {
            imported: stockIssues.length,
          };
        }
      } catch (err) {
        let parsingError: ParsingError | undefined = undefined;
        if (err instanceof ZodError) {
          parsingError = {
            lineNumber: curr + 1,
            message: generateErrorMessage(err.issues, zodErrorOptions),
          };
        } else if (err instanceof NotEnoughArgumentsError) {
          parsingError = {
            lineNumber: curr + 1,
            message: err.message,
          };
        } else if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2002"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Numery ${
              input.type === "applications" ? "wniosków" : "faktur"
            } muszą być unikalne`,
          });
        }
        if (parsingError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: JSON.stringify(parsingError),
          });
        } else {
          throw err;
        }
      }
    }),
});
