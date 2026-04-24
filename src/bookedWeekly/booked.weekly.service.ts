import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BookedWeeklyService {
  constructor(private prisma: PrismaService) {}

  async toggleBookedStudent(studentId: string, teacherDayId: string) {
    return this.prisma.$transaction(async (prisma) => {
      try {
        await prisma.bookedWeekly.create({
          data: {
            studentId,
            teacherDayId,
          },
        });

        return {
          message: 'Weekly booked successfully',
          isBooked: true,
        };
      } catch (error: any) {
        if (error.code === 'P2002') {
          await prisma.bookedWeekly.delete({
            where: {
              studentId_teacherDayId: {
                studentId,
                teacherDayId,
              },
            },
          });

          return {
            message: 'Weekly unbooked successfully',
            isBooked: false,
          };
        }

        if (error.code === 'P2003')
          throw new NotFoundException('Teacher day not found');

        throw error;
      }
    });
  }
}
