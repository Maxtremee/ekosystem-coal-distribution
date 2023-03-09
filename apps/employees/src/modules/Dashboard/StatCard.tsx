import { Text } from "@ekosystem/ui";
import { Card, Spinner } from "flowbite-react";
import { ReactNode } from "react";

export const StatCard = ({
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
