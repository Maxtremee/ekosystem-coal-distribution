import { Text } from "@ekosystem/ui";
import { Alert, Card, Spinner, Timeline } from "flowbite-react";
import { trpc } from "../../../../utils/trpc";
import StockIssueTimelineItem from "../../../StockIssue/StockIssueTimelineItem";

export default function InvoiceTimeline({ id }: { id: string }) {
  const { data, isLoading, isError } = trpc.invoices.getTimeline.useQuery({
    id,
  });

  if (isError) {
    return <Alert color="failure">Błąd wczytywania osi czasu</Alert>;
  }

  if (isLoading) {
    return <Spinner size="xl" color="success" />;
  }

  return (
    <Card>
      <Text as="h2" className="text-lg font-semibold">
        Oś czasu
      </Text>
      {data?.stockIssues?.length ? (
        <Timeline>
          {data.stockIssues.map((stockIssue) => (
            <StockIssueTimelineItem
              key={stockIssue.id}
              stockIssue={stockIssue}
            />
          ))}
        </Timeline>
      ) : (
        <Text>Brak zdarzeń</Text>
      )}
    </Card>
  );
}
