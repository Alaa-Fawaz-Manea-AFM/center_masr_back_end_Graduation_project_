import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  async getLesson(lessonId: string, currentUserId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        title: true,
        videoUrl: true,
        teacherId: true,
      },
    });

    if (!lesson) throw new NotFoundException('Lesson not found');

    let isBooked = false;
    const booking = await this.prisma.bookedLesson.findFirst({
      where: {
        lessonId,
        studentId: currentUserId,
      },
      select: { id: true },
    });

    isBooked = !!booking;

    return sendResponsive(
      {
        ...lesson,
        isBooked,
        videoUrl:
          lesson.teacherId === currentUserId || isBooked
            ? lesson.videoUrl
            : null,
      },
      'Get Lesson successfully',
    );
  }

  async getAllLessons(page = 1, currentUserId: string, courseId: string) {
    const limit = 6;
    const skip = (page - 1) * limit;

    const lessons = await this.prisma.lesson.findMany({
      where: { courseId },
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            bookingLesson: {
              where: {
                studentId: currentUserId,
              },
            },
          },
        },
      },
    });

    const lessonCounts = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, lessonCounts: true },
    });

    const data = lessons.map((lesson) => {
      const isBooked = (lesson as any)._count?.bookingLesson > 0;

      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        videoUrl:
          lesson.teacherId === currentUserId || isBooked
            ? lesson.videoUrl
            : null,
        createdAt: lesson.createdAt,
        isBooked,
      };
    });

    return sendResponsive(
      { lessonCounts: lessonCounts?.lessonCounts, data },
      'Get All Lesson successfully',
    );
  }

  async createLesson(
    teacherId: string,
    courseId: string,
    createLessonDto: CreateLessonDto,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          teacherId,
        },
        select: { id: true },
      });

      if (!course)
        throw new NotFoundException('Course not found or not authorized');

      const lesson = await prisma.lesson.create({
        data: {
          ...createLessonDto,
          courseId,
          teacherId,
        },
      });

      if (!lesson)
        throw new NotFoundException('Course not found or not authorized');

      await prisma.course.updateMany({
        where: {
          id: courseId,
          teacherId,
        },
        data: {
          lessonCounts: {
            increment: 1,
          },
        },
      });

      return sendResponsive(lesson, 'Lesson created successfully');
    });
  }

  async updateLesson(
    teacherId: string,
    lessonId: string,
    updateLessonDto: UpdateLessonDto,
  ) {
    const result = await this.prisma.lesson.updateMany({
      where: {
        id: lessonId,
        teacherId,
      },
      data: updateLessonDto,
    });

    if (result.count === 0) {
      throw new NotFoundException('Lesson not found or, not authorized');
    }

    return sendResponsive(null, 'Lesson updated successfully');
  }

  async deleteLesson(teacherId: string, lessonId: string, courseId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const lesson = await prisma.lesson.deleteMany({
        where: {
          id: lessonId,
          teacherId,
          courseId,
        },
      });

      if (lesson.count === 0) {
        throw new NotFoundException('Lesson not found or not authorized');
      }

      await prisma.course.updateMany({
        where: {
          id: courseId,
          teacherId,
          lessonCounts: {
            gt: 0,
          },
        },
        data: {
          lessonCounts: {
            decrement: 1,
          },
        },
      });

      return sendResponsive(null, 'Lesson deleted successfully');
    });
  }
}
