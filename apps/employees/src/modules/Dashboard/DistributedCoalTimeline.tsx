import { Text } from "@ekosystem/ui";
import dayjs from "dayjs";
import { Card, Spinner } from "flowbite-react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import { RouterOutputs } from "../../utils/trpc";

export default function DistributedCoalTimeline({
  isLoading,
  distributedCoalTimelineData,
}: {
  isLoading: boolean;
  distributedCoalTimelineData:
    | RouterOutputs["stats"]["get"]["distributedCoalTimelineData"]
    | undefined;
}) {
  return (
    <Card className="flex flex-col gap-4">
      <Text className="font-xl font-bold tracking-tight text-gray-900 dark:text-white">
        Wydany węgiel w czasie
      </Text>
      {isLoading ? (
        <Spinner color="success" />
      ) : (
        distributedCoalTimelineData && (
          <ResponsiveContainer height={500} width="100%">
            <LineChart
              width={500}
              height={300}
              data={distributedCoalTimelineData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={({ meanDate }) =>
                  dayjs(meanDate).toDate().toLocaleDateString()
                }
              />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} kg`, "Węgiel"]} />
              <Line
                type="monotone"
                dataKey="meanAmount"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      )}
    </Card>
  );
}
