/*
  Warnings:

  - You are about to drop the column `ecoPeaCoalLeft` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `nutCoalLeft` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `ecoPeaCoalLeft` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `nutCoalLeft` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "ecoPeaCoalLeft",
DROP COLUMN "nutCoalLeft";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "ecoPeaCoalLeft",
DROP COLUMN "nutCoalLeft";
