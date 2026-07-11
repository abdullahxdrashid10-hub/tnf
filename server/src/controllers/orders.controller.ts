// server/src/controllers/orders.controller.ts
import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import type { OrderStatus } from '@prisma/client';
import { prisma } from '../plugins/db.js';
import { nextOrderDisplayId } from '../lib/ids.js';
import { toPrismaPagination, paginate } from '../lib/pagination.js';
import { NotFoundError, BadRequestError } from '../lib/errors.js';
import type { ZodRequest } from '../lib/fastifyTypes.js';
import { sendOrderStatusUpdateEmail } from '../lib/email.js';

// ── Zod schemas (exported — consumed by orders.routes.ts) ────────────────────

export const ListOrdersQuery = z.object({
  status:   z.enum(['PENDING', 'PROCESSING', 'DISPATCHED', 'CANCELLED']).optional(),
  clientId: z.string().optional(),
  from:     z.coerce.date().optional(),
  to:       z.coerce.date().optional(),
  page:     z.coerce.number().int().min(1).default(1),
  limit:    z.coerce.number().int().min(1).max(100).default(25),
});

export const CreateOrderBody = z.object({
  clientId: z.string().min(1),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        qty:       z.number().int().positive(),
      }),
    )
    .min(1),
});

export const UpdateOrderStatusBody = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'DISPATCHED', 'CANCELLED']),
});

export const OrderIdParam = z.object({ id: z.string().min(1) });

// ── Prisma include shape (reused in all handlers) ─────────────────────────────
const ORDER_INCLUDE = {
  client: { select: { fullName: true, companyName: true, email: true, phone: true } },
  items:  { select: { qty: true, productId: true, unitPrice: true } },
} as const;

// ── Response shaping ──────────────────────────────────────────────────────────
// totalQty computed here via reduce — no denormalised column on RetailOrder.
// Prisma issues exactly 2 SQL statements for ORDER_INCLUDE, not N+1.
type RawOrder = Awaited<ReturnType<typeof prisma.retailOrder.findFirstOrThrow>> & {
  client: { fullName: string; companyName: string | null; email: string; phone: string | null };
  items:  { qty: number; productId: number; unitPrice: { toString(): string } }[];
};

// Shape order for API response — matches what AdminPanel.jsx reads:
// order.displayId, order.client?.{name,email,phone}, order.items?.reduce()
function shapeOrder(order: RawOrder) {
  return {
    id:            order.displayId,          // used as React key
    displayId:     order.displayId,          // rendered directly in order row
    internalId:    order.id,
    client: {
      name:        order.client.fullName,    // order.client?.name
      companyName: order.client.companyName, // bonus info
      email:       order.client.email,       // order.client?.email
      phone:       order.client.phone,       // order.client?.phone
    },
    items:     order.items,                  // order.items?.reduce((acc, it) => acc + it.qty, 0)
    qty:       order.items.reduce((sum, item) => sum + item.qty, 0), // backward-compat
    status:    order.status,
    placedAt:  order.placedAt,
    updatedAt: order.updatedAt,
  };
}

// ── Handlers ─────────────────────────────────────────────────────────────────

export async function listOrders(
  request: ZodRequest<{ Querystring: z.infer<typeof ListOrdersQuery> }>,
  reply: FastifyReply,
) {
  const { status, clientId, from, to, page, limit } = request.query;
  const { skip, take } = toPrismaPagination({ page, limit });

  const where = {
    ...(status   && { status: status as OrderStatus }),
    ...(clientId && { clientId }),
    ...((from || to) && {
      placedAt: {
        ...(from && { gte: from }),
        ...(to   && { lte: to   }),
      },
    }),
  };

  const [raw, total] = await Promise.all([
    prisma.retailOrder.findMany({
      where,
      include: ORDER_INCLUDE,
      orderBy: { placedAt: 'desc' },
      skip,
      take,
    }),
    prisma.retailOrder.count({ where }),
  ]);

  return reply
    .status(200)
    .send(paginate(raw.map((o) => shapeOrder(o as RawOrder)), total, { page, limit }));
}

export async function getOrder(
  request: ZodRequest<{ Params: z.infer<typeof OrderIdParam> }>,
  reply: FastifyReply,
) {
  // Accept either the displayId ("ORD-0091") or the internal cuid PK
  const order = await prisma.retailOrder.findFirst({
    where: {
      OR: [
        { id:        request.params.id },
        { displayId: request.params.id },
      ],
    },
    include: ORDER_INCLUDE,
  });
  if (!order) throw new NotFoundError('Order');
  return reply.status(200).send(shapeOrder(order as RawOrder));
}

export async function createOrder(
  request: ZodRequest<{ Body: z.infer<typeof CreateOrderBody> }>,
  reply: FastifyReply,
) {
  const { clientId, items } = request.body;

  // Verify client exists
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) throw new NotFoundError('Client');

  // Verify all products exist, are active, and capture their current unit prices
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where:  { id: { in: productIds }, isActive: true },
    select: { id: true, priceUsd: true },
  });

  if (products.length !== productIds.length) {
    throw new BadRequestError(
      'One or more products not found or are no longer active',
    );
  }

  const priceMap = new Map(products.map((p) => [p.id, p.priceUsd]));

  // Atomic: generate displayId + create order in a single round-trip
  const displayId = await nextOrderDisplayId();

  const order = await prisma.retailOrder.create({
    data: {
      displayId,
      clientId,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          qty:       item.qty,
          unitPrice: priceMap.get(item.productId)!,
        })),
      },
    },
    include: ORDER_INCLUDE,
  });

  return reply.status(201).send(shapeOrder(order as RawOrder));
}

export async function updateOrderStatus(
  request: ZodRequest<{
    Params: z.infer<typeof OrderIdParam>;
    Body:   z.infer<typeof UpdateOrderStatusBody>;
  }>,
  reply: FastifyReply,
) {
  const existing = await prisma.retailOrder.findFirst({
    where: {
      OR: [
        { id:        request.params.id },
        { displayId: request.params.id },
      ],
    },
  });
  if (!existing) throw new NotFoundError('Order');

  const updated = await prisma.retailOrder.update({
    where:   { id: existing.id },
    data:    { status: request.body.status as OrderStatus },
    include: ORDER_INCLUDE,
  });

  const shaped = shapeOrder(updated as RawOrder);

  // Trigger fire-and-forget status update email
  sendOrderStatusUpdateEmail(shaped, request.body.status).catch((err) =>
    console.error('Status update email trigger failed:', err)
  );

  return reply.status(200).send(shaped);
}
