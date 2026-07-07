// server/src/config.ts
// ─────────────────────────────────────────────────────────────────────────────
// Validated environment configuration — fails loudly on startup if any
// required variable is missing or malformed. Never access process.env directly
// outside this file.
// ─────────────────────────────────────────────────────────────────────────────
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL:        z.string().url('DATABASE_URL must be a valid postgres:// URL'),
  PORT:                z.coerce.number().int().min(1).max(65535).default(3001),
  NODE_ENV:            z.enum(['development', 'production']).default('development'),
  FRONTEND_ORIGIN:     z.string().url('FRONTEND_ORIGIN must be a valid URL with no trailing slash'),
  JWT_SECRET:          z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRES:  z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
  COOKIE_SECRET:       z.string().min(32, 'COOKIE_SECRET must be at least 32 characters'),
  REDIS_URL:           z.string().url().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌  Invalid environment variables:\n');
  parsed.error.issues.forEach((issue) => {
    console.error(`  ${issue.path.join('.')} — ${issue.message}`);
  });
  process.exit(1);
}

export const config = parsed.data;

// ── Derived values (never set these in .env) ─────────────────────────────────

/** 'none' in production (cross-origin HTTPS); 'lax' in development */
export const cookieSameSite =
  config.NODE_ENV === 'production' ? ('none' as const) : ('lax' as const);

/** true in production — SameSite=None requires Secure */
export const cookieSecure = config.NODE_ENV === 'production';

export const isProd = config.NODE_ENV === 'production';
