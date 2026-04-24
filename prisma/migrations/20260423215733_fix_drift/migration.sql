/*
  Warnings:

  - You are about to drop the column `studyMaterial` on the `ProfileCenter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProfileCenter" DROP COLUMN "studyMaterial",
ADD COLUMN     "studyMaterials" TEXT[];
