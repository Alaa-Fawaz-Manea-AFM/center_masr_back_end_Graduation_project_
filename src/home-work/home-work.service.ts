import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHomeWorkDto } from './dto/create-home-work.dto';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';

@Injectable()
export class HomeWorkService {
  constructor(private prisma: PrismaService) {}

  async create(
    courseId: string,
    teacherId: string,
    lessonId: string,
    createHomeWorkDto: CreateHomeWorkDto,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          teacherId,
        },
        select: { id: true },
      });

      if (!course) {
        throw new NotFoundException('Course not found or not authorized');
      }

      const homeWork = await prisma.homework.create({
        data: {
          ...createHomeWorkDto,
          courseId,
          lessonId,
          teacherId,
        },
      });

      if (!homeWork) {
        throw new NotFoundException('Hom Work error created ');
      }
      await prisma.course.updateMany({
        where: {
          id: courseId,
          teacherId,
          homeworkCounts: {
            gt: 0,
          },
        },
        data: {
          homeworkCounts: {
            increment: 1,
          },
        },
      });

      return sendResponsive(homeWork, 'Home work created successfully');
    });
  }

  async findAll(courseId: string, studentId: string) {
    const homeWorks = await this.prisma.homework.findMany({
      where: { courseId },
      select: {
        id: true,
        fileUrl: true,
        lessonId: true,
        lesson: {
          select: {
            id: true,
            title: true,
            _count: {
              select: {
                bookingLesson: {
                  where: {
                    studentId,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!homeWorks.length) {
      throw new NotFoundException('Home Works not found');
    }

    const lessonIds = [...new Set(homeWorks.map((h) => h.lessonId))];

    const bookings = await this.prisma.bookedLesson.findMany({
      where: {
        studentId,
        lessonId: { in: lessonIds },
      },
      select: {
        lessonId: true,
      },
    });

    const accessSet = new Set(bookings.map((b) => b.lessonId));

    const data = homeWorks.map((homeWork) => {
      const hasAccess = accessSet.has(homeWork.lessonId);

      return {
        id: homeWork.id,
        lessonId: homeWork.lessonId,
        lesson: homeWork.lesson,
        fileUrl: hasAccess ? homeWork.fileUrl : null,
        isBooked: hasAccess,
      };
    });

    return sendResponsive(data, 'Home work created successfully');
  }
  async findOne(homeWorkId: string, currentUserId: string) {
    const [homeWork, booking] = await Promise.all([
      this.prisma.homework.findUnique({
        where: { id: homeWorkId },
        select: {
          id: true,
          fileUrl: true,
          lessonId: true,
          lesson: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),

      this.prisma.bookedLesson.findUnique({
        where: {
          studentId_lessonId: {
            studentId: currentUserId,
            lessonId: homeWorkId,
          },
        },
        select: { id: true },
      }),
    ]);

    if (!homeWork) {
      throw new NotFoundException('Home work not found');
    }

    const isBooked = !!booking;

    return sendResponsive(
      {
        ...homeWork,
        isBooked,
        fileUrl: isBooked ? homeWork.fileUrl : null,
      },
      'Get Home Work successfully',
    );
  }
  async update(
    homeWorkId: string,
    teacherId: string,
    updateHomeWorkDto: CreateHomeWorkDto,
  ) {
    const result = await this.prisma.homework.updateMany({
      where: {
        id: homeWorkId,
        teacherId,
      },
      data: updateHomeWorkDto,
    });

    if (result.count === 0) {
      throw new NotFoundException('Home work not found or not authorized');
    }

    return sendResponsive(null, 'Home Work updated successfully');
  }
  async remove(homeWorkId: string, courseId: string, teacherId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const homework = await prisma.homework.deleteMany({
        where: {
          id: homeWorkId,
          teacherId,
        },
      });

      if (homework.count === 0) {
        throw new NotFoundException('Homework not found or not authorized');
      }

      await prisma.course.update({
        where: {
          id: courseId,

          homeworkCounts: {
            gt: 0,
          },
        },
        data: {
          homeworkCounts: {
            decrement: 1,
          },
        },
      });

      return sendResponsive(null, 'Homework deleted successfully');
    });
  }
}
