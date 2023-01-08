import { Text } from "@ekosystem/ui";
import dayjs from "dayjs";
import { Alert, Card, Spinner, Timeline } from "flowbite-react";
import { useMemo } from "react";
import { trpc } from "../../../../utils/trpc";
import InvoiceTimelineItem, {
  InvoiceTimelineItemValue,
} from "../../../Invoice/InvoiceTimelineItem";
import StockIssueTimelineItem, {
  StockIssueTimelineItemValue,
} from "../../../StockIssue/StockIssueTimelineItem";

export default function ApplicationTimeline({ id }: { id: string }) {
  const { data, isLoading, isError } = trpc.applications.getTimeline.useQuery({
    id,
  });

  const sorted = useMemo(() => {
    const timelineItems: Array<{
      type: "invoice" | "stockIssue";
      id: string;
      date: Date;
      value: InvoiceTimelineItemValue | StockIssueTimelineItemValue;
    }> = [];
    data?.invoices.forEach((invoice) => {
      timelineItems.push({
        type: "invoice",
        id: invoice.id,
        date: invoice.issueDate,
        value: invoice,
      });
      invoice.stockIssues.forEach((stockIssue) => {
        timelineItems.push({
          type: "stockIssue",
          id: stockIssue.id,
          date: stockIssue.createdAt,
          value: stockIssue,
        });
      });
    });
    return timelineItems.sort((a: { date: Date }, b: { date: Date }) =>
      dayjs(a.date).isBefore(b.date) ? 1 : -1,
    );
  }, [data]);

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
      {data?.invoices?.length ? (
        <Timeline>
          {sorted?.map(({ type, value, id }) =>
            type === "invoice" ? (
              <InvoiceTimelineItem
                key={id}
                invoice={value as InvoiceTimelineItemValue}
              />
            ) : (
              <StockIssueTimelineItem
                key={id}
                stockIssue={value as StockIssueTimelineItemValue}
              />
            ),
          )}
        </Timeline>
      ) : (
        <Text>Brak zdarzeń</Text>
      )}
    </Card>
  );
}
