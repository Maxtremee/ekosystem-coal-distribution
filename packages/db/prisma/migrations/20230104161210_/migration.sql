/*
  Warnings:

  - You are about to drop the column `name` on the `Application` table. All the data in the column will be lost.
  - Added the required column `applicantName` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Application_name_key";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "name",
ADD COLUMN     "additionalInformation" TEXT,
ADD COLUMN     "applicantName" TEXT NOT NULL;
