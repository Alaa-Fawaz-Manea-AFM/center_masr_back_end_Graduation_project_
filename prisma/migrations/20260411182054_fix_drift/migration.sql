-- AlterTable
ALTER TABLE "Booked" ADD COLUMN     "lessonId" TEXT;

-- AddForeignKey
ALTER TABLE "Booked" ADD CONSTRAINT "Booked_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
