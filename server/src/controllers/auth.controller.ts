// server/src/controllers/auth.controller.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../plugins/db.js';
import { verifyPassword, hashPassword } from '../lib/password.js';
import { writeAuditLog } from '../lib/audit.js';
import {
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} from '../lib/errors.js';
import { cookieSameSite, cookieSecure } from '../plugins/auth.js';
import { config } from '../config.js';

// ── Zod schemas (exported — imported by auth.routes.ts) ──────────────────────

export const LoginBody = z.object({
  email:    z.string().email(),
  password: z.string().min(8).max(128),
});

export const RegisterBody = z.object({
  email:    z.string().email(),
  password: z.string().min(8).max(128),
  role:     z.enum(['SUPER_ADMIN', 'OPERATOR', 'VIEWER']).default('OPERATOR'),
});

// ── Helpers ──────────────────────────────────────────────────────────────────

const REFRESH_COOKIE = 'gtm_refresh';

function setRefreshCookie(reply: FastifyReply, token: string) {
  reply.setCookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure:   cookieSecure,
    sameSite: cookieSameSite,
    path:     '/api/auth/refresh',
    maxAge:   60 * 60 * 24 * 7,  // 7 days in seconds
  });
}

function clearRefreshCookie(reply: FastifyReply) {
  reply.clearCookie(REFRESH_COOKIE, { path: '/api/auth/refresh' });
}

async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  return prisma.session.create({
    data: { userId, expiresAt },
  });
}

// ── Handlers ─────────────────────────────────────────────────────────────────

export async function login(
  request: FastifyRequest<{ Body: z.infer<typeof LoginBody> }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) throw new UnauthorizedError('Invalid credentials');

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new UnauthorizedError('Invalid credentials');

  // Issue access token (short-lived, in response body)
  const accessToken = await reply.jwtSign({ sub: user.id, role: user.role });

  // Issue refresh token (opaque session ID, in httpOnly cookie)
  const session = await createSession(user.id);
  setRefreshCookie(reply, session.id);

  await writeAuditLog({
    actorId:      user.id,
    action:       'LOGIN',
    resourceType: 'User',
    resourceId:   user.id,
    ip:           request.ip,
  });

  return reply.status(200).send({
    accessToken,
    user: { id: user.id, email: user.email, role: user.role },
  });
}

export async function refresh(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies['gtm_refresh'];
  if (!sessionId) throw new UnauthorizedError('No refresh token');

  const session = await prisma.session.findUnique({
    where:   { id: sessionId },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    clearRefreshCookie(reply);
    throw new UnauthorizedError('Refresh token expired or invalid');
  }

  if (!session.user.isActive) {
    clearRefreshCookie(reply);
    throw new UnauthorizedError('Account deactivated');
  }

  const accessToken = await reply.jwtSign({
    sub:  session.user.id,
    role: session.user.role,
  });

  return reply.status(200).send({ accessToken });
}

export async function logout(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies['gtm_refresh'];
  if (sessionId) {
    await prisma.session.deleteMany({ where: { id: sessionId } });
  }

  await writeAuditLog({
    actorId:      request.user.sub,
    action:       'LOGOUT',
    resourceType: 'User',
    resourceId:   request.user.sub,
    ip:           request.ip,
  });

  clearRefreshCookie(reply);
  return reply.status(200).send({ ok: true });
}

export async function me(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const user = await prisma.user.findUnique({
    where:  { id: request.user.sub },
    select: { id: true, email: true, role: true, createdAt: true },
  });
  if (!user) throw new NotFoundError('User');
  return reply.status(200).send(user);
}

// ── Admin: register a new operator (SUPER_ADMIN only) ────────────────────────

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Body cast is safe: Fastify+Zod validated the schema before this handler runs.
  // The .default('OPERATOR') transform has already been applied, so role is always defined.
  const { email, password, role } = request.body as z.infer<typeof RegisterBody>;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ConflictError(`User with email ${email} already exists`);

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, role },
    select: { id: true, email: true, role: true, createdAt: true },
  });

  await writeAuditLog({
    actorId:      request.user.sub,
    action:       'CREATE',
    resourceType: 'User',
    resourceId:   user.id,
    nextData:     { email: user.email, role: user.role },
    ip:           request.ip,
  });

  return reply.status(201).send(user);
}

// ── Nightly cron helper: prune expired sessions ───────────────────────────────
export async function pruneExpiredSessions() {
  const result = await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return result.count;
}
