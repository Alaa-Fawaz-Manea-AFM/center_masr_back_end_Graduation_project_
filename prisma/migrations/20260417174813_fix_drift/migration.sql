/*
  Warnings:

  - You are about to drop the column `file` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `file` on the `Homework` table. All the data in the column will be lost.
  - You are about to drop the column `file` on the `Note` table. All the data in the column will be lost.
  - Added the required column `fileUrl` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `Homework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "file",
ADD COLUMN     "fileUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Homework" DROP COLUMN "file",
ADD COLUMN     "fileUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "file",
ADD COLUMN     "fileUrl" TEXT NOT NULL;
