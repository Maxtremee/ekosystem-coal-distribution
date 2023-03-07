import { Text } from "@ekosystem/ui";
import { Alert, Card, Select, Spinner } from "flowbite-react";
import { ReactNode } from "react";
import {
  createEnumParam,
  DateParam,
  useQueryParams,
  withDefault,
} from "use-query-params";
import { PeriodTypeLabelMap, PERIOD_TYPE } from "../../utils/periodTypes";
import { trpc } from "../../utils/trpc";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import distinctColors from "distinct-colors";

const StatCard = ({
  children,
  label,
  isLoading,
}: {
  children: ReactNode;
  label: string;
  isLoading: boolean;
}) => (
  <Card className="flex flex-col gap-4">
    <Text className="font-xl font-bold tracking-tight text-gray-900 dark:text-white">
      {label}
    </Text>
    {isLoading ? (
      <Spinner color="success" />
    ) : (
      <Text className="text-gray-700 dark:text-gray-400">{children}</Text>
    )}
  </Card>
);

export default function DashboardPage() {
  const [query, setQuery] = useQueryParams({
    period: withDefault(
      createEnumParam(Object.values(PERIOD_TYPE)),
      PERIOD_TYPE.THIS_MONTH,
    ),
    after: DateParam,
    before: DateParam,
  });

  const { data, isLoading, isError } = trpc.stats.get.useQuery(
    {
      period: query.period,
      after: query.after || undefined,
      before: query.before || undefined,
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity
    },
  );

  if (isError) {
    return <Alert color="failure">Błąd wczytywania statystyk</Alert>;
  }

  const coalPieChartData =
    data?.coalByType &&
    Object.entries(data.coalByType).map(([type, total]) => ({
      name: type,
      value: total,
    }));
  const coalColors = distinctColors({
    count: coalPieChartData?.length,
  });

  const distributionCenterPieChartData =
    data?.issuesByDistributionCenter &&
    Object.entries(data.issuesByDistributionCenter).map(([type, total]) => ({
      name: type,
      value: total,
    }));
  const centersColors = distinctColors({
    count: distributionCenterPieChartData?.length,
  });

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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Wystawiono faktur" isLoading={isLoading}>
          {data?.invoiceCount}
        </StatCard>
        <StatCard label="Wystawiono węgla" isLoading={isLoading}>
          {data?.totalCoalInInvoices} kg
        </StatCard>
        <StatCard label="Wydano węgla" isLoading={isLoading}>
          {data?.totalCoalInIssues} kg
        </StatCard>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <Text className="font-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Rodzaje węgla
          </Text>
          {isLoading ? (
            <Spinner color="success" />
          ) : (
            <ResponsiveContainer height={500} width="100%">
              <PieChart>
                <Pie
                  dataKey="value"
                  nameKey="name"
                  data={coalPieChartData}
                  label
                  labelLine
                  outerRadius={80}
                >
                  {coalPieChartData!.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={coalColors![index]!.hex()}
                    />
                  ))}
                </Pie>
                <Legend verticalAlign="top" height={36} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card className="flex flex-col gap-4">
          <Text className="font-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Składy
          </Text>
          {isLoading ? (
            <Spinner color="success" />
          ) : (
            <ResponsiveContainer height={500} width="100%">
              <PieChart>
                <Pie
                  dataKey="value"
                  nameKey="name"
                  data={distributionCenterPieChartData}
                  label
                  labelLine
                  outerRadius={80}
                >
                  {distributionCenterPieChartData!.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={centersColors![index]!.hex()}
                    />
                  ))}
                </Pie>
                <Legend verticalAlign="top" height={36} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}
