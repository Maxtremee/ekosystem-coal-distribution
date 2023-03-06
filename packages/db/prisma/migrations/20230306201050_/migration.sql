-- DropForeignKey
ALTER TABLE "CoalIssue" DROP CONSTRAINT "CoalIssue_stockIssueId_fkey";

-- DropForeignKey
ALTER TABLE "StockIssue" DROP CONSTRAINT "StockIssue_invoiceId_fkey";

-- AddForeignKey
ALTER TABLE "StockIssue" ADD CONSTRAINT "StockIssue_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoalIssue" ADD CONSTRAINT "CoalIssue_stockIssueId_fkey" FOREIGN KEY ("stockIssueId") REFERENCES "StockIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
