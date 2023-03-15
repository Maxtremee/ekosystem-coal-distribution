import { Text } from "@ekosystem/ui";
import { Alert, Label, Select, TextInput } from "flowbite-react";
import {
  createEnumParam,
  DateParam,
  useQueryParams,
  withDefault,
} from "use-query-params";
import { PeriodTypeLabelMap, PERIOD_TYPE } from "../../utils/periodTypes";
import { trpc } from "../../utils/trpc";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { StatCard } from "../../modules/Dashboard/StatCard";
import CoalTypeChart from "../../modules/Dashboard/CoalTypeChart";
import DistributionCentersChart from "../../modules/Dashboard/DistributionCentersChart";
import dayjs from "dayjs";
import spaceEvery3Chars from "../../utils/spaceEvery3Chars";
import DistributedCoalTimeline from "../../modules/Dashboard/DistributedCoalTimeline";

function DashboardPage() {
  const [query, setQuery] = useQueryParams({
    period: withDefault(
      createEnumParam(Object.values(PERIOD_TYPE)),
      PERIOD_TYPE.THIS_WEEK,
    ),
    after: withDefault(DateParam, new Date()),
    before: withDefault(DateParam, new Date()),
  });

  const { data, isLoading, isError } = trpc.stats.get.useQuery(
    {
      period: query.period,
      after: query.after || undefined,
      before: query.before || undefined,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  );

  if (isError) {
    return <Alert color="failure">Błąd wczytywania statystyk</Alert>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Text as="h2" className="text-xl font-semibold">
          Statystki
        </Text>
        <Select
          value={query.period}
          onChange={(e) =>
            setQuery({
              period: e.currentTarget.value as PERIOD_TYPE,
            })
          }
        >
          {Object.entries(PeriodTypeLabelMap).map(([period, label]) => (
            <option key={period} value={period}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      {query.period === PERIOD_TYPE.CUSTOM && (
        <div className="flex gap-4">
          <div>
            <Label htmlFor="after">Po</Label>
            <TextInput
              id="after"
              className="w-full md:w-32"
              type="date"
              value={dayjs(query.after).format("YYYY-MM-DD")}
              max={dayjs(query.before).format("YYYY-MM-DD")}
              onChange={(e) =>
                setQuery({
                  after: dayjs(e.currentTarget.value).toDate(),
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="before">Przed</Label>
            <TextInput
              id="before"
              className="w-full md:w-32"
              type="date"
              value={dayjs(query.before).format("YYYY-MM-DD")}
              min={dayjs(query.after).format("YYYY-MM-DD")}
              onChange={(e) =>
                setQuery({
                  before: dayjs(e.currentTarget.value).toDate(),
                })
              }
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Wystawiono faktur" isLoading={isLoading}>
          {data?.invoiceCount && spaceEvery3Chars(data.invoiceCount.toString())}
        </StatCard>
        <StatCard label="Wystawiono węgla" isLoading={isLoading}>
          {data?.totalCoalInInvoices &&
            spaceEvery3Chars(data.totalCoalInInvoices.toString())}{" "}
          kg
        </StatCard>
        <StatCard label="Liczba wydań węgla" isLoading={isLoading}>
          {data?.stockIssuesCount &&
            spaceEvery3Chars(data.stockIssuesCount.toString())}
        </StatCard>
        <StatCard label="Wydano węgla" isLoading={isLoading}>
          {data?.totalCoalInIssues &&
            spaceEvery3Chars(data.totalCoalInIssues.toString())}{" "}
          kg
        </StatCard>
      </div>
      <DistributedCoalTimeline
        isLoading={isLoading}
        distributedCoalTimelineData={data?.distributedCoalTimelineData}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CoalTypeChart isLoading={isLoading} coalByType={data?.coalByType} />
        <DistributionCentersChart
          isLoading={isLoading}
          issuesByDistributionCenter={data?.issuesByDistributionCenter}
        />
      </div>
    </div>
  );
}

export default withPageAuthRequired(DashboardPage);
