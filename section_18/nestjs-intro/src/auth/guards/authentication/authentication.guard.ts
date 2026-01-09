import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) { }

  private static readonly defaultAuthType = AuthType.Bearer;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const authTypeGuardMap: Record<
      AuthType, CanActivate | CanActivate[]
    > = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    }

    // Get authTypes from reflector
    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [context.getHandler(), context.getClass()])
      ?? [AuthenticationGuard.defaultAuthType]
    // Get array of guards
    const guards = authTypes.map(type => authTypeGuardMap[type]).flat();
    // Loop guards canActivate
    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context)
      ).catch(error => { error })
      if (canActivate) {
        return true;
      }
    }
    throw new UnauthorizedException();
  }
}
