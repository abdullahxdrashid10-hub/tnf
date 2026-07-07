// server/src/routes/stats.routes.ts
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { verifyJWT } from '../middleware/verifyJWT.js';
import { requireRole } from '../middleware/requireRole.js';
import * as ctrl from '../controllers/stats.controller.js';

const statsRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.addHook('preHandler', verifyJWT);

  // ── GET /api/stats/overview ───────────────────────────────────────────────
  // OPERATOR+ (VIEWERs don't need aggregate data)
  fastify.get(
    '/overview',
    { preHandler: [requireRole('OPERATOR', 'SUPER_ADMIN')] },
    ctrl.getOverview,
  );
};

export default statsRoutes;
