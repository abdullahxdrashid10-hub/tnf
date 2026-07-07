// server/src/lib/audit.ts
// ─────────────────────────────────────────────────────────────────────────────
// Audit log helpers.
//
// serializeForAudit() MUST be used before writing any Prisma model record
// into AuditLog.previousJson / nextJson. Prisma's Decimal type is not
// JSON-serializable — this strips it to a plain string.
// ─────────────────────────────────────────────────────────────────────────────
import { prisma } from '../plugins/db.js';
import type { AuditAction } from '@prisma/client';

/**
 * Coerces Prisma Decimal, Date, and other non-plain types to JSON-safe values.
 *
 * - Decimal → string  (e.g. Decimal("24.99") → "24.99")
 * - Date    → ISO string
 * - undefined fields  → stripped
 *
 * Use on ANY model with Decimal columns (Product, OrderItem) before
 * passing a snapshot to auditLog.create.
 */
export function serializeForAudit<T>(record: T): T {
  return JSON.parse(JSON.stringify(record)) as T;
}

/**
 * Writes an audit log entry outside of a transaction.
 *
 * For transactional writes (e.g. soft-delete + audit in one $transaction),
 * use prisma.auditLog.create directly inside the $transaction array, with
 * serializeForAudit() applied to the snapshot before passing it in.
 */
export async function writeAuditLog(params: {
  actorId:       string;
  action:        AuditAction;
  resourceType:  string;
  resourceId:    string;
  previousData?: unknown;
  nextData?:     unknown;
  ip?:           string;
}) {
  return prisma.auditLog.create({
    data: {
      actorId:      params.actorId,
      action:       params.action,
      resourceType: params.resourceType,
      resourceId:   params.resourceId,
      previousJson: params.previousData
        ? (serializeForAudit(params.previousData) as object)
        : undefined,
      nextJson: params.nextData
        ? (serializeForAudit(params.nextData) as object)
        : undefined,
      ip: params.ip,
    },
  });
}
