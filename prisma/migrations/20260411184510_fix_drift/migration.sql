/*
  Warnings:

  - You are about to drop the column `lessonId` on the `Booked` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booked" DROP CONSTRAINT "Booked_lessonId_fkey";

-- AlterTable
ALTER TABLE "Booked" DROP COLUMN "lessonId";

-- CreateTable
CREATE TABLE "BookedWeekly" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "teacherDayId" TEXT NOT NULL,
    "lessonId" TEXT,

    CONSTRAINT "BookedWeekly_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookedWeekly_studentId_teacherDayId_key" ON "BookedWeekly"("studentId", "teacherDayId");

-- AddForeignKey
ALTER TABLE "BookedWeekly" ADD CONSTRAINT "BookedWeekly_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookedWeekly" ADD CONSTRAINT "BookedWeekly_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
