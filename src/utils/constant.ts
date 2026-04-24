import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

const studyMaterialArray: string[] = [
  'science',
  'physics',
  'biology',
  'algebra',
  'statics',
  'history',
  'calculus',
  'dynamics',
  'chemistry',
  'geography',
  'mathematics',
  'solid geometry',
  'social studies',
  'arabic language',
  'english language',
  'philosophy and logic',
  'religious education',
  'physical education',
  'computer science/information technology',
  'information and communication technology (ICT)',
];

const classRoomArray: string[] = [
  'first grade elementary',
  'second grade elementary',
  'third grade elementary',
  'fourth grade elementary',
  'fifth grade elementary',
  'sixth grade elementary',
  'first year of secondary',
  'second year of secondary',
  'third year of secondary',
  'first grade high school',
  'second grade high school',
  'third grade figh school',
];

const weekDays: string[] = [
  'saturday',
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
];

const Roles = ['admin', 'teacher', 'student', 'center'];

const [ADMIN, TEACHER, STUDENT, CENTER]: string[] = Roles;

const roleTeacherAndCenter: string[] = [TEACHER, CENTER];

const roleTeacherAndCenterSet: Set<string> = new Set(roleTeacherAndCenter);

const educationalStageArray: string[] = [
  'elementary',
  'secondary',
  'university',
];
const roleArray: string[] = [STUDENT, TEACHER, CENTER, ADMIN];

const roleSet: Set<string> = new Set(roleArray);
const classRoomSet = new Set(classRoomArray);
const studyMaterialSet = new Set(studyMaterialArray);
const educationalStageSet = new Set(educationalStageArray);
const daySet = new Set(weekDays);
const studySystemSet = new Set(['arabic', 'english']);

const [BadRequest, Unauthorized, Forbidden, NotFound] = [
  'BadRequest',
  'Unauthorized',
  'Forbidden',
  'NotFound',
];

const ErrorException = {
  BadRequest: BadRequestException,
  Unauthorized: UnauthorizedException,
  Forbidden: ForbiddenException,
  NotFound: NotFoundException,
};

export {
  ADMIN,
  Roles,
  daySet,
  CENTER,
  roleSet,
  TEACHER,
  classRoomSet,
  studySystemSet,
  educationalStageSet,
  studyMaterialSet,
  STUDENT,
  roleArray,
  roleTeacherAndCenter,
  weekDays,
  BadRequest,
  Unauthorized,
  ErrorException,
  Forbidden,
  NotFound,
  classRoomArray,
  studyMaterialArray,
  educationalStageArray,
  roleTeacherAndCenterSet,
};
