import { BadRequestException } from '@nestjs/common';

const checkOwnership = (userId: string, currentUserId: string) => {
  if (userId !== currentUserId)
    throw new BadRequestException('You are not allowed to perform this action');
};

export default checkOwnership;
