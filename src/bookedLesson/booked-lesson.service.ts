import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BookedLessonService {
  constructor(private prisma: PrismaService) {}

  async toggleBookedStudent(studentId: string, lessonId: string) {
    return this.prisma.$transaction(async (prisma) => {
      try {
        await prisma.bookedLesson.create({
          data: {
            lessonId,
            studentId,
          },
        });

        return {
          message: 'Lesson booked successfully',
          isBooked: true,
        };
      } catch (error: any) {
        if (error.code === 'P2002') {
          await prisma.bookedLesson.delete({
            where: {
              studentId_lessonId: {
                studentId,
                lessonId,
              },
            },
          });

          return {
            message: 'Lesson unbooked successfully',
            isBooked: false,
          };
        }

        if (error.code === 'P2003') {
          throw new NotFoundException('Lesson not found');
        }

        throw error;
      }
    });
  }
}
