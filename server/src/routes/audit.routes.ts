// server/src/routes/audit.routes.ts
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { verifyJWT } from '../middleware/verifyJWT.js';
import { requireRole } from '../middleware/requireRole.js';
import * as ctrl from '../controllers/audit.controller.js';

const auditRoutes: FastifyPluginAsyncZod = async (fastify) => {
  // Audit log is read-only and SUPER_ADMIN only
  fastify.addHook('preHandler', verifyJWT);

  // ── GET /api/audit ────────────────────────────────────────────────────────
  fastify.get(
    '/',
    {
      schema:     { querystring: ctrl.ListAuditQuery },
      preHandler: [requireRole('SUPER_ADMIN')],
    },
    ctrl.listAuditLogs,
  );
};

export default auditRoutes;
