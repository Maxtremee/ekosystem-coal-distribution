import { Text } from "@ekosystem/ui";
import distinctColors from "distinct-colors";
import { Alert, Card, Label, Select, Spinner } from "flowbite-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { statsSchema } from "../../schemas/statsSchema";
import { trpc } from "../../utils/trpc";
import { z } from "zod";

export default function CoalTypeByDistributionCenterChart({
  statsSchemaValues,
}: {
  statsSchemaValues: z.infer<typeof statsSchema>;
}) {
  const [distributionCenter, setDistributionCenter] = useState("");

  const {
    data: centers,
    isLoading: isLoadingCenters,
    isError: centersError,
  } = trpc.distributionCenters.getIdsAndNames.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data, isInitialLoading, isError } =
    trpc.stats.getCoalTypeByDistributionCenter.useQuery(
      {
        distributionCenterId: distributionCenter,
        ...statsSchemaValues,
      },
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: !!distributionCenter,
      },
    );

  useEffect(() => {
    if (centers && centers.length > 0) {
      setDistributionCenter(centers[0]!.id);
    }
  }, [centers]);

  const coalPieChartData =
    data?.coalByType &&
    Object.entries(data.coalByType).map(([type, total]) => ({
      name: type,
      value: total,
    }));
  const coalColors = distinctColors({
    count: coalPieChartData?.length,
  });

  return (
    <Card className="flex flex-col justify-start gap-4">
      <Text className="font-xl font-bold tracking-tight text-gray-900 dark:text-white">
        Rodzaje węgla według skupu
      </Text>

      {(centersError || isError) && (
        <Alert color="failure">{"Nie można załadować danych"}</Alert>
      )}

      {isLoadingCenters ? (
        <Spinner color="success" />
      ) : (
        <div>
          <Label htmlFor="search">Wydane przez</Label>
          <Select
            id="distributionCenterId"
            className="w-full md:w-80"
            placeholder="Wybierz skup węgla"
            value={distributionCenter}
            disabled={isLoadingCenters || centersError}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setDistributionCenter(event.currentTarget.value)
            }
          >
            {centers?.map(({ name, id }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Select>
        </div>
      )}

      {isInitialLoading ? (
        <Spinner color="success" />
      ) : (
        data?.coalByType && (
          <ResponsiveContainer height={350} width="100%">
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
        )
      )}
    </Card>
  );
}
