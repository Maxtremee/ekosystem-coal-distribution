import { CoalIssue } from "@ekosystem/db";

export default function calculateTotalCoalInIssue(
  stockIssues: {
    items: CoalIssue[];
  }[],
) {
  return stockIssues
    .map(({ items }) => items)
    .flat()
    .reduce<number>((acc, item) => acc + item.amount.toNumber(), 0);
}
