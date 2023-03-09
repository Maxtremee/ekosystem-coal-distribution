import { Text } from "@ekosystem/ui";
import distinctColors from "distinct-colors";
import { Card, Spinner } from "flowbite-react";
import {
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
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
  const chartData =
    issuesByDistributionCenter &&
    Object.entries(issuesByDistributionCenter)
      .map(([type, total]) => ({
        name: type,
        value: total,
      }))
      .sort((a, b) => b.value - a.value);
  const centersColors = distinctColors({
    count: chartData?.length,
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
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [value, "Wydania"]} />
            <Bar dataKey="value" fill="#8884d8">
              {chartData!.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={centersColors![index]!.hex()}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
