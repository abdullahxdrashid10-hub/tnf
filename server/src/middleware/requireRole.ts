// server/src/middleware/requireRole.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { UserRole } from '@prisma/client';
import { ForbiddenError } from '../lib/errors.js';

/**
 * Returns a prehandler that enforces minimum role.
 * Must be used AFTER verifyJWT so request.user is populated.
 *
 * Role hierarchy: VIEWER < OPERATOR < SUPER_ADMIN
 *
 * @example
 *   fastify.delete('/api/products/:id', {
 *     preHandler: [verifyJWT, requireRole('SUPER_ADMIN')],
 *   }, handler)
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return async function roleGuard(
    request: FastifyRequest,
    _reply: FastifyReply,
  ): Promise<void> {
    if (!allowedRoles.includes(request.user.role)) {
      throw new ForbiddenError(
        `This action requires one of: ${allowedRoles.join(', ')}`,
      );
    }
  };
}
