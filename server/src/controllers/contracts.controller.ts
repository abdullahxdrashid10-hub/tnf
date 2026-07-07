// server/src/controllers/contracts.controller.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import type { ContractStatus } from '@prisma/client';
import { prisma } from '../plugins/db.js';
import { serializeForAudit } from '../lib/audit.js';
import { nextContractDisplayId } from '../lib/ids.js';
import { toPrismaPagination, paginate } from '../lib/pagination.js';
import { NotFoundError } from '../lib/errors.js';

// ── Zod schemas ───────────────────────────────────────────────────────────────

export const ListContractsQuery = z.object({
  status: z
    .enum(['RFQ_RECEIVED', 'COSTING', 'APPROVED', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED'])
    .optional(),
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export const CreateContractBody = z.object({
  companyName:    z.string().min(1).max(200),
  repEmail:       z.string().email(),
  deliveryWindow: z.string().min(1).max(200),
  unitCount:      z.number().int().positive(),
  specsRaw:       z.string().min(1),
});

export const UpdateContractBody = CreateContractBody.partial().extend({
  status: z
    .enum(['RFQ_RECEIVED', 'COSTING', 'APPROVED', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED'])
    .optional(),
});

export const ContractIdParam = z.object({ id: z.string().min(1) });

// ── Handlers ─────────────────────────────────────────────────────────────────

export async function listContracts(
  request: FastifyRequest<{ Querystring: z.infer<typeof ListContractsQuery> }>,
  reply: FastifyReply,
) {
  const { status, page, limit } = request.query;
  const { skip, take } = toPrismaPagination({ page, limit });

  const where = {
    isActive: true,
    ...(status && { status: status as ContractStatus }),
  };

  const [contracts, total] = await Promise.all([
    prisma.contract.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.contract.count({ where }),
  ]);

  return reply.status(200).send(paginate(contracts, total, { page, limit }));
}

export async function getContract(
  request: FastifyRequest<{ Params: z.infer<typeof ContractIdParam> }>,
  reply: FastifyReply,
) {
  const contract = await prisma.contract.findFirst({
    where: {
      isActive: true,
      OR: [
        { id:        request.params.id },
        { displayId: request.params.id },
      ],
    },
  });
  if (!contract) throw new NotFoundError('Contract');
  return reply.status(200).send(contract);
}

export async function createContract(
  request: FastifyRequest<{ Body: z.infer<typeof CreateContractBody> }>,
  reply: FastifyReply,
) {
  const displayId = await nextContractDisplayId();

  const contract = await prisma.contract.create({
    data: { displayId, ...request.body },
  });

  return reply.status(201).send(contract);
}

export async function updateContract(
  request: FastifyRequest<{
    Params: z.infer<typeof ContractIdParam>;
    Body:   z.infer<typeof UpdateContractBody>;
  }>,
  reply: FastifyReply,
) {
  const existing = await prisma.contract.findFirst({
    where: {
      isActive: true,
      OR: [
        { id:        request.params.id },
        { displayId: request.params.id },
      ],
    },
  });
  if (!existing) throw new NotFoundError('Contract');

  const updated = await prisma.contract.update({
    where: { id: existing.id },
    data:  request.body as Partial<typeof existing>,
  });

  return reply.status(200).send(updated);
}

export async function deactivateContract(
  request: FastifyRequest<{ Params: z.infer<typeof ContractIdParam> }>,
  reply: FastifyReply,
) {
  const contract = await prisma.contract.findFirst({
    where: {
      isActive: true,
      OR: [
        { id:        request.params.id },
        { displayId: request.params.id },
      ],
    },
  });
  if (!contract) throw new NotFoundError('Contract');

  const contractSnapshot = serializeForAudit(contract);

  await prisma.$transaction([
    prisma.contract.update({
      where: { id: contract.id },
      data:  { isActive: false },
    }),
    prisma.auditLog.create({
      data: {
        actorId:      request.user.sub,
        action:       'SOFT_DELETE',
        resourceType: 'Contract',
        resourceId:   contract.id,
        previousJson: contractSnapshot,
        nextJson:     null,
        ip:           request.ip,
      },
    }),
  ]);

  return reply.status(200).send({ ok: true, id: contract.displayId });
}
