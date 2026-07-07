// server/src/plugins/auth.ts
// ─────────────────────────────────────────────────────────────────────────────
// Registers @fastify/jwt and @fastify/cookie.
// Augments FastifyRequest with the typed `user` payload shape.
// ─────────────────────────────────────────────────────────────────────────────
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { config, cookieSameSite, cookieSecure } from '../config.js';
import type { UserRole } from '@prisma/client';

// ── Type augmentation ────────────────────────────────────────────────────────
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub:  string;    // User.id (cuid)
      role: UserRole;
    };
    user: {
      sub:  string;
      role: UserRole;
    };
  }
}

// Expose cookieSameSite / cookieSecure to controllers that set cookies
export { cookieSameSite, cookieSecure };

export default fp(async (fastify) => {
  await fastify.register(cookie, {
    secret: config.COOKIE_SECRET,
    hook:   'onRequest',
  });

  await fastify.register(jwt, {
    secret: config.JWT_SECRET,
    sign:   { expiresIn: config.JWT_ACCESS_EXPIRES },
  });
});
