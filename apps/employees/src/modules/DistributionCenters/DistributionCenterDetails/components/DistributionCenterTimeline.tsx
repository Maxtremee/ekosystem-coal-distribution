import { Text } from "@ekosystem/ui";
import { Alert, Spinner, Card, Timeline, Button } from "flowbite-react";
import { trpc } from "../../../../utils/trpc";
import StockIssueTimelineItem from "../../../StockIssue/StockIssueTimelineItem";

export default function DistributionCenterTimeline({ id }: { id: string }) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.distributionCenters.getTimeline.useInfiniteQuery(
    {
      id,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  if (isError) {
    return <Alert color="failure">Błąd wczytywania osi czasu</Alert>;
  }

  if (isLoading) {
    return <Spinner size="xl" color="success" />;
  }

  return (
    <Card>
      <div className="flex gap-4">
        <Text as="h2" className="text-lg font-semibold">
          Oś czasu
        </Text>
        {isFetchingNextPage && <Spinner size="sm" color="success" />}
      </div>
      {data ? (
        <>
          <Timeline>
            {data?.pages.map(({ items }) =>
              items.map((stockIssue) => (
                <StockIssueTimelineItem
                  key={stockIssue.id}
                  stockIssue={stockIssue}
                />
              )),
            )}
          </Timeline>
          {hasNextPage && (
            <Button className="w-32" onClick={() => fetchNextPage()}>
              Pokaż więcej
            </Button>
          )}
        </>
      ) : (
        <Text>Brak zdarzeń</Text>
      )}
    </Card>
  );
}
