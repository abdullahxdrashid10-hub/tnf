  // server/src/lib/tokens.ts
// ─────────────────────────────────────────────────────────────────────────────
// Shared token payload types.
// Actual sign/verify goes through @fastify/jwt decorators on the Fastify
// instance (reply.jwtSign / request.jwtVerify) — this file exports the
// typed payload shape so it can be imported by middleware + controllers
// without creating a circular dependency on the Fastify instance.
// ─────────────────────────────────────────────────────────────────────────────
import type { UserRole } from '@prisma/client';

export interface JwtPayload {
  /** User.id (cuid) */
  sub:  string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/** Parses a raw Bearer header and returns just the token string. */
export function extractBearer(authHeader: string | undefined): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}
