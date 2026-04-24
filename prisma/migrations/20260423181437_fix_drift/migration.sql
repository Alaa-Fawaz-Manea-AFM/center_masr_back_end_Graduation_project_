/*
  Warnings:

  - A unique constraint covering the columns `[id,centerId]` on the table `WeeklySchedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WeeklySchedule_id_centerId_key" ON "WeeklySchedule"("id", "centerId");
