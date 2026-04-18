/*
  Warnings:

  - A unique constraint covering the columns `[studyMaterial,classRoom,teacherId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Course_studyMaterial_classRoom_key";

-- CreateIndex
CREATE UNIQUE INDEX "Course_studyMaterial_classRoom_teacherId_key" ON "Course"("studyMaterial", "classRoom", "teacherId");
