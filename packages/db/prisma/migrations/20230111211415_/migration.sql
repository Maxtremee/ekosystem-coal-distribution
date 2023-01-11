/*
  Warnings:

  - Made the column `applicantName` on table `Application` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "applicantName" SET NOT NULL;

-- AlterTable
ALTER TABLE "DistributionCenter" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
