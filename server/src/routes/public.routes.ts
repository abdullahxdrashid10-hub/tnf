// server/src/routes/public.routes.ts
// ─────────────────────────────────────────────────────────────────────────────
// Public (unauthenticated) API endpoints consumed by the buyer-facing storefront.
//
//   GET  /api/public/products   → active product catalogue with colours
//   POST /api/public/quote      → buyer submits cart → PENDING RetailOrder in DB
// ─────────────────────────────────────────────────────────────────────────────
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z }                          from 'zod';
import { prisma }                     from '../plugins/db.js';
import { nextOrderDisplayId }         from '../lib/ids.js';
import { BadRequestError }            from '../lib/errors.js';
import { sendOrderReceiptEmail }      from '../lib/email.js';
import { quoteLimit }                 from '../plugins/rateLimit.js';

const publicRoutes: FastifyPluginAsyncZod = async (fastify) => {

  // ── GET /api/public/products ───────────────────────────────────────────────
  // No auth required. Returns all active products with colours.
  // Consumers: CollectionPage.jsx, MaterialPage.jsx
  fastify.get('/products', async (_request, reply) => {
    const products = await prisma.product.findMany({
      where:   { isActive: true },
      select: {
        id:             true,
        name:           true,
        category:       true,
        subCategory:    true,
        priceUsd:       true,
        localImageName: true,
        imageUrl:       true,
        colors:         { select: { colorName: true }, orderBy: { id: 'asc' } },
      },
      orderBy: { id: 'asc' }, // stable order matches seed / CatalogData.js order
    });

    return reply.status(200).send({ data: products, total: products.length });
  });

  // ── POST /api/public/quote ─────────────────────────────────────────────────
  // No auth required. Accepts the buyer's cart and creates a PENDING order.
  // The admin sees the order immediately in the Retail Sales Log.
  const QuoteBody = z.object({
    companyName:    z.string().min(1).max(200),
    fullName:       z.string().min(1).max(200),   // representative's name
    email:          z.string().email(),
    phone:          z.string().optional(),
    deliveryWindow: z.string().optional(),
    items: z
      .array(
        z.object({
          productId: z.number().int().positive(),
          colorName: z.string().min(1),
          qty:       z.number().int().positive(),
        }),
      )
      .min(1, 'Quote must contain at least one item'),
  });

  fastify.post<{ Body: z.infer<typeof QuoteBody> }>(
    '/quote',
    {
      schema: { body: QuoteBody },
      ...quoteLimit, // rate limiter applied directly
    },
    async (request, reply) => {
      const { companyName, fullName, email, phone, deliveryWindow, items } = request.body;

      // Verify every product exists + is still active; capture live unit prices and names
      const productIds = [...new Set(items.map((i) => i.productId))];

      const products = await prisma.product.findMany({
        where:  { id: { in: productIds }, isActive: true },
        select: { id: true, priceUsd: true, name: true },
      });

      if (products.length !== productIds.length) {
        throw new BadRequestError(
          'One or more selected products are no longer available',
        );
      }

      const priceMap = new Map(products.map((p) => [p.id, p.priceUsd]));
      const nameMap  = new Map(products.map((p) => [p.id, p.name]));

      // Upsert client by email — if they've ordered before, update their name/company
      const client = await prisma.client.upsert({
        where:  { email },
        create: {
          fullName,
          companyName,
          email,
          phone: phone ?? null,
        },
        update: {
          fullName,
          companyName,
          phone: phone ?? undefined,
        },
      });

      // Generate the next sequential display ID and create the order atomically
      const displayId = await nextOrderDisplayId();

      const order = await prisma.retailOrder.create({
        data: {
          displayId,
          clientId:      client.id,
          status:        'PENDING',
          deliveryWindow: deliveryWindow ?? null,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              colorName: item.colorName, // matches new colorName column
              qty:       item.qty,
              unitPrice: priceMap.get(item.productId) ?? null,
            })),
          },
        },
      });

      // Fire-and-forget receipt email dispatch with resolved product names and colors
      sendOrderReceiptEmail({
        displayId:      order.displayId,
        deliveryWindow: order.deliveryWindow,
        client: {
          name:        client.fullName,
          companyName: client.companyName,
          email:       client.email,
        },
        items: items.map((it) => ({
          productId: it.productId,
          name:      nameMap.get(it.productId) || 'Unknown Product',
          colorName: it.colorName,
          qty:       it.qty,
        })),
      }).catch((err) => console.error('Receipt email trigger failed:', err));

      // Return the confirmed order ID and a human-readable tracking reference
      return reply.status(201).send({
        orderId:        order.displayId,
        trackingNumber: order.displayId,
        message:        'Quote request received. Our team will be in touch within 24 hours.',
      });
    },
  );
};

export default publicRoutes;
