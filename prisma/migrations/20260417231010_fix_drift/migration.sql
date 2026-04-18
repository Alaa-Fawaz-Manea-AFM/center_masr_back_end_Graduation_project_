/*
  Warnings:

  - A unique constraint covering the columns `[lessonId,id]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lessonId,id]` on the table `Homework` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lessonId,id]` on the table `Note` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Exam_lessonId_key";

-- DropIndex
DROP INDEX "Homework_lessonId_key";

-- DropIndex
DROP INDEX "Note_lessonId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Exam_lessonId_id_key" ON "Exam"("lessonId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Homework_lessonId_id_key" ON "Homework"("lessonId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Note_lessonId_id_key" ON "Note"("lessonId", "id");
