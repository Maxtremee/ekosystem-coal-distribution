import { Text } from "@ekosystem/ui";
import distinctColors from "distinct-colors";
import { Card, Spinner } from "flowbite-react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { RouterOutputs } from "../../utils/trpc";

export default function CoalTypeChart({
  isLoading,
  coalByType,
}: {
  isLoading: boolean;
  coalByType: RouterOutputs["stats"]["get"]["coalByType"] | undefined;
}) {
  const coalPieChartData =
    coalByType &&
    Object.entries(coalByType).map(([type, total]) => ({
      name: type,
      value: total,
    }));
  const coalColors = distinctColors({
    count: coalPieChartData?.length,
  });

  return (
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
                <Cell key={`cell-${index}`} fill={coalColors![index]!.hex()} />
              ))}
            </Pie>
            <Legend verticalAlign="top" height={36} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
