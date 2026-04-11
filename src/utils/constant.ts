const [body, params, query]: string[] = ['body', 'params', 'query'];

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

export {
  body,
  ADMIN,
  query,
  Roles,
  CENTER,
  params,
  roleSet,
  TEACHER,
  STUDENT,
  roleArray,
  roleTeacherAndCenter,
  weekDays,
  classRoomArray,
  studyMaterialArray,
  educationalStageArray,
  roleTeacherAndCenterSet,
};
