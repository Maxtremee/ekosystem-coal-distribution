/*
  Warnings:

  - You are about to drop the column `applicantName` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `declaredEcoPeaCoal` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `declaredNutCoal` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Invoice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invoiceId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Made the column `applicationId` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `invoiceId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paidForCoal` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Invoice_name_key";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "applicantName",
ALTER COLUMN "applicationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "declaredEcoPeaCoal",
DROP COLUMN "declaredNutCoal",
DROP COLUMN "name",
ADD COLUMN     "additionalInformation" TEXT,
ADD COLUMN     "invoiceId" TEXT NOT NULL,
ADD COLUMN     "paidForCoal" DECIMAL(65,30) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceId_key" ON "Invoice"("invoiceId");
