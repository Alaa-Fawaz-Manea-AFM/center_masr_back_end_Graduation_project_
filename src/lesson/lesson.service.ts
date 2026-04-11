import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from 'src/prisma.service';
import { GetAllLessonDto } from './dto/getAllLessonDto';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  async getLesson(lessonId: string, currentUserId?: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },

      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },

        _count: currentUserId
          ? {
              select: {
                bookingWeekly: {
                  where: {
                    studentId: currentUserId,
                  },
                },
              },
            }
          : false,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const hasAccess =
      currentUserId && (lesson as any)._count?.bookingWeekly > 0;

    return {
      ...lesson,
      isBooked: !!hasAccess,
      videoUrl: hasAccess ? lesson.videoUrl : null,
      _count: undefined,
    };
  }

  async getAllLessons(
    currentUserId: string,
    page = 1,
    filters: GetAllLessonDto,
  ) {
    const limit = 6;
    const skip = (page - 1) * limit;

    const lessons = await this.prisma.lesson.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },

      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },

        _count: currentUserId
          ? {
              select: {
                bookingWeekly: {
                  where: {
                    studentId: currentUserId,
                  },
                },
              },
            }
          : false,
      },
    });

    return lessons.map((lesson) => {
      const hasAccess =
        currentUserId && (lesson as any)._count?.bookingWeekly > 0;

      return {
        ...lesson,

        isBooked: !!hasAccess,

        videoUrl: hasAccess ? lesson.videoUrl : null,

        _count: undefined,
      };
    });
  }

  async createLesson(teacherId: string, cretateLessonDto: CreateLessonDto) {
    const lesson = await this.prisma.lesson.create({
      data: {
        ...cretateLessonDto,
        teacherId,
      },
    });

    return {
      message: 'Lesson created successfully',
      data: lesson,
    };
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
      throw new NotFoundException('Lesson not found or not authorized');
    }

    return {
      message: 'Lesson updated successfully',
    };
  }

  async deleteLesson(profileId: string, lessonId: string) {
    const result = await this.prisma.lesson.deleteMany({
      where: {
        id: lessonId,
        teacherId: profileId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Lesson not found or not authorized');
    }

    return {
      message: 'Lesson deleted successfully',
    };
  }
}
