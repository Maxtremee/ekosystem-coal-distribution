import { Text } from "@ekosystem/ui";
import distinctColors from "distinct-colors";
import { Card, Spinner } from "flowbite-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { RouterOutputs } from "../../utils/trpc";

export default function DistributionCentersChart({
  isLoading,
  issuesByDistributionCenter,
}: {
  isLoading: boolean;
  issuesByDistributionCenter:
    | RouterOutputs["stats"]["get"]["issuesByDistributionCenter"]
    | undefined;
}) {
  const distributionCenterPieChartData =
    issuesByDistributionCenter &&
    Object.entries(issuesByDistributionCenter).map(([type, total]) => ({
      name: type,
      value: total,
    }));
  const centersColors = distinctColors({
    count: distributionCenterPieChartData?.length,
  });
  return (
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
  );
}
