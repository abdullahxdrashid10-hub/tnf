// server/src/routes/contracts.routes.ts
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { verifyJWT } from '../middleware/verifyJWT.js';
import { requireRole } from '../middleware/requireRole.js';
import * as ctrl from '../controllers/contracts.controller.js';

const contractRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.addHook('preHandler', verifyJWT);

  // ── GET /api/contracts ────────────────────────────────────────────────────
  fastify.get(
    '/',
    { schema: { querystring: ctrl.ListContractsQuery } },
    ctrl.listContracts,
  );

  // ── GET /api/contracts/:id ────────────────────────────────────────────────
  fastify.get(
    '/:id',
    { schema: { params: ctrl.ContractIdParam } },
    ctrl.getContract,
  );

  // ── POST /api/contracts ───────────────────────────────────────────────────
  fastify.post(
    '/',
    {
      schema:     { body: ctrl.CreateContractBody },
      preHandler: [requireRole('OPERATOR', 'SUPER_ADMIN')],
    },
    ctrl.createContract,
  );

  // ── PATCH /api/contracts/:id ──────────────────────────────────────────────
  fastify.patch(
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
  fastify.delete(
    '/:id',
    {
      schema:     { params: ctrl.ContractIdParam },
      preHandler: [requireRole('SUPER_ADMIN')],
    },
    ctrl.deactivateContract,
  );
};

export default contractRoutes;
