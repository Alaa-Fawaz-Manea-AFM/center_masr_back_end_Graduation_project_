/*
  Warnings:

  - A unique constraint covering the columns `[teacherId,lessonId,courseId]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teacherId,lessonId,courseId]` on the table `Homework` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Exam_teacherId_lessonId_courseId_key" ON "Exam"("teacherId", "lessonId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Homework_teacherId_lessonId_courseId_key" ON "Homework"("teacherId", "lessonId", "courseId");
