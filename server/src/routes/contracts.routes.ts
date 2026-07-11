// server/src/routes/contracts.routes.ts
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import type { z } from 'zod';
import { verifyJWT } from '../middleware/verifyJWT.js';
import { requireRole } from '../middleware/requireRole.js';
import * as ctrl from '../controllers/contracts.controller.js';

const contractRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.addHook('preHandler', verifyJWT);

  // ── GET /api/contracts ────────────────────────────────────────────────────
  fastify.get<{ Querystring: z.infer<typeof ctrl.ListContractsQuery> }>(
    '/',
    { schema: { querystring: ctrl.ListContractsQuery } },
    ctrl.listContracts,
  );

  // ── GET /api/contracts/:id ────────────────────────────────────────────────
  fastify.get<{ Params: z.infer<typeof ctrl.ContractIdParam> }>(
    '/:id',
    { schema: { params: ctrl.ContractIdParam } },
    ctrl.getContract,
  );

  // ── POST /api/contracts ───────────────────────────────────────────────────
  fastify.post<{ Body: z.infer<typeof ctrl.CreateContractBody> }>(
    '/',
    {
      schema:     { body: ctrl.CreateContractBody },
      preHandler: [requireRole('OPERATOR', 'SUPER_ADMIN')],
    },
    ctrl.createContract,
  );

  // ── PATCH /api/contracts/:id ──────────────────────────────────────────────
  fastify.patch<{
    Params: z.infer<typeof ctrl.ContractIdParam>;
    Body:   z.infer<typeof ctrl.UpdateContractBody>;
  }>(
    '/:id',
    {
      schema: {
        params: ctrl.ContractIdParam,
        body:   ctrl.UpdateContractBody,
      },
      preHandler: [requireRole('OPERATOR', 'SUPER_ADMIN')],
    },
    ctrl.updateContract,
  );

  // ── DELETE /api/contracts/:id — SOFT DELETE ───────────────────────────────
  fastify.delete<{ Params: z.infer<typeof ctrl.ContractIdParam> }>(
    '/:id',
    {
      schema:     { params: ctrl.ContractIdParam },
      preHandler: [requireRole('SUPER_ADMIN')],
    },
    ctrl.deactivateContract,
  );
};

export default contractRoutes;
