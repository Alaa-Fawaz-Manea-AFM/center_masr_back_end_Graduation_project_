import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BookedService {
  constructor(private prisma: PrismaService) {}
  async toggleBookedStudent(studentId: string, teacherDayId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const teacherDay = await prisma.teacherDay.findUnique({
        where: { id: teacherDayId },
        select: { id: true },
      });

      if (!teacherDay) {
        throw new NotFoundException('Teacher day not found');
      }

      const existingBooking = await prisma.booked.findUnique({
        where: {
          studentId_teacherDayId: {
            studentId,
            teacherDayId,
          },
        },
      });

      let message = 'Booked';

      if (!existingBooking) {
        await prisma.booked.create({
          data: {
            studentId,
            teacherDayId,
          },
        });
      } else {
        await prisma.booked.delete({
          where: {
            studentId_teacherDayId: {
              studentId,
              teacherDayId,
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
