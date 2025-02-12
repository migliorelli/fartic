/*
  Warnings:

  - You are about to drop the `WordTheme` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `themeId` to the `Word` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WordTheme" DROP CONSTRAINT "WordTheme_themeId_fkey";

-- DropForeignKey
ALTER TABLE "WordTheme" DROP CONSTRAINT "WordTheme_wordId_fkey";

-- DropIndex
DROP INDEX "Word_content_key";

-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "themeId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "WordTheme";

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
