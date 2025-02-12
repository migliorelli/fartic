-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_roomId_fkey";

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
