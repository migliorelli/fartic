/*
  Warnings:

  - You are about to drop the `Match` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_wordId_fkey";

-- DropTable
DROP TABLE "Match";

-- CreateTable
CREATE TABLE "Round" (
    "id" SERIAL NOT NULL,
    "time" INTEGER NOT NULL DEFAULT 120,
    "hint" JSONB NOT NULL,
    "wordId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Round_roomId_key" ON "Round"("roomId");

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
