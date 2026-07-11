// server/src/controllers/products.controller.ts
import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import { Prisma, type ProductCategory } from '@prisma/client';
import { prisma } from '../plugins/db.js';
import { serializeForAudit, writeAuditLog } from '../lib/audit.js';
import { toPrismaPagination, paginate } from '../lib/pagination.js';
import { NotFoundError } from '../lib/errors.js';
import type { ZodRequest } from '../lib/fastifyTypes.js';

type ProductListItem = Prisma.ProductGetPayload<{
  include: { colors: { select: { colorName: true } } };
}>;

// ── Zod schemas ───────────────────────────────────────────────────────────────

export const ListProductsQuery = z.object({
  category: z.enum(['APPAREL', 'UNIFORM_WORKWEAR', 'SPORTSWEAR']).optional(),
  search:   z.string().optional(),
  page:     z.coerce.number().int().min(1).default(1),
  limit:    z.coerce.number().int().min(1).max(100).default(25),
});

export const CreateProductBody = z.object({
  name:          z.string().min(1).max(200),
  category:      z.enum(['APPAREL', 'UNIFORM_WORKWEAR', 'SPORTSWEAR']),
  subCategory:   z.string().min(1).max(100),
  priceUsd:      z.number().positive().multipleOf(0.01),
  imageUrl:      z.string().url().optional(),
  localImageName:z.string().optional(),
  colors:        z.array(z.string().min(1)).default([]),
});

export const UpdateProductBody = CreateProductBody.partial();

export const ProductIdParam = z.object({
  id: z.coerce.number().int().positive(),
});

// ── Handlers ─────────────────────────────────────────────────────────────────

export async function listProducts(
  request: ZodRequest<{ Querystring: z.infer<typeof ListProductsQuery> }>,
  reply: FastifyReply,
) {
  const { category, search, page, limit } = request.query;
  const { skip, take } = toPrismaPagination({ page, limit });

  let products: ProductListItem[];
  let total: number;

  if (search) {
    // pg_trgm ILIKE — uses GIN indexes, NOT a sequential scan
    const pattern = `%${search}%`;
    products = await prisma.$queryRaw<ProductListItem[]>`
      SELECT p.*, COALESCE(
        json_agg(pc."colorName") FILTER (WHERE pc.id IS NOT NULL), '[]'
      ) as colors
      FROM "Product" p
      LEFT JOIN "ProductColor" pc ON pc."productId" = p.id
      WHERE p."isActive" = true
        AND (
          p."name"        ILIKE ${pattern}
          OR p."subCategory" ILIKE ${pattern}
        )
        ${category ? Prisma.sql`AND p."category" = ${category}::"ProductCategory"` : Prisma.empty}
      GROUP BY p.id
      ORDER BY p."name" ASC
      LIMIT ${take} OFFSET ${skip}
    `;
    const countResult = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM "Product"
      WHERE "isActive" = true
        AND ("name" ILIKE ${pattern} OR "subCategory" ILIKE ${pattern})
        ${category ? Prisma.sql`AND "category" = ${category}::"ProductCategory"` : Prisma.empty}
    `;
    total = Number(countResult[0].count);
  } else {
    // Standard Prisma client for non-search queries (fully type-safe)
    [products, total] = await Promise.all([
      prisma.product.findMany({
        where:   { isActive: true, ...(category && { category: category as ProductCategory }) },
        include: { colors: { select: { colorName: true } } },
        orderBy: { name: 'asc' },
        skip,
        take,
      }),
      prisma.product.count({
        where: { isActive: true, ...(category && { category: category as ProductCategory }) },
      }),
    ]);
  }

  return reply.status(200).send(paginate(products, total, { page, limit }));
}

export async function getProduct(
  request: ZodRequest<{ Params: z.infer<typeof ProductIdParam> }>,
  reply: FastifyReply,
) {
  const product = await prisma.product.findFirst({
    where:   { id: request.params.id, isActive: true },
    include: { colors: { select: { colorName: true } } },
  });
  if (!product) throw new NotFoundError('Product');
  return reply.status(200).send(product);
}

export async function createProduct(
  request: ZodRequest<{ Body: z.infer<typeof CreateProductBody> }>,
  reply: FastifyReply,
) {
  const { colors, priceUsd, ...rest } = request.body;

  const product = await prisma.product.create({
    data: {
      ...rest,
      priceUsd,
      colors: { create: colors.map((colorName) => ({ colorName })) },
    },
    include: { colors: { select: { colorName: true } } },
  });

  await writeAuditLog({
    actorId:      request.user.sub,
    action:       'CREATE',
    resourceType: 'Product',
    resourceId:   String(product.id),
    nextData:     product,
    ip:           request.ip,
  });

  return reply.status(201).send(product);
}

export async function updateProduct(
  request: ZodRequest<{
    Params: z.infer<typeof ProductIdParam>;
    Body:   z.infer<typeof UpdateProductBody>;
  }>,
  reply: FastifyReply,
) {
  const existing = await prisma.product.findFirst({
    where: { id: request.params.id, isActive: true },
  });
  if (!existing) throw new NotFoundError('Product');

  const { colors, priceUsd, ...rest } = request.body;
  const previousSnapshot = serializeForAudit(existing);

  const updated = await prisma.product.update({
    where: { id: request.params.id },
    data:  {
      ...rest,
      ...(priceUsd !== undefined && { priceUsd }),
      ...(colors !== undefined && {
        colors: {
          deleteMany: {},
          create: colors.map((colorName) => ({ colorName })),
        },
      }),
    },
    include: { colors: { select: { colorName: true } } },
  });

  await writeAuditLog({
    actorId:      request.user.sub,
    action:       'UPDATE',
    resourceType: 'Product',
    resourceId:   String(updated.id),
    previousData: previousSnapshot,
    nextData:     serializeForAudit(updated),
    ip:           request.ip,
  });

  return reply.status(200).send(updated);
}

export async function deactivateProduct(
  request: ZodRequest<{ Params: z.infer<typeof ProductIdParam> }>,
  reply: FastifyReply,
) {
  const product = await prisma.product.findFirst({
    where: { id: request.params.id, isActive: true },
  });
  if (!product) throw new NotFoundError('Product');

  // FIX: serializeForAudit() coerces Prisma Decimal → string before JSON storage
  const productSnapshot = serializeForAudit(product);

  // Atomic: soft-delete + audit log in a single transaction
  await prisma.$transaction([
    prisma.product.update({
      where: { id: product.id },
      data:  { isActive: false },
    }),
    prisma.auditLog.create({
      data: {
        actorId:      request.user.sub,
        action:       'SOFT_DELETE',
        resourceType: 'Product',
        resourceId:   String(product.id),
        previousJson: productSnapshot,
        nextJson:     Prisma.JsonNull,
        ip:           request.ip,
      },
    }),
  ]);

  return reply.status(200).send({ ok: true, id: product.id });
}
