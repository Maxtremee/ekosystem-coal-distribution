import { CoalIssue } from "@ekosystem/db";
import dayjs from "dayjs";
import { statsSchema } from "../../../schemas/statsSchema";
import { PERIOD_TYPE } from "../../../utils/periodTypes";
import { protectedProcedure, router } from "../trpc";
import * as R from "remeda";
import timezone from "dayjs/plugin/timezone";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";
import { z } from "zod";
dayjs.extend(timezone);
dayjs.extend(isoWeek);
dayjs.extend(utc);

const getPeriod = ({
  period,
  after,
  before,
  timezone,
}: {
  period: PERIOD_TYPE;
  after?: Date | undefined;
  before?: Date | undefined;
  timezone: string;
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
        after: dayjs().tz(timezone).startOf("isoWeek").toDate(),
        before: undefined,
      };
    case PERIOD_TYPE.LAST_WEEK:
      const lastWeek = dayjs().tz(timezone).subtract(1, "week");
      return {
        after: lastWeek.startOf("isoWeek").toDate(),
        before: lastWeek.endOf("isoWeek").toDate(),
      };
    case PERIOD_TYPE.THIS_MONTH:
      return {
        after: dayjs().tz(timezone).startOf("month").toDate(),
        before: undefined,
      };
    case PERIOD_TYPE.THIS_YEAR:
      return {
        after: dayjs().tz(timezone).startOf("year").toDate(),
        before: undefined,
      };
    case PERIOD_TYPE.LAST_MONTH:
      const lastMonth = dayjs().tz(timezone).subtract(1, "month");
      return {
        after: lastMonth.startOf("month").toDate(),
        before: lastMonth.endOf("month").toDate(),
      };
    case PERIOD_TYPE.LAST_YEAR:
      const lastYear = dayjs().tz(timezone).subtract(1, "year");
      return {
        after: lastYear.startOf("year").toDate(),
        before: lastYear.endOf("year").toDate(),
      };
    case PERIOD_TYPE.CUSTOM:
      return {
        after,
        before,
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

function intoNChunks<T>(arr: T[], groups: number) {
  const size = Math.ceil(arr.length / groups);
  return Array.from({ length: groups }, (v, i) =>
    arr.slice(i * size, i * size + size),
  );
}

function stockIssuesMean(
  issues: Array<{ items: CoalIssue[]; createdAt: Date }>,
) {
  const sortedDates = [...issues]
    .map(({ createdAt }) => createdAt)
    .sort((a, b) => a.getTime() - b.getTime());
  const meanDate =
    sortedDates.length > 1
      ? new Date(
          (sortedDates.at(0)!.getTime() + sortedDates.at(-1)!.getTime()) / 2,
        )
      : sortedDates.at(0);
  const meanAmount = R.pipe(
    issues,
    R.map((x) => x.items),
    R.flatten(),
    R.meanBy((x) => Number(x.amount.toString())),
  );
  return {
    meanDate,
    meanAmount: Math.round(meanAmount),
  };
}

const getDistributedCoalTimeline = (
  stockIssues: Array<{ items: CoalIssue[]; createdAt: Date }>,
) => {
  return R.pipe(
    intoNChunks(stockIssues, 20),
    R.map((x) => stockIssuesMean(x)),
  );
};

export const statsRouter = router({
  get: protectedProcedure.input(statsSchema).query(async ({ ctx, input }) => {
    const period = getPeriod({ ...input });

    const [invoices, stockIssues] = await ctx.prisma.$transaction([
      ctx.prisma.invoice.findMany({
        where: {
          issueDate: {
            lte: period.before,
            gte: period.after,
          },
        },
        select: {
          stockIssues: true,
          amount: true,
        },
      }),
      ctx.prisma.stockIssue.findMany({
        orderBy: {
          createdAt: "asc",
        },
        where: {
          createdAt: {
            lte: period.before,
            gte: period.after,
          },
        },
        select: {
          createdAt: true,
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
      distributedCoalTimelineData: getDistributedCoalTimeline(stockIssues),
    };
  }),
  getCoalTypeByDistributionCenter: protectedProcedure
    .input(
      statsSchema.extend({
        distributionCenterId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const period = getPeriod({ ...input });
      const stockIssues = await ctx.prisma.stockIssue.findMany({
        where: {
          distributionCenterId: input.distributionCenterId,
          createdAt: {
            lte: period.before,
            gte: period.after,
          },
        },
        select: {
          items: true,
        },
      });
      return {
        coalByType: getCoalByType(
          stockIssues.reduce<CoalIssue[]>(
            (acc, issue) => [...acc, ...issue.items],
            [],
          ),
        ),
      };
    }),
});
