import { BadRequestException } from '@nestjs/common';
import { roleSet } from '../utils/index.js';

const validateRole = (role) => {
  if (roleSet.has(role)) throw new BadRequestException(`Invalid role: ${role}`);
};

export default validateRole;
