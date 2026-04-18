-- DropForeignKey
ALTER TABLE "BookedLesson" DROP CONSTRAINT "BookedLesson_lessonId_fkey";

-- AddForeignKey
ALTER TABLE "BookedLesson" ADD CONSTRAINT "BookedLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
