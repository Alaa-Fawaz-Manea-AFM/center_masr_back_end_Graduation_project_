import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async create(
    teacherId: string,
    lessonId: string,
    courseId: string,
    createExamDto: CreateExamDto,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const lesson = await prisma.lesson.findFirst({
        where: {
          id: lessonId,
          courseId,
          teacherId,
        },
        select: { id: true },
      });

      if (!lesson) {
        throw new NotFoundException('Not authorized or invalid lesson');
      }

      const exam = await prisma.exam.create({
        data: {
          ...createExamDto,
          lessonId,
          teacherId,
          courseId,
        },
      });

      if (!exam) {
        throw new NotFoundException('Exam not created');
      }

      prisma.course.update({
        where: { id: courseId },
        data: {
          examCounts: { increment: 1 },
        },
      });
      return sendResponsive(exam, 'Exam created successfully');
    });
  }
  async findAll(courseId: string, studentId: string) {
    const exams = await this.prisma.exam.findMany({
      where: { courseId },
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
    });

    const bookings = await this.prisma.bookedLesson.findMany({
      where: {
        studentId,
        lessonId: { in: exams.map((e) => e.lessonId) },
      },
      select: { lessonId: true },
    });

    const accessSet = new Set(bookings.map((l) => l.lessonId));
    const data = exams.map((exam) => {
      const hasAccess = accessSet.has(exam.lessonId);

      return {
        id: exam.id,
        lessonId: exam.lessonId,
        title: exam.lesson.title,
        fileUrl: hasAccess ? exam.fileUrl : null,
        isBooked: hasAccess,
      };
    });

    return sendResponsive(data, 'Get All Exams successfully');
  }

  async findOne(studentId: string, examId: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
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
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    const isBooked = studentId
      ? await this.prisma.bookedLesson.count({
          where: {
            studentId,
            lessonId: exam.lessonId,
          },
        })
      : 0;

    return sendResponsive(
      {
        ...exam,
        fileUrl: isBooked ? exam.fileUrl : null,
        isBooked: isBooked > 0,
      },
      'Get Exam successfully',
    );
  }

  async update(
    examId: string,
    teacherId: string,
    updateExamDto: UpdateExamDto,
  ) {
    const updated = await this.prisma.exam.updateMany({
      where: {
        id: examId,
        teacherId,
      },
      data: updateExamDto,
    });

    if (updated.count === 0) {
      throw new NotFoundException('Exam not found or not authorized');
    }

    return sendResponsive(null, 'Exam updated successfully');
  }

  async remove(teacherId: string, examId: string, courseId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const exam = await prisma.exam.deleteMany({
        where: {
          id: examId,
          teacherId,
        },
      });

      if (exam.count === 0) {
        throw new NotFoundException('Exam not found or not authorized');
      }

      await prisma.course.updateMany({
        where: {
          id: courseId,
          examCounts: {
            gt: 0,
          },
        },
        data: {
          examCounts: {
            decrement: 1,
          },
        },
      });

      return sendResponsive(null, 'Exam deleted successfully');
    });
  }
}
