/*
  Warnings:

  - Made the column `roomId` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `socketId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roomId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "roomId" SET NOT NULL,
ALTER COLUMN "socketId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
