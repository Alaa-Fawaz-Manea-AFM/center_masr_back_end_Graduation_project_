import { PartialType } from '@nestjs/mapped-types';
import { DataDayDto } from './DataDayDto';

export class UpdateWeeklyDto extends PartialType(DataDayDto) {}
