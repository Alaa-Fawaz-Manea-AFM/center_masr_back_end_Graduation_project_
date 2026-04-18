import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}
  async create(
    teacherId: string,
    lessonId: string,
    courseId: string,
    createNoteDto: CreateNoteDto,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const lesson = await prisma.lesson.findFirst({
        where: {
          id: lessonId,
          courseId,
          teacherId,
        },
        select: {
          id: true,
        },
      });

      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }

      const note = await prisma.note.create({
        data: {
          ...createNoteDto,
          lessonId,
          teacherId,
          courseId,
        },
      });

      if (!note) {
        throw new NotFoundException('Note not created');
      }

      await prisma.course.update({
        where: {
          id: courseId,
          noteCounts: {
            gte: 0,
          },
        },
        data: {
          noteCounts: { increment: 1 },
        },
      });

      return note;
    });
  }

  async findAll(courseId: string, studentId: string) {
    const notes = await this.prisma.note.findMany({
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

    if (!notes.length) {
      throw new NotFoundException('Notes not found');
    }

    const lessonIds = [...new Set(notes.map((n) => n.lessonId))];

    const bookings = await this.prisma.bookedLesson.findMany({
      where: {
        studentId,
        lessonId: { in: lessonIds },
      },
      select: {
        lessonId: true,
      },
    });

    const bookedSet = new Set(bookings.map((b) => b.lessonId));

    return {
      notes: notes.map((note) => ({
        id: note.id,
        lessonId: note.lessonId,
        title: note.lesson.title,
        fileUrl: bookedSet.has(note.lessonId) ? note.fileUrl : null,
        isBooked: bookedSet.has(note.lessonId),
      })),
    };
  }

  async findOne(noteId: string, currentUserId: string) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
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

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    let isBooked = false;

    if (currentUserId) {
      const booking = await this.prisma.bookedLesson.findUnique({
        where: {
          studentId_lessonId: {
            studentId: currentUserId,
            lessonId: note.lessonId,
          },
        },
        select: { id: true },
      });

      isBooked = !!booking;
    }

    return sendResponsive(
      {
        ...note,
        fileUrl: isBooked ? note.fileUrl : null,
        isBooked,
      },
      'Note retrieved successfully',
    );
  }

  async update(
    noteId: string,
    teacherId: string,
    updateNoteDto: CreateNoteDto,
  ) {
    const note = await this.prisma.note.updateMany({
      where: {
        id: noteId,
        teacherId,
      },
      data: updateNoteDto,
    });

    if (note.count === 0) {
      throw new NotFoundException('Note not found or not authorized');
    }

    return sendResponsive(null, 'Note updated successfully');
  }

  async remove(noteId: string, teacherId: string, courseId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const note = await prisma.note.deleteMany({
        where: {
          id: noteId,
          teacherId,
        },
      });
      if (note.count === 0) {
        throw new NotFoundException('Note not found or not authorized');
      }

      await prisma.course.update({
        where: {
          id: courseId,
          noteCounts: {
            gt: 0,
          },
        },
        data: {
          noteCounts: {
            decrement: 1,
          },
        },
      });

      return sendResponsive(null, 'Note deleted successfully');
    });
  }
}
