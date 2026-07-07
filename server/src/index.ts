// server/src/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// GTM Back-Office API — Fastify server entry point
// Registers all plugins, routes, and the global error handler.
// ─────────────────────────────────────────────────────────────────────────────
import Fastify from 'fastify';
import type { FastifyError } from 'fastify';
import { ZodError } from 'zod';
import { config } from './config.js';
import { HttpError } from './lib/errors.js';

// ── Plugins ───────────────────────────────────────────────────────────────────
import validatePlugin  from './plugins/validate.js';
import corsPlugin      from './plugins/cors.js';
import authPlugin      from './plugins/auth.js';
import rateLimitPlugin from './plugins/rateLimit.js';

// ── Routes ────────────────────────────────────────────────────────────────────
import authRoutes      from './routes/auth.routes.js';
import productRoutes   from './routes/products.routes.js';
import orderRoutes     from './routes/orders.routes.js';
import contractRoutes  from './routes/contracts.routes.js';
import auditRoutes     from './routes/audit.routes.js';
import statsRoutes     from './routes/stats.routes.js';

// ── Build ─────────────────────────────────────────────────────────────────────

export async function build() {
  const fastify = Fastify({
    logger: {
      level: config.NODE_ENV === 'production' ? 'warn' : 'info',
      transport:
        config.NODE_ENV === 'development'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
  });

  // ── Plugin registration order matters ──────────────────────────────────────
  // 1. Validate (must be before any route that uses zod schemas)
  await fastify.register(validatePlugin);

  // 2. CORS (must be before auth so preflight OPTIONS requests pass through)
  await fastify.register(corsPlugin);

  // 3. Auth (@fastify/jwt + @fastify/cookie)
  await fastify.register(authPlugin);

  // 4. Rate limiting (global default + per-route overrides in route files)
  await fastify.register(rateLimitPlugin);

  // ── Routes under /api prefix ────────────────────────────────────────────────
  await fastify.register(authRoutes,     { prefix: '/api/auth'      });
  await fastify.register(productRoutes,  { prefix: '/api/products'  });
  await fastify.register(orderRoutes,    { prefix: '/api/orders'    });
  await fastify.register(contractRoutes, { prefix: '/api/contracts' });
  await fastify.register(auditRoutes,    { prefix: '/api/audit'     });
  await fastify.register(statsRoutes,    { prefix: '/api/stats'     });

  // ── Health check ────────────────────────────────────────────────────────────
  fastify.get('/health', async () => ({
    status:  'ok',
    version: '1.0.0',
    env:     config.NODE_ENV,
  }));

  // ── Global error handler ─────────────────────────────────────────────────────
  fastify.setErrorHandler(
    (error: FastifyError | HttpError | ZodError, _request, reply) => {
      // 1. Our typed HttpError classes (NotFoundError, UnauthorizedError, etc.)
      if (error instanceof HttpError) {
        return reply.status(error.statusCode).send({
          error:   error.code,
          message: error.message,
        });
      }

      // 2. Zod validation errors (request body / query schema failures)
      if (error instanceof ZodError) {
        return reply.status(400).send({
          error:   'VALIDATION_ERROR',
          message: 'Request validation failed',
          issues:  error.issues.map((i) => ({
            field:   i.path.join('.'),
            message: i.message,
          })),
        });
      }

      // 3. @fastify/rate-limit — already has statusCode 429 set
      if ('statusCode' in error && error.statusCode === 429) {
        return reply.status(429).send({
          error:   'TOO_MANY_REQUESTS',
          message: error.message,
        });
      }

      // 4. Fastify built-in errors (404 route not found, 405 method not allowed…)
      if ('statusCode' in error && error.statusCode) {
        return reply.status(error.statusCode).send({
          error:   'HTTP_ERROR',
          message: error.message,
        });
      }

      // 5. Unexpected errors — log and return generic 500
      fastify.log.error(error);
      return reply.status(500).send({
        error:   'INTERNAL_SERVER_ERROR',
        message:
          config.NODE_ENV === 'development'
            ? error.message
            : 'An unexpected error occurred',
      });
    },
  );

  return fastify;
}

// ── Start ─────────────────────────────────────────────────────────────────────

async function start() {
  const fastify = await build();

  try {
    await fastify.listen({ port: config.PORT, host: '0.0.0.0' });
    console.log(`\n🚀 GTM API running on port ${config.PORT} (${config.NODE_ENV})`);
    console.log(`   Health: http://localhost:${config.PORT}/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'] as const;
signals.forEach((signal) => {
  process.once(signal, async () => {
    const fastify = await build();
    await fastify.close();
    console.log(`\n✓ Server shut down gracefully on ${signal}`);
    process.exit(0);
  });
});

start();
