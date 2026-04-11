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
    const center = await this.prisma.center.findUnique({
      where: { id: centerId },
    });

    if (!center) {
      throw new NotFoundException('center not found');
    }

    const days = await this.prisma.weeklySchedule.findMany({
      where: { centerId, classRoom },
      include: {
        teacherDays: {
          orderBy: { time: 'asc' },
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    name: true,
                    imageUrl: true,
                  },
                },
              },
            },
            ...(currentUserId &&
              role === STUDENT && {
                bookeds: {
                  where: { studentId: currentUserId },
                  select: { id: true },
                },
              }),
          },
        },
      },
    });

    const schedule: Record<string, any[]> = {};

    weekDays.forEach((d) => (schedule[d] = []));

    days.forEach((day) => {
      day.teacherDays.forEach((lesson) => {
        const isBooked =
          role === 'student' && currentUserId ? lesson.bookeds : false;

        schedule[lesson.day].push({
          id: lesson.id,
          time: lesson.time,
          studyMaterial: lesson.studyMaterial,
          isBooked,
          teacher: lesson.teacher
            ? {
                id: lesson.teacher.id,
                userId: lesson.teacher.userId,
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
      });

      if (existing) {
        throw new BadRequestException('Weekly schedule already exists');
      }

      const weekDay = await prisma.weeklySchedule.create({
        data: { centerId, classRoom },
      });

      const weekly_scheduleId = weekDay.id;

      const teacherIds = [...new Set(dataDays.map((d) => d.teacherId))];

      const teachers = await prisma.teacher.findMany({
        where: { id: { in: teacherIds } },
        select: { id: true },
      });

      const validIds = new Set(teachers.map((t) => t.id));
      const invalidIds = teacherIds.filter((id) => !validIds.has(id));

      if (invalidIds.length) {
        throw new BadRequestException(
          `Invalid teacherId(s): ${invalidIds.join(', ')}`,
        );
      }

      const teacherDays = await prisma.teacherDay.createMany({
        data: dataDays.map((item) => ({
          ...item,
          weekly_scheduleId,
        })),
      });

      return {
        weekDay,
        teacherDays,
      };
    });
  }

  async updateWeeklySchedule(id: string, data: any, centerId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const teacherDay = await prisma.teacherDay.findUnique({
        where: { id },
        include: {
          weekly_schedule: {
            select: { centerId: true },
          },
        },
      });

      if (!teacherDay) {
        throw new NotFoundException('teacher weekly schedule not found');
      }

      if (teacherDay.weekly_schedule.centerId !== centerId) {
        throw new ForbiddenException('Not allowed');
      }

      const teacher = await prisma.teacher.findUnique({
        where: { id: data.teacherId },
      });

      if (!teacher) {
        throw new BadRequestException(`Invalid teacherId: ${data.teacherId}`);
      }

      const updated = await prisma.teacherDay.update({
        where: { id },
        data,
      });

      return updated;
    });
  }

  async deleteWeeklySchedule(id: string, centerId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const teacherDay = await prisma.teacherDay.findUnique({
        where: { id },
        include: {
          weekly_schedule: {
            select: { centerId: true },
          },
        },
      });

      if (!teacherDay) {
        throw new NotFoundException('teacher weekly schedule not found');
      }

      if (teacherDay.weekly_schedule.centerId !== centerId) {
        throw new ForbiddenException('Not allowed');
      }

      await prisma.teacherDay.delete({
        where: { id },
      });

      return {
        message: 'Weekly schedule deleted successfully',
      };
    });
  }
}
