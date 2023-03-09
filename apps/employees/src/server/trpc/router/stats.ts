import { CoalIssue } from "@ekosystem/db";
import dayjs from "dayjs";
import { statsSchema } from "../../../schemas/statsSchema";
import { PERIOD_TYPE } from "../../../utils/periodTypes";
import { protectedProcedure, router } from "../trpc";
import * as R from "remeda";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

const getPeriod = ({
  period,
  after,
  before,
}: {
  period: PERIOD_TYPE;
  after?: Date | undefined;
  before?: Date | undefined;
}): {
  after: Date | undefined;
  before: Date | undefined;
} => {
  switch (period) {
    case PERIOD_TYPE.ALL:
      return {
        after: undefined,
        before: undefined,
      };
    case PERIOD_TYPE.THIS_WEEK:
      return {
        after: dayjs().startOf("week").toDate(),
        before: undefined,
      };
    case PERIOD_TYPE.LAST_WEEK:
      const lastWeek = dayjs().subtract(1, "week");
      return {
        after: lastWeek.startOf("isoWeek").toDate(),
        before: lastWeek.endOf("isoWeek").toDate(),
      };
    case PERIOD_TYPE.THIS_MONTH:
      return {
        after: dayjs().startOf("month").toDate(),
        before: undefined,
      };
    case PERIOD_TYPE.THIS_YEAR:
      return {
        after: dayjs().startOf("year").toDate(),
        before: undefined,
      };
    case PERIOD_TYPE.LAST_MONTH:
      const lastMonth = dayjs().subtract(1, "month");
      return {
        after: lastMonth.startOf("month").toDate(),
        before: lastMonth.endOf("month").toDate(),
      };
    case PERIOD_TYPE.LAST_YEAR:
      const lastYear = dayjs().subtract(1, "year");
      return {
        after: lastYear.startOf("year").toDate(),
        before: lastYear.endOf("year").toDate(),
      };
    case PERIOD_TYPE.CUSTOM:
      return {
        after: dayjs(after).startOf("day").toDate(),
        before: dayjs(before).endOf("day").toDate(),
      };
  }
};

const getCoalByType = (issues: CoalIssue[]) => {
  return R.pipe(
    issues,
    R.groupBy((x) => x.type),
    R.mapValues((x) => R.sumBy(x, (x) => Number(x.amount.toString()))),
  );
};

const getIssuesByDistributionCenter = (
  stockIssues: {
    DistributionCenter: null | {
      name: string;
    };
  }[],
) => {
  return R.pipe(
    stockIssues,
    R.filter((x) => R.isDefined(x.DistributionCenter)),
    R.groupBy((x) => x.DistributionCenter!.name),
    R.mapValues((x) => x.length),
  );
};

export const statsRouter = router({
  get: protectedProcedure.input(statsSchema).query(async ({ ctx, input }) => {
    const period = getPeriod({ ...input });

    const [invoices, stockIssues] = await ctx.prisma.$transaction([
      ctx.prisma.invoice.findMany({
        where: {
          issueDate: {
            gte: period.after,
            lte: period.before,
          },
        },
        select: {
          stockIssues: true,
          amount: true,
        },
      }),
      ctx.prisma.stockIssue.findMany({
        where: {
          createdAt: {
            gte: period.after,
            lte: period.before,
          },
        },
        select: {
          DistributionCenter: {
            select: {
              name: true,
            },
          },
          items: true,
        },
      }),
    ]);

    return {
      invoiceCount: invoices.length,
      stockIssuesCount: stockIssues.length,
      totalCoalInInvoices: invoices.reduce<number>(
        (acc, invoice) => acc + Number(invoice.amount.toString()),
        0,
      ),
      totalCoalInIssues: stockIssues.reduce<number>(
        (acc, issue) =>
          acc +
          issue.items.reduce<number>(
            (acc, item) => acc + Number(item.amount.toString()),
            0,
          ),
        0,
      ),
      coalByType: getCoalByType(
        stockIssues.reduce<CoalIssue[]>(
          (acc, issue) => [...acc, ...issue.items],
          [],
        ),
      ),
      issuesByDistributionCenter: getIssuesByDistributionCenter(stockIssues),
    };
  }),
});
