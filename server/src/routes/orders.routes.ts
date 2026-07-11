// server/src/routes/orders.routes.ts
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import type { z } from 'zod';
import { verifyJWT } from '../middleware/verifyJWT.js';
import { requireRole } from '../middleware/requireRole.js';
import * as ctrl from '../controllers/orders.controller.js';

const orderRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.addHook('preHandler', verifyJWT);

  // ── GET /api/orders ───────────────────────────────────────────────────────
  fastify.get<{ Querystring: z.infer<typeof ctrl.ListOrdersQuery> }>(
    '/',
    { schema: { querystring: ctrl.ListOrdersQuery } },
    ctrl.listOrders,
  );

  // ── GET /api/orders/:id ───────────────────────────────────────────────────
  // Accepts displayId ("ORD-0091") or internal cuid
  fastify.get<{ Params: z.infer<typeof ctrl.OrderIdParam> }>(
    '/:id',
    { schema: { params: ctrl.OrderIdParam } },
    ctrl.getOrder,
  );

  // ── POST /api/orders ──────────────────────────────────────────────────────
  fastify.post<{ Body: z.infer<typeof ctrl.CreateOrderBody> }>(
    '/',
    {
      schema:     { body: ctrl.CreateOrderBody },
      preHandler: [requireRole('OPERATOR', 'SUPER_ADMIN')],
    },
    ctrl.createOrder,
  );

  // ── PATCH /api/orders/:id/status ──────────────────────────────────────────
  fastify.patch<{
    Params: z.infer<typeof ctrl.OrderIdParam>;
    Body:   z.infer<typeof ctrl.UpdateOrderStatusBody>;
  }>(
    '/:id/status',
    {
      schema: {
        params: ctrl.OrderIdParam,
        body:   ctrl.UpdateOrderStatusBody,
      },
      preHandler: [requireRole('OPERATOR', 'SUPER_ADMIN')],
    },
    ctrl.updateOrderStatus,
  );
};

export default orderRoutes;
