/*
  Warnings:

  - You are about to drop the column `scheduleId` on the `TeacherDay` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teacherId,weekly_scheduleId,day,time]` on the table `TeacherDay` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `weekly_scheduleId` to the `TeacherDay` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TeacherDay" DROP CONSTRAINT "TeacherDay_scheduleId_fkey";

-- DropIndex
DROP INDEX "TeacherDay_teacherId_scheduleId_day_time_key";

-- AlterTable
ALTER TABLE "TeacherDay" DROP COLUMN "scheduleId",
ADD COLUMN     "weekly_scheduleId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TeacherDay_teacherId_weekly_scheduleId_day_time_key" ON "TeacherDay"("teacherId", "weekly_scheduleId", "day", "time");

-- AddForeignKey
ALTER TABLE "TeacherDay" ADD CONSTRAINT "TeacherDay_weekly_scheduleId_fkey" FOREIGN KEY ("weekly_scheduleId") REFERENCES "WeeklySchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
