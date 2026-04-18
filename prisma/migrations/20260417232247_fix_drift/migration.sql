/*
  Warnings:

  - A unique constraint covering the columns `[lessonId]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lessonId]` on the table `Homework` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lessonId]` on the table `Note` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Exam_id_lessonId_key";

-- DropIndex
DROP INDEX "Homework_id_lessonId_key";

-- DropIndex
DROP INDEX "Note_id_lessonId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Exam_lessonId_key" ON "Exam"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "Homework_lessonId_key" ON "Homework"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "Note_lessonId_key" ON "Note"("lessonId");
