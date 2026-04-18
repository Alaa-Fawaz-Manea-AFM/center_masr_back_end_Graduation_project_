/*
  Warnings:

  - A unique constraint covering the columns `[id,lessonId]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,lessonId]` on the table `Homework` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,lessonId]` on the table `Note` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Exam_lessonId_id_key";

-- DropIndex
DROP INDEX "Homework_lessonId_id_key";

-- DropIndex
DROP INDEX "Note_lessonId_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Exam_id_lessonId_key" ON "Exam"("id", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "Homework_id_lessonId_key" ON "Homework"("id", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "Note_id_lessonId_key" ON "Note"("id", "lessonId");
