// server/src/controllers/stats.controller.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../plugins/db.js';

// ── Handlers ─────────────────────────────────────────────────────────────────

/**
 * GET /api/stats/overview
 * Powers the sidebar inventory depth panel in AdminPanel.jsx.
 * All queries run in parallel — single network round-trip to the DB.
 */
export async function getOverview(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const [
    totalSkus,
    apparelCount,
    uniformCount,
    sportswearCount,
    activeOrders,
    pendingOrders,
    contractPipeline,
    activeContracts,
  ] = await Promise.all([
    // Product inventory depth
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true, category: 'APPAREL' } }),
    prisma.product.count({ where: { isActive: true, category: 'UNIFORM_WORKWEAR' } }),
    prisma.product.count({ where: { isActive: true, category: 'SPORTSWEAR' } }),

    // Order counts
    prisma.retailOrder.count({
      where: { status: { in: ['PENDING', 'PROCESSING'] } },
    }),
    prisma.retailOrder.count({ where: { status: 'PENDING' } }),

    // Contract pipeline — total units across active contracts
    prisma.contract.aggregate({
      _sum:   { unitCount: true },
      where:  { isActive: true, status: { notIn: ['COMPLETED', 'CANCELLED'] } },
    }),
    prisma.contract.count({
      where: { isActive: true, status: { notIn: ['COMPLETED', 'CANCELLED'] } },
    }),
  ]);

  return reply.status(200).send({
    skus: {
      total:           totalSkus,
      byCategory: {
        apparel:        apparelCount,
        uniformWorkwear:uniformCount,
        sportswear:     sportswearCount,
      },
    },
    orders: {
      active:  activeOrders,
      pending: pendingOrders,
    },
    contracts: {
      active:        activeContracts,
      pipelineUnits: contractPipeline._sum.unitCount ?? 0,
    },
  });
}
