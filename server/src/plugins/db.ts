// server/src/plugins/db.ts
// ─────────────────────────────────────────────────────────────────────────────
// Prisma client singleton. Import { prisma } everywhere — never instantiate
// PrismaClient directly in controllers or routes.
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env['NODE_ENV'] === 'development'
        ? ['query', 'warn', 'error']
        : ['warn', 'error'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}
