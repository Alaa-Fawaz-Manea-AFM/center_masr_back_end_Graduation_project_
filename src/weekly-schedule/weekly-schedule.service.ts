import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { STUDENT, weekDays } from 'src/utils';
import { CreateWeeklyDto } from './dto/create-weekly-schedule.dto';

@Injectable()
export class WeeklyScheduleService {
  constructor(private prisma: PrismaService) {}

  async getWeeklySchedule(
    centerId: string,
    classRoom: string,
    currentUserId?: string,
    role?: string,
  ) {
    const days = await this.prisma.weeklySchedule.findMany({
      where: { centerId, classRoom },

      select: {
        teacherDays: {
          orderBy: { time: 'asc' },

          select: {
            id: true,
            day: true,
            time: true,
            studyMaterial: true,

            teacher: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                    imageUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const schedule: Record<string, any[]> = {};

    weekDays.forEach((day) => {
      schedule[day] = [];
    });

    let bookedSet = new Set<string>();

    if (currentUserId && role === 'student') {
      const bookings = await this.prisma.bookedWeekly.findMany({
        where: {
          studentId: currentUserId,
        },
        select: {
          teacherDayId: true,
        },
      });

      bookedSet = new Set(bookings.map((b) => b.teacherDayId));
    }

    days.forEach((group) => {
      group.teacherDays.forEach((lesson) => {
        schedule[lesson.day].push({
          id: lesson.id,
          time: lesson.time,
          studyMaterial: lesson.studyMaterial,

          isBooked: bookedSet.has(lesson.id),

          teacher: lesson.teacher
            ? {
                id: lesson.teacher.id,
                name: lesson.teacher.user.name,
                imageUrl: lesson.teacher.user.imageUrl,
              }
            : null,
        });
      });
    });

    return schedule;
  }

  async createWeekly(centerId: string, createWeeklyDto: CreateWeeklyDto) {
    const { classRoom, dataDays } = createWeeklyDto;

    return await this.prisma.$transaction(async (prisma) => {
      let weekly;
      try {
        weekly = await prisma.weeklySchedule.create({
          data: {
            classRoom,
            centerId,
          },
        });
      } catch (error) {
        throw new BadRequestException('Weekly schedule already exists');
      }

      const data = await prisma.teacherDay.createManyAndReturn({
        data: dataDays.map((day) => ({
          ...day,
          weekly_scheduleId: weekly.id,
        })),
      });

      return prisma.weeklySchedule.findUnique({
        where: { id: weekly.id },
        include: {
          teacherDays: true,
          center: {
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
        },
      });
    });
  }

  async createWeeklySchedule(
    centerId: string,
    createWeeklyDto: CreateWeeklyDto,
  ) {
    const { classRoom, dataDays } = createWeeklyDto;

    return this.prisma.$transaction(async (prisma) => {
      const existing = await prisma.weeklySchedule.findFirst({
        where: { centerId, classRoom },
        select: { id: true },
      });

      if (existing) {
        throw new BadRequestException('Weekly schedule already exists');
      }

      const weekDay = await prisma.weeklySchedule.create({
        data: {
          centerId,
          classRoom,
        },
        select: {
          id: true,
          centerId: true,
          classRoom: true,
        },
      });

      const weekly_scheduleId = weekDay.id;

      const teacherIds = [...new Set(dataDays.map((d) => d.teacherId))];

      const validTeachers = await prisma.teacher.findMany({
        where: { id: { in: teacherIds } },
        select: { id: true },
      });

      const validSet = new Set(validTeachers.map((t) => t.id));

      const invalidIds = teacherIds.filter((id) => !validSet.has(id));

      if (invalidIds.length) {
        throw new BadRequestException(
          `Invalid teacherId(s): ${invalidIds.join(', ')}`,
        );
      }

      const teacherDaysData = dataDays.map((item) => ({
        teacherId: item.teacherId,
        day: item.day,
        time: item.time,
        studyMaterial: item.studyMaterial,
        weekly_scheduleId,
      }));

      const result = await prisma.teacherDay.createMany({
        data: teacherDaysData,
      });

      return {
        weeklySchedule: weekDay,
        teacherDaysCreated: result.count,
      };
    });
  }
  async updateWeeklySchedule(id: string, data: any, centerId: string) {
    const updated = await this.prisma.teacherDay.updateMany({
      where: {
        id,
        weekly_schedule: {
          centerId,
        },
      },
      data,
    });

    if (updated.count === 0) {
      throw new NotFoundException('Not found or not allowed');
    }

    return {
      message: 'Updated successfully',
    };
  }

  async deleteWeeklySchedule(id: string, centerId: string) {
    const result = await this.prisma.teacherDay.deleteMany({
      where: {
        id,
        weekly_schedule: {
          centerId,
        },
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Not found or not allowed');
    }

    return {
      message: 'Weekly schedule deleted successfully',
    };
  }
}
