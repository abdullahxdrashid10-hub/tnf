// server/src/routes/auth.routes.ts
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { verifyJWT } from '../middleware/verifyJWT.js';
import { requireRole } from '../middleware/requireRole.js';
import { loginIpLimit, refreshLimit } from '../plugins/rateLimit.js';
import * as ctrl from '../controllers/auth.controller.js';

const authRoutes: FastifyPluginAsyncZod = async (fastify) => {
  // ── POST /api/auth/login ──────────────────────────────────────────────────
  // Dual rate-limited: IP-based (5/15 min) + email-based (3/60 min)
  fastify.post(
    '/login',
    {
      schema:     { body: ctrl.LoginBody },
      config:     loginIpLimit.config,   // IP limiter applied here
    },
    ctrl.login,
  );

  // ── POST /api/auth/refresh ────────────────────────────────────────────────
  fastify.post(
    '/refresh',
    { config: refreshLimit.config },
    ctrl.refresh,
  );

  // ── POST /api/auth/logout ─────────────────────────────────────────────────
  fastify.post(
    '/logout',
    { preHandler: [verifyJWT] },
    ctrl.logout,
  );

  // ── GET /api/auth/me ──────────────────────────────────────────────────────
  fastify.get(
    '/me',
    { preHandler: [verifyJWT] },
    ctrl.me,
  );

  // ── POST /api/auth/users — register a new operator ───────────────────────
  fastify.post(
    '/users',
    {
      schema:     { body: ctrl.RegisterBody },
      preHandler: [verifyJWT, requireRole('SUPER_ADMIN')],
    },
    ctrl.registerUser,
  );
};

export default authRoutes;
