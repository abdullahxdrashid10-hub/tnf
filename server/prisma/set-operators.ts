// prisma/set-operators.ts
// Run once with: npx tsx --env-file=.env prisma/set-operators.ts
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password.js';

const prisma = new PrismaClient();

const OPERATORS = [
  { email: 'aman@gtm-admin.com',  name: 'Aman'  },
  { email: 'yazir@gtm-admin.com', name: 'Yazir' },
];

const SHARED_PASSWORD = 'gtmadmin-2026';

async function main() {
  console.log('🔐 Setting operator credentials...\n');
  const hash = await hashPassword(SHARED_PASSWORD);

  for (const op of OPERATORS) {
    await prisma.user.upsert({
      where:  { email: op.email },
      update: { passwordHash: hash, role: 'SUPER_ADMIN', isActive: true },
      create: { email: op.email, passwordHash: hash, role: 'SUPER_ADMIN' },
    });
    console.log(`  ✓ ${op.name} → ${op.email}`);
  }

  console.log('\n✅ Done! Both operators can now log in with password: gtmadmin-2026');
}

main()
  .catch((e) => { console.error('❌ Failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
