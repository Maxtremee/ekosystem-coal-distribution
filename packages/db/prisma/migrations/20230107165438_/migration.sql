/*
  Warnings:

  - A unique constraint covering the columns `[applicationId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "applicationId" TEXT,
ALTER COLUMN "applicantName" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Application_applicationId_key" ON "Application"("applicationId");
