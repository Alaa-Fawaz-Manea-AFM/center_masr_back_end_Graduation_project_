import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BookedWeeklyService {
  constructor(private prisma: PrismaService) {}
  async toggleBookedStudent(studentId: string, lessonId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { id: true },
      });

      if (!lesson) {
        throw new NotFoundException('Teacher day not found');
      }

      const existingBookingWeekly = await prisma.bookedWeekly.findUnique({
        where: {
          studentId_lessonId: {
            studentId,
            lessonId,
          },
        },
      });

      let message = 'Booked';

      if (!existingBookingWeekly) {
        await prisma.bookedWeekly.create({
          data: {
            studentId,
            lessonId,
          },
        });
      } else {
        await prisma.bookedWeekly.delete({
          where: {
            studentId_lessonId: {
              studentId,
              lessonId,
            },
          },
        });

        message = 'Unbooked';
      }

      return {
        message: `Weekly ${message} successfully`,
      };
    });
  }
}
