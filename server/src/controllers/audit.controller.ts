// server/src/controllers/audit.controller.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import type { AuditAction } from '@prisma/client';
import { prisma } from '../plugins/db.js';
import { toPrismaPagination, paginate } from '../lib/pagination.js';

// ── Zod schemas ───────────────────────────────────────────────────────────────

export const ListAuditQuery = z.object({
  actorId:      z.string().optional(),
  resourceType: z.string().optional(),
  resourceId:   z.string().optional(),
  action: z
    .enum(['CREATE', 'UPDATE', 'SOFT_DELETE', 'ROLE_CHANGE', 'LOGIN', 'LOGOUT'])
    .optional(),
  from:  z.coerce.date().optional(),
  to:    z.coerce.date().optional(),
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

// ── Handlers ─────────────────────────────────────────────────────────────────

export async function listAuditLogs(
  request: FastifyRequest<{ Querystring: z.infer<typeof ListAuditQuery> }>,
  reply: FastifyReply,
) {
  const { actorId, resourceType, resourceId, action, from, to, page, limit } =
    request.query;
  const { skip, take } = toPrismaPagination({ page, limit });

  const where = {
    ...(actorId      && { actorId }),
    ...(resourceType && { resourceType }),
    ...(resourceId   && { resourceId }),
    ...(action       && { action: action as AuditAction }),
    ...((from || to) && {
      createdAt: {
        ...(from && { gte: from }),
        ...(to   && { lte: to   }),
      },
    }),
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        actor: { select: { email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return reply.status(200).send(paginate(logs, total, { page, limit }));
}
