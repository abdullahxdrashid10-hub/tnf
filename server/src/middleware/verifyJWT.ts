// server/src/middleware/verifyJWT.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from '../lib/errors.js';

/**
 * Prehandler hook — verifies the Authorization: Bearer <token> header.
 * On success, @fastify/jwt populates request.user with { sub, role }.
 * On failure, throws UnauthorizedError caught by the global error handler.
 */
export async function verifyJWT(
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    throw new UnauthorizedError('Invalid or expired access token');
  }
}
