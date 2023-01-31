import { StockIssue } from "@ekosystem/db";
import { Text } from "@ekosystem/ui";
import { Timeline } from "flowbite-react";
import Link from "next/link";
import { RouterOutputs } from "../../utils/trpc";

export type StockIssueTimelineItemValue = Pick<
  StockIssue,
  "id" | "createdAt" | "distributionCenterId"
> & {
  DistributionCenter: {
    name: string;
  } | null;
};

export default function StockIssueTimelineItem({
  stockIssue,
}: {
  stockIssue: RouterOutputs["distributionCenters"]["getTimeline"]["items"][number];
}) {
  return (
    <Timeline.Item>
      <Timeline.Point />
      <Timeline.Content>
        <Timeline.Time>{stockIssue?.createdAt.toLocaleString()}</Timeline.Time>
        <Link href={`/stock-issues/${stockIssue.id}`}>
          <Timeline.Title className="cursor-pointer underline">
            Wydanie towaru
          </Timeline.Title>
        </Link>
        <Timeline.Body>
          <div className="grid max-w-lg grid-flow-row grid-cols-2">
            <p className="text-gray-500">Miejsce wydania</p>
            <Link
              href={`/distribution-centers/${stockIssue?.distributionCenterId}`}
              passHref
            >
              <Text as="span" className="underline hover:cursor-pointer">
                {stockIssue?.DistributionCenter?.name}
              </Text>
            </Link>
            {stockIssue.items?.map(({ type, amount }) => (
              <>
                <p className="text-gray-500">{type}</p>
                <Text>{amount?.toString() || 0} kg</Text>
              </>
            ))}
          </div>
        </Timeline.Body>
      </Timeline.Content>
    </Timeline.Item>
  );
}
