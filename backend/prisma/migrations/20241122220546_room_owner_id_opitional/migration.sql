-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_themeId_fkey";

-- DropForeignKey
ALTER TABLE "WordTheme" DROP CONSTRAINT "WordTheme_themeId_fkey";

-- DropForeignKey
ALTER TABLE "WordTheme" DROP CONSTRAINT "WordTheme_wordId_fkey";

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordTheme" ADD CONSTRAINT "WordTheme_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordTheme" ADD CONSTRAINT "WordTheme_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;
