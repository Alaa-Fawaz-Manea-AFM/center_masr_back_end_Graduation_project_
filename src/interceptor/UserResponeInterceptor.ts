import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class UserResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        if (!data.data) return data;

        const user = data.data.user ?? data.data;

        return {
          ...data.data,
          user: user
            ? {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                [`${user.role}`]: user[user.role],
                profile: user[`profile_${user.role}s`],
              }
            : user,
        };
      }),
    );
  }
}
