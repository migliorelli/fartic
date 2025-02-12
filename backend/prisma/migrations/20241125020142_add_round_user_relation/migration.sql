/*
  Warnings:

  - A unique constraint covering the columns `[playerId]` on the table `Round` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `playerId` to the `Round` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Round" ADD COLUMN     "playerId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Round_playerId_key" ON "Round"("playerId");

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
