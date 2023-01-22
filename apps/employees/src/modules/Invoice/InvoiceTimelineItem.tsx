import { Invoice } from "@ekosystem/db";
import { Text } from "@ekosystem/ui";
import { Timeline } from "flowbite-react";
import Link from "next/link";

export type InvoiceTimelineItemValue = Pick<
  Invoice,
  "issueDate" | "invoiceId" | "paidForCoal" | "id"
>;

export default function InvoiceTimelineItem({
  invoice: invoice,
}: {
  invoice: InvoiceTimelineItemValue;
}) {
  return (
    <Timeline.Item>
      <Timeline.Point />
      <Timeline.Content>
        <Timeline.Time>{invoice?.issueDate.toLocaleString()}</Timeline.Time>
        <Timeline.Title>Nowa faktura</Timeline.Title>
        <Timeline.Body>
          <div className="grid max-w-lg grid-flow-row grid-cols-2">
            <p className="text-gray-500">Numer</p>
            <Link href={`/invoices/${invoice.id}`}>
              <Text as="span" className="underline hover:cursor-pointer">
                {invoice.invoiceId}
              </Text>
            </Link>
            <p className="text-gray-500">Opłacono węgla</p>
            <Text>{invoice.paidForCoal.toString()} kg</Text>
          </div>
        </Timeline.Body>
      </Timeline.Content>
    </Timeline.Item>
  );
}
