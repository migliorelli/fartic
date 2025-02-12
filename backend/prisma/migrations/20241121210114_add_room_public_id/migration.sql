/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "publicId" VARCHAR(11) NOT NULL DEFAULT nanoid(11);

-- CreateIndex
CREATE UNIQUE INDEX "Room_publicId_key" ON "Room"("publicId");
