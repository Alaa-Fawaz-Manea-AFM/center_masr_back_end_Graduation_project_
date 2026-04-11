import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const userId = request?.user?.userId;
    const resourceUserId = request.params.id || request.body.userId;

    if (resourceUserId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    return true;
  }
}
