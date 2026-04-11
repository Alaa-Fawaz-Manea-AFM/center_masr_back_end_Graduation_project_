import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class PreventSelfGuard implements CanActivate {
  constructor(private key: string = 'id') {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    const targetId = request.params?.[this.key];

    if (!userId || !targetId) return true;

    if (targetId === userId) {
      throw new ForbiddenException("You can't perform this on yourSelf");
    }

    return true;
  }
}
