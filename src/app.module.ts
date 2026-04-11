import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BookedModule } from './booked/booked.module';
import { CommentModule } from './comment/comment.module';
import { ExamModule } from './exam/exam.module';
import { FollowerModule } from './follower/follower.module';
import { HomeWorkModule } from './home-work/home-work.module';
import { LessonModule } from './lesson/lesson.module';
import { LikeModule } from './like/like.module';
import { NoteModule } from './note/note.module';
import { WeeklyScheduleModule } from './weekly-schedule/weekly-schedule.module';
import { UserModule } from './user/user.module';
import { PrismaServiceModule } from './prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/authGuard';
import { RolesGuard } from './guard/RolesGuard';
import { BookedLessonModule } from './bookedLesson/booked-lesson.module';

@Module({
  imports: [
    PrismaServiceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    PostModule,
    BookedModule,
    CommentModule,
    ExamModule,
    FollowerModule,
    HomeWorkModule,
    BookedLessonModule,
    LessonModule,
    LikeModule,
    NoteModule,
    WeeklyScheduleModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
