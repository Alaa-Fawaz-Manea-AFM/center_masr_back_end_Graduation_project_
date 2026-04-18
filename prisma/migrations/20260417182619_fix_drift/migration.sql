/*
  Warnings:

  - A unique constraint covering the columns `[studyMaterial,classRoom]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Course_studyMaterial_classRoom_key" ON "Course"("studyMaterial", "classRoom");
