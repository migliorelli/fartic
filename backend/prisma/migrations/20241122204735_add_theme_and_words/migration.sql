/*
  Warnings:

  - Added the required column `themeId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "themeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Theme" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordTheme" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,
    "themeId" INTEGER NOT NULL,

    CONSTRAINT "WordTheme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Theme_name_key" ON "Theme"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Word_content_key" ON "Word"("content");

-- CreateIndex
CREATE UNIQUE INDEX "WordTheme_wordId_themeId_key" ON "WordTheme"("wordId", "themeId");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordTheme" ADD CONSTRAINT "WordTheme_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordTheme" ADD CONSTRAINT "WordTheme_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
