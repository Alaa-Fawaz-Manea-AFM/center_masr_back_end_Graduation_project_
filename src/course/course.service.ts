import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}
  async create(teacherId: string, createCourseDto: CreateCourseDto) {
    return this.prisma.$transaction(async (prisma) => {
      const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
      });

      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }

      const course = await prisma.course.create({
        data: {
          ...createCourseDto,
          teacherId,
        },
      });

      if (course) {
        throw new NotFoundException('Course not created');
      }

      await prisma.teacher.update({
        where: { id: teacherId },
        data: {
          courseCounts: { increment: 1 },
        },
      });

      return sendResponsive(course, 'Course created successfully');
    });
  }

  async findAll(page = 1, teacherId: string) {
    const limit = 6;
    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where: { teacherId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          classRoom: true,
          studyMaterial: true,
          time: true,
          lessonCounts: true,
          examCounts: true,
          noteCounts: true,
          homeworkCounts: true,
          studentCounts: true,
          createdAt: true,
        },
      }),

      this.prisma.course.count({
        where: { teacherId },
      }),
    ]);

    return sendResponsive(
      {
        data: courses,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      'Get All courses successfully',
    );
  }

  async findOne(lessonId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        time: true,
        studyMaterial: true,
        classRoom: true,
        lessonCounts: true,
        examCounts: true,
        noteCounts: true,
        homeworkCounts: true,
        studentCounts: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return sendResponsive(course, 'Get Course successfully');
  }

  async update(
    lessonId: string,
    teacherId: string,
    updateCourseDto: UpdateCourseDto,
  ) {
    const result = await this.prisma.course.updateMany({
      where: {
        id: lessonId,
        teacherId,
      },
      data: {
        ...updateCourseDto,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Course not found or not allowed');
    }

    return sendResponsive(null, 'Course updated successfully');
  }

  async remove(courseId: string, teacherId: string) {
    return await this.prisma.$transaction(async (prisma) => {
      const result = await prisma.course.deleteMany({
        where: {
          id: courseId,
          teacherId,
        },
      });

      if (result.count === 0) {
        throw new NotFoundException('Course not found or not allowed');
      }

      await prisma.teacher.update({
        where: { id: teacherId },
        data: {
          courseCounts: { decrement: 1 },
        },
      });

      return sendResponsive(null, 'Course deleted successfully');
    });
  }
}
