/*
  Warnings:

  - You are about to drop the column `paidForCoal` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `ecoPeaCoalIssued` on the `StockIssue` table. All the data in the column will be lost.
  - You are about to drop the column `nutCoalIssued` on the `StockIssue` table. All the data in the column will be lost.
  - You are about to drop the `Application` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_applicationId_fkey";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "paidForCoal",
ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "StockIssue" DROP COLUMN "ecoPeaCoalIssued",
DROP COLUMN "nutCoalIssued";

-- DropTable
DROP TABLE "Application";

-- CreateTable
CREATE TABLE "CoalIssue" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "stockIssueId" TEXT,

    CONSTRAINT "CoalIssue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CoalIssue" ADD CONSTRAINT "CoalIssue_stockIssueId_fkey" FOREIGN KEY ("stockIssueId") REFERENCES "StockIssue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
