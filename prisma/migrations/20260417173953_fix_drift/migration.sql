/*
  Warnings:

  - You are about to drop the column `classRoom` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `studyMaterial` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `classRoom` on the `Homework` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `Homework` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Homework` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Homework` table. All the data in the column will be lost.
  - You are about to drop the column `studyMaterial` on the `Homework` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Homework` table. All the data in the column will be lost.
  - You are about to drop the column `classRoom` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `studyMaterial` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Note` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lessonId]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lessonId]` on the table `Homework` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lessonId]` on the table `Note` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonId` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file` to the `Homework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonId` to the `Homework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Homework" DROP CONSTRAINT "Homework_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_courseId_fkey";

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "classRoom",
DROP COLUMN "courseId",
DROP COLUMN "description",
DROP COLUMN "imageUrl",
DROP COLUMN "studyMaterial",
DROP COLUMN "title",
ADD COLUMN     "file" TEXT NOT NULL,
ADD COLUMN     "lessonId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Homework" DROP COLUMN "classRoom",
DROP COLUMN "courseId",
DROP COLUMN "description",
DROP COLUMN "imageUrl",
DROP COLUMN "studyMaterial",
DROP COLUMN "title",
ADD COLUMN     "file" TEXT NOT NULL,
ADD COLUMN     "lessonId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "classRoom",
DROP COLUMN "courseId",
DROP COLUMN "description",
DROP COLUMN "imageUrl",
DROP COLUMN "studyMaterial",
DROP COLUMN "title",
ADD COLUMN     "file" TEXT NOT NULL,
ADD COLUMN     "lessonId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Exam_lessonId_key" ON "Exam"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "Homework_lessonId_key" ON "Homework"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "Note_lessonId_key" ON "Note"("lessonId");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
