import IfAppError from './appError';

const checkOwnership = (userId: string, currentUserId: string) => {
  IfAppError(
    userId !== currentUserId,
    'You are not allowed to perform this action',
    403,
  );
};

export default checkOwnership;
