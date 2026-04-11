/*
  Warnings:

  - You are about to drop the column `teacherDayId` on the `BookedWeekly` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,lessonId]` on the table `BookedWeekly` will be added. If there are existing duplicate values, this will fail.
  - Made the column `lessonId` on table `BookedWeekly` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BookedWeekly" DROP CONSTRAINT "BookedWeekly_lessonId_fkey";

-- DropIndex
DROP INDEX "BookedWeekly_studentId_teacherDayId_key";

-- AlterTable
ALTER TABLE "BookedWeekly" DROP COLUMN "teacherDayId",
ALTER COLUMN "lessonId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BookedWeekly_studentId_lessonId_key" ON "BookedWeekly"("studentId", "lessonId");

-- AddForeignKey
ALTER TABLE "BookedWeekly" ADD CONSTRAINT "BookedWeekly_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
