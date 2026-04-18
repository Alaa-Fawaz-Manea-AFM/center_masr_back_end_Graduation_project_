import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post(':lessonId')
  create(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Query('courseId', ParseUUIDPipe) courseId: string,
    @Body() createNoteDto: CreateNoteDto,
    @Req() req,
  ) {
    return this.noteService.create(
      req.user.profileId,
      lessonId,
      courseId,
      createNoteDto,
    );
  }

  @Get()
  findAll(@Query('courseId', ParseUUIDPipe) courseId, @Req() req) {
    return this.noteService.findAll(courseId, req.user.profileId);
  }

  @Get(':noteId')
  findOne(@Param('noteId', ParseUUIDPipe) noteId: string, @Req() req) {
    return this.noteService.findOne(noteId, req.user.profileId);
  }

  @Patch(':noteId')
  update(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @Body() createNoteDto: CreateNoteDto,
    @Req() req,
  ) {
    return this.noteService.update(noteId, req.user.profileId, createNoteDto);
  }

  @Delete(':noteId')
  remove(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @Query('courseId', ParseUUIDPipe) courseId,
    @Req() req,
  ) {
    return this.noteService.remove(noteId, req.user.profileId, courseId);
  }
}
