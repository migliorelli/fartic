/*
  Warnings:

  - You are about to drop the column `userLimit` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "userLimit",
ADD COLUMN     "playerLimit" INTEGER NOT NULL DEFAULT 5;
