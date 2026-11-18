import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class DestructiveOperationsGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    if (process.env.ALLOW_DESTRUCTIVE_HTTP === 'true') return true;
    throw new ForbiddenException('Les suppressions HTTP sont désactivées.');
  }
}
