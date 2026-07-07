// server/src/plugins/rateLimit.ts
import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

export default fp(async (fastify) => {
  await fastify.register(rateLimit, {
    global:     true,
    max:        200,              // generous global limit
    timeWindow: '1 minute',
    // Per-route overrides are applied directly in auth.routes.ts
  });
});

// ── Exported rate-limit configs for specific routes ──────────────────────────

/** Login: 5 attempts per IP per 15 minutes */
export const loginIpLimit = {
  config: {
    rateLimit: {
      max:        5,
      timeWindow: '15 minutes',
      keyGenerator: (req: { ip: string }) => `login:ip:${req.ip}`,
      errorResponseBuilder: () => ({
        statusCode: 429,
        error:      'TOO_MANY_REQUESTS',
        message:    'Too many login attempts from this IP. Try again in 15 minutes.',
      }),
    },
  },
};

/** Login: 3 attempts per email per 60 minutes — guards credential-stuffing */
export const loginEmailLimit = {
  config: {
    rateLimit: {
      max:        3,
      timeWindow: '1 hour',
      keyGenerator: (req: { body: unknown }) => {
        const body = req.body as { email?: string };
        return `login:email:${(body?.email ?? '').toLowerCase()}`;
      },
      errorResponseBuilder: () => ({
        statusCode: 429,
        error:      'ACCOUNT_TEMPORARILY_LOCKED',
        message:    'Too many login attempts for this account. Try again in 1 hour.',
      }),
    },
  },
};

/** Refresh: 20 per IP per 15 minutes */
export const refreshLimit = {
  config: {
    rateLimit: {
      max:        20,
      timeWindow: '15 minutes',
    },
  },
};
