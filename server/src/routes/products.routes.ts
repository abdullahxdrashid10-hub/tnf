// server/src/routes/products.routes.ts
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import type { z } from 'zod';
import { verifyJWT } from '../middleware/verifyJWT.js';
import { requireRole } from '../middleware/requireRole.js';
import * as ctrl from '../controllers/products.controller.js';

const productRoutes: FastifyPluginAsyncZod = async (fastify) => {
  // All product routes require authentication
  fastify.addHook('preHandler', verifyJWT);

  // ── GET /api/products ─────────────────────────────────────────────────────
  fastify.get<{ Querystring: z.infer<typeof ctrl.ListProductsQuery> }>(
    '/',
    { schema: { querystring: ctrl.ListProductsQuery } },
    ctrl.listProducts,
  );

  // ── GET /api/products/:id ─────────────────────────────────────────────────
  fastify.get<{ Params: z.infer<typeof ctrl.ProductIdParam> }>(
    '/:id',
    { schema: { params: ctrl.ProductIdParam } },
    ctrl.getProduct,
  );

  // ── POST /api/products ────────────────────────────────────────────────────
  fastify.post<{ Body: z.infer<typeof ctrl.CreateProductBody> }>(
    '/',
    {
      schema:     { body: ctrl.CreateProductBody },
      preHandler: [requireRole('OPERATOR', 'SUPER_ADMIN')],
    },
    ctrl.createProduct,
  );

  // ── PATCH /api/products/:id ───────────────────────────────────────────────
  fastify.patch<{
    Params: z.infer<typeof ctrl.ProductIdParam>;
    Body:   z.infer<typeof ctrl.UpdateProductBody>;
  }>(
    '/:id',
    {
      schema: {
        params: ctrl.ProductIdParam,
        body:   ctrl.UpdateProductBody,
      },
      preHandler: [requireRole('OPERATOR', 'SUPER_ADMIN')],
    },
    ctrl.updateProduct,
  );

  // ── DELETE /api/products/:id — SOFT DELETE ────────────────────────────────
  // Sets isActive=false + writes AuditLog; does NOT hard-delete the row.
  // OrderItem → Product FK (Restrict) is preserved.
  fastify.delete<{ Params: z.infer<typeof ctrl.ProductIdParam> }>(
    '/:id',
    {
      schema:     { params: ctrl.ProductIdParam },
      preHandler: [requireRole('SUPER_ADMIN')],
    },
    ctrl.deactivateProduct,
  );
};

export default productRoutes;
