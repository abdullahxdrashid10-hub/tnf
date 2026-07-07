// server/src/lib/ids.ts
// ─────────────────────────────────────────────────────────────────────────────
// Atomic display ID generation via Postgres sequences.
// nextval() is serialized by Postgres — concurrent requests get distinct values.
// ─────────────────────────────────────────────────────────────────────────────
import { prisma } from '../plugins/db.js';

export async function nextOrderDisplayId(): Promise<string> {
  const result = await prisma.$queryRaw<[{ nextval: bigint }]>`
    SELECT nextval('order_display_seq')
  `;
  const seq = Number(result[0].nextval);
  return `ORD-${String(seq).padStart(4, '0')}`; // "ORD-0092", "ORD-0093" …
}

export async function nextContractDisplayId(): Promise<string> {
  const result = await prisma.$queryRaw<[{ nextval: bigint }]>`
    SELECT nextval('contract_display_seq')
  `;
  return `RFQ-${result[0].nextval}`; // "RFQ-192042" …
}
