/*
  Warnings:

  - Added the required column `courseId` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `Homework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "courseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Homework" ADD COLUMN     "courseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "courseId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
