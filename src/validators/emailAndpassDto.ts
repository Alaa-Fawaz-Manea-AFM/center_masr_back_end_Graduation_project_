import { Matches } from 'class-validator';

export default class EmailAndPassDto {
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov)$/, {
    message: 'Email must be like example@domain.(com|org|net|edu|gov)',
  })
  email!: string;

  @Matches(/^(?=(?:.*[A-Z]){3,})(?=(?:.*[a-z]){3,})(?=(?:.*\d){3,}).{9,}$/, {
    message:
      'password must contain at least 3 uppercase, 3 lowercase, and 3 numbers',
  })
  password!: string;
}
