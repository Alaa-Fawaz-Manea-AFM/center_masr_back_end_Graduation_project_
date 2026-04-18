/*
  Warnings:

  - You are about to drop the column `homeworkCount` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "homeworkCount",
ADD COLUMN     "homeworkCounts" INTEGER NOT NULL DEFAULT 0;
