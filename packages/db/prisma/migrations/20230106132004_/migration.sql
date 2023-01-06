/*
  Warnings:

  - Added the required column `createdBy` to the `StockIssue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StockIssue" DROP CONSTRAINT "StockIssue_distributionCenterId_fkey";

-- AlterTable
ALTER TABLE "StockIssue" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "updatedBy" TEXT,
ALTER COLUMN "distributionCenterId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StockIssue" ADD CONSTRAINT "StockIssue_distributionCenterId_fkey" FOREIGN KEY ("distributionCenterId") REFERENCES "DistributionCenter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
