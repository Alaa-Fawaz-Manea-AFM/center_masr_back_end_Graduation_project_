-- DropIndex
DROP INDEX "Review_userReviewId_ownerReviewId_key";

-- CreateIndex
CREATE INDEX "BookedLesson_lessonId_studentId_idx" ON "BookedLesson"("lessonId", "studentId");

-- CreateIndex
CREATE INDEX "Exam_lessonId_idx" ON "Exam"("lessonId");

-- CreateIndex
CREATE INDEX "Exam_courseId_idx" ON "Exam"("courseId");

-- CreateIndex
CREATE INDEX "Follower_followingId_idx" ON "Follower"("followingId");

-- CreateIndex
CREATE INDEX "Follower_followerId_idx" ON "Follower"("followerId");

-- CreateIndex
CREATE INDEX "Homework_lessonId_idx" ON "Homework"("lessonId");

-- CreateIndex
CREATE INDEX "Homework_courseId_idx" ON "Homework"("courseId");

-- CreateIndex
CREATE INDEX "Lesson_teacherId_courseId_idx" ON "Lesson"("teacherId", "courseId");

-- CreateIndex
CREATE INDEX "Note_lessonId_idx" ON "Note"("lessonId");

-- CreateIndex
CREATE INDEX "Note_courseId_idx" ON "Note"("courseId");

-- CreateIndex
CREATE INDEX "Post_userId_role_idx" ON "Post"("userId", "role");

-- CreateIndex
CREATE INDEX "Review_ownerReviewId_idx" ON "Review"("ownerReviewId");

-- CreateIndex
CREATE INDEX "Review_userReviewId_idx" ON "Review"("userReviewId");
