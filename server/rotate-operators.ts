import readline from 'readline';
import { Writable } from 'stream';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from './src/lib/password.js';

class MutedWritable extends Writable {
  muted: boolean = false;
  override _write(chunk: any, encoding: string, callback: () => void) {
    if (!this.muted) {
      process.stdout.write(chunk, encoding);
    }
    callback();
  }
}

const mutableStdout = new MutedWritable();

const rl = readline.createInterface({
  input: process.stdin,
  output: mutableStdout,
  terminal: true
});

function askHidden(query: string): Promise<string> {
  return new Promise((resolve) => {
    console.log(query);
    mutableStdout.muted = true;
    rl.question('', (answer) => {
      mutableStdout.muted = false;
      resolve(answer);
    });
  });
}

async function rotateUser(prisma: PrismaClient, email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.warn(`[WARNING] User ${email} not found in database. Skipping.`);
    return;
  }

  console.log(`\n=== Rotating Credentials for: ${email} ===`);
  const pass1 = await askHidden(`Enter NEW secure password for ${email}:`);
  const pass2 = await askHidden(`Confirm NEW secure password:`);

  if (pass1 !== pass2) {
    throw new Error('Passwords do not match!');
  }

  if (pass1.trim().length < 8) {
    throw new Error('Password must be at least 8 characters long!');
  }

  console.log('Hashing password...');
  const newHash = await hashPassword(pass1);

  console.log('Updating database record...');
  await prisma.user.update({
    where: { email },
    data: { passwordHash: newHash }
  });

  console.log(`✓ Password successfully rotated for ${email}`);
}

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('================================================');
    console.log(' GTM PRODUCTION OPERATOR PASSWORD ROTATION TOOL');
    console.log('================================================');

    await rotateUser(prisma, 'aman@gtm-admin.com');
    await rotateUser(prisma, 'yazir@gtm-admin.com');

    console.log('\n✅ All operator rotations successfully finished.');
  } catch (err: any) {
    console.error('\n❌ Rotation aborted:', err.message);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

main();
