-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "time" INTEGER NOT NULL DEFAULT 120,
    "hint" JSONB NOT NULL,
    "wordId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Match_roomId_key" ON "Match"("roomId");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
