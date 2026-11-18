import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { DestructiveOperationsGuard } from './destructive-operations.guard.js';

describe('DestructiveOperationsGuard', () => {
  const context = {} as ExecutionContext;
  const guard = new DestructiveOperationsGuard();
  const original = process.env.ALLOW_DESTRUCTIVE_HTTP;

  afterEach(() => {
    if (original === undefined) delete process.env.ALLOW_DESTRUCTIVE_HTTP;
    else process.env.ALLOW_DESTRUCTIVE_HTTP = original;
  });

  it('rejects destructive HTTP operations by default', () => {
    delete process.env.ALLOW_DESTRUCTIVE_HTTP;
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('allows them only when explicitly enabled by the server environment', () => {
    process.env.ALLOW_DESTRUCTIVE_HTTP = 'true';
    expect(guard.canActivate(context)).toBe(true);
  });
});
