// server/src/index.ts
// GTM Back-Office API - Fastify server entry point.
// Registers plugins, routes, health check, and the global error handler.
import Fastify from 'fastify';
import type { FastifyError } from 'fastify';
import { ZodError } from 'zod';
import { config } from './config.js';
import { HttpError } from './lib/errors.js';

import validatePlugin  from './plugins/validate.js';
import corsPlugin      from './plugins/cors.js';
import authPlugin      from './plugins/auth.js';
import rateLimitPlugin from './plugins/rateLimit.js';

import authRoutes      from './routes/auth.routes.js';
import productRoutes   from './routes/products.routes.js';
import orderRoutes     from './routes/orders.routes.js';
import contractRoutes  from './routes/contracts.routes.js';
import auditRoutes     from './routes/audit.routes.js';
import statsRoutes     from './routes/stats.routes.js';
import publicRoutes    from './routes/public.routes.js';

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

  await fastify.register(validatePlugin);
  await fastify.register(corsPlugin);
  await fastify.register(authPlugin);
  await fastify.register(rateLimitPlugin);

  await fastify.register(authRoutes,     { prefix: '/api/auth'      });
  await fastify.register(publicRoutes,   { prefix: '/api/public'    }); // no auth — storefront
  await fastify.register(productRoutes,  { prefix: '/api/products'  });
  await fastify.register(orderRoutes,    { prefix: '/api/orders'    });
  await fastify.register(contractRoutes, { prefix: '/api/contracts' });
  await fastify.register(auditRoutes,    { prefix: '/api/audit'     });
  await fastify.register(statsRoutes,    { prefix: '/api/stats'     });

  fastify.get('/health', async () => ({
    status:  'ok',
    version: '1.0.0',
    env:     config.NODE_ENV,
  }));

  fastify.setErrorHandler(
    (error: FastifyError | HttpError | ZodError, _request, reply) => {
      if (error instanceof HttpError) {
        return reply.status(error.statusCode).send({
          error:   error.code,
          message: error.message,
        });
      }

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

      if ('statusCode' in error && error.statusCode === 429) {
        return reply.status(429).send({
          error:   'TOO_MANY_REQUESTS',
          message: error.message,
        });
      }

      if ('statusCode' in error && error.statusCode) {
        return reply.status(error.statusCode).send({
          error:   'HTTP_ERROR',
          message: error.message,
        });
      }

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

async function start() {
  const fastify = await build();

  const signals = ['SIGINT', 'SIGTERM'] as const;
  signals.forEach((signal) => {
    process.once(signal, async () => {
      await fastify.close();
      console.log(`\nServer shut down gracefully on ${signal}`);
      process.exit(0);
    });
  });

  try {
    await fastify.listen({ port: config.PORT, host: '0.0.0.0' });
    console.log(`\nGTM API running on port ${config.PORT} (${config.NODE_ENV})`);
    console.log(`Health: http://localhost:${config.PORT}/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
