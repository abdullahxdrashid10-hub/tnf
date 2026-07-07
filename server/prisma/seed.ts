// server/prisma/seed.ts
// ─────────────────────────────────────────────────────────────────────────────
// Seeds the GTM database from CatalogData.js + mock retail/contract data.
// Run with: npm run db:seed
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient, ProductCategory } from '@prisma/client';
import { hashPassword } from '../src/lib/password.js';

const prisma = new PrismaClient();

// ── Inline catalog data ───────────────────────────────────────────────────────
// Sourced from website/src/components/CatalogData.js
// Prices are stored as numbers (strip the "$" that the frontend uses)

type SeedProduct = {
  name:          string;
  category:      ProductCategory;
  subCategory:   string;
  priceUsd:      number;
  localImageName:string;
  colors:        string[];
};

const CATALOG: SeedProduct[] = [
  // ── APPAREL ──────────────────────────────────────────────────────────────
  { name: 'Classic Cotton Tee', category: 'APPAREL', subCategory: 'T-Shirts', priceUsd: 19.99, localImageName: 'classic-cotton-tee.jpg', colors: ['White', 'Black', 'Navy', 'Grey'] },
  { name: 'Premium Polo Shirt', category: 'APPAREL', subCategory: 'Polo Shirts', priceUsd: 34.99, localImageName: 'premium-polo.jpg', colors: ['White', 'Navy', 'Royal Blue', 'Black'] },
  { name: 'Slim Fit Dress Shirt', category: 'APPAREL', subCategory: 'Dress Shirts', priceUsd: 49.99, localImageName: 'slim-fit-dress-shirt.jpg', colors: ['White', 'Light Blue', 'Grey'] },
  { name: 'Casual Hoodie', category: 'APPAREL', subCategory: 'Hoodies', priceUsd: 44.99, localImageName: 'casual-hoodie.jpg', colors: ['Black', 'Grey', 'Navy', 'Burgundy'] },
  { name: 'Full Zip Sweatshirt', category: 'APPAREL', subCategory: 'Sweatshirts', priceUsd: 39.99, localImageName: 'full-zip-sweatshirt.jpg', colors: ['Black', 'Charcoal', 'Navy'] },
  { name: 'Graphic Print Tee', category: 'APPAREL', subCategory: 'T-Shirts', priceUsd: 24.99, localImageName: 'graphic-print-tee.jpg', colors: ['White', 'Black', 'Ash'] },
  { name: 'V-Neck Cotton Tee', category: 'APPAREL', subCategory: 'T-Shirts', priceUsd: 22.99, localImageName: 'v-neck-tee.jpg', colors: ['White', 'Black', 'Heather Grey'] },
  { name: 'Pique Polo', category: 'APPAREL', subCategory: 'Polo Shirts', priceUsd: 29.99, localImageName: 'pique-polo.jpg', colors: ['White', 'Black', 'Red', 'Navy'] },
  { name: 'Oxford Button-Down', category: 'APPAREL', subCategory: 'Dress Shirts', priceUsd: 54.99, localImageName: 'oxford-button-down.jpg', colors: ['White', 'Blue', 'Pink'] },
  { name: 'Pullover Hoodie', category: 'APPAREL', subCategory: 'Hoodies', priceUsd: 42.99, localImageName: 'pullover-hoodie.jpg', colors: ['Black', 'Grey', 'Navy', 'Forest Green'] },
  { name: 'Crew Neck Sweatshirt', category: 'APPAREL', subCategory: 'Sweatshirts', priceUsd: 37.99, localImageName: 'crew-neck-sweatshirt.jpg', colors: ['Charcoal', 'Navy', 'Maroon'] },
  { name: 'Long Sleeve Tee', category: 'APPAREL', subCategory: 'T-Shirts', priceUsd: 27.99, localImageName: 'long-sleeve-tee.jpg', colors: ['White', 'Black', 'Navy'] },
  { name: 'Performance Polo', category: 'APPAREL', subCategory: 'Polo Shirts', priceUsd: 39.99, localImageName: 'performance-polo.jpg', colors: ['White', 'Black', 'Royal'] },
  { name: 'Chambray Shirt', category: 'APPAREL', subCategory: 'Dress Shirts', priceUsd: 47.99, localImageName: 'chambray-shirt.jpg', colors: ['Blue', 'Grey'] },
  { name: 'Zip-Up Fleece Hoodie', category: 'APPAREL', subCategory: 'Hoodies', priceUsd: 52.99, localImageName: 'zip-fleece-hoodie.jpg', colors: ['Black', 'Navy', 'Dark Red'] },

  // ── UNIFORM & WORKWEAR ───────────────────────────────────────────────────
  { name: 'Industrial Work Shirt', category: 'UNIFORM_WORKWEAR', subCategory: 'Work Shirts', priceUsd: 44.99, localImageName: 'industrial-work-shirt.jpg', colors: ['Navy', 'Grey', 'Khaki'] },
  { name: 'Hi-Vis Safety Vest', category: 'UNIFORM_WORKWEAR', subCategory: 'Safety Wear', priceUsd: 24.99, localImageName: 'hi-vis-vest.jpg', colors: ['Yellow', 'Orange'] },
  { name: 'Cargo Work Pants', category: 'UNIFORM_WORKWEAR', subCategory: 'Work Pants', priceUsd: 59.99, localImageName: 'cargo-work-pants.jpg', colors: ['Navy', 'Khaki', 'Black'] },
  { name: 'Chef Coat', category: 'UNIFORM_WORKWEAR', subCategory: 'Chef Wear', priceUsd: 34.99, localImageName: 'chef-coat.jpg', colors: ['White', 'Black'] },
  { name: 'Mechanic Coverall', category: 'UNIFORM_WORKWEAR', subCategory: 'Coveralls', priceUsd: 79.99, localImageName: 'mechanic-coverall.jpg', colors: ['Navy', 'Grey', 'Dark Green'] },
  { name: 'Security Guard Shirt', category: 'UNIFORM_WORKWEAR', subCategory: 'Security Wear', priceUsd: 39.99, localImageName: 'security-shirt.jpg', colors: ['Black', 'Navy'] },
  { name: 'Hospitality Apron', category: 'UNIFORM_WORKWEAR', subCategory: 'Aprons', priceUsd: 19.99, localImageName: 'hospitality-apron.jpg', colors: ['Black', 'Navy', 'Burgundy'] },
  { name: 'Corporate Blazer', category: 'UNIFORM_WORKWEAR', subCategory: 'Blazers', priceUsd: 99.99, localImageName: 'corporate-blazer.jpg', colors: ['Black', 'Navy', 'Charcoal'] },
  { name: 'Flame Resistant Shirt', category: 'UNIFORM_WORKWEAR', subCategory: 'Safety Wear', priceUsd: 69.99, localImageName: 'fr-shirt.jpg', colors: ['Navy', 'Khaki'] },
  { name: 'Lab Coat', category: 'UNIFORM_WORKWEAR', subCategory: 'Medical Wear', priceUsd: 44.99, localImageName: 'lab-coat.jpg', colors: ['White'] },
  { name: 'Nursing Scrub Set', category: 'UNIFORM_WORKWEAR', subCategory: 'Medical Wear', priceUsd: 54.99, localImageName: 'nursing-scrub.jpg', colors: ['Navy', 'Ceil Blue', 'Wine', 'Black'] },
  { name: 'Reflective Work Jacket', category: 'UNIFORM_WORKWEAR', subCategory: 'Safety Wear', priceUsd: 89.99, localImageName: 'reflective-jacket.jpg', colors: ['Yellow', 'Orange'] },
  { name: 'Bib Apron', category: 'UNIFORM_WORKWEAR', subCategory: 'Aprons', priceUsd: 22.99, localImageName: 'bib-apron.jpg', colors: ['Black', 'Forest Green', 'Navy'] },
  { name: 'Polo Uniform Shirt', category: 'UNIFORM_WORKWEAR', subCategory: 'Work Shirts', priceUsd: 32.99, localImageName: 'polo-uniform.jpg', colors: ['Black', 'Navy', 'White', 'Royal Blue'] },
  { name: 'Barista Apron', category: 'UNIFORM_WORKWEAR', subCategory: 'Aprons', priceUsd: 27.99, localImageName: 'barista-apron.jpg', colors: ['Black', 'Khaki', 'Forest'] },

  // ── SPORTSWEAR ───────────────────────────────────────────────────────────
  { name: 'Dry-Fit Training Tee', category: 'SPORTSWEAR', subCategory: 'Training Tops', priceUsd: 29.99, localImageName: 'dry-fit-tee.jpg', colors: ['Black', 'White', 'Royal Blue', 'Red'] },
  { name: 'Compression Shorts', category: 'SPORTSWEAR', subCategory: 'Shorts', priceUsd: 34.99, localImageName: 'compression-shorts.jpg', colors: ['Black', 'Navy', 'Grey'] },
  { name: 'Track Jacket', category: 'SPORTSWEAR', subCategory: 'Jackets', priceUsd: 64.99, localImageName: 'track-jacket.jpg', colors: ['Black', 'Navy', 'Royal Blue', 'Red'] },
  { name: 'Football Jersey', category: 'SPORTSWEAR', subCategory: 'Team Jerseys', priceUsd: 49.99, localImageName: 'football-jersey.jpg', colors: ['White', 'Black', 'Red', 'Blue', 'Green'] },
  { name: 'Basketball Shorts', category: 'SPORTSWEAR', subCategory: 'Shorts', priceUsd: 27.99, localImageName: 'basketball-shorts.jpg', colors: ['Black', 'Navy', 'Red', 'White'] },
  { name: 'Running Tights', category: 'SPORTSWEAR', subCategory: 'Leggings', priceUsd: 44.99, localImageName: 'running-tights.jpg', colors: ['Black', 'Navy', 'Charcoal'] },
  { name: 'Cycling Jersey', category: 'SPORTSWEAR', subCategory: 'Cycling', priceUsd: 59.99, localImageName: 'cycling-jersey.jpg', colors: ['Black', 'White', 'Blue', 'Red'] },
  { name: 'Soccer Jersey', category: 'SPORTSWEAR', subCategory: 'Team Jerseys', priceUsd: 47.99, localImageName: 'soccer-jersey.jpg', colors: ['White', 'Black', 'Blue', 'Red', 'Green'] },
  { name: 'Athletic Polo', category: 'SPORTSWEAR', subCategory: 'Training Tops', priceUsd: 37.99, localImageName: 'athletic-polo.jpg', colors: ['White', 'Black', 'Royal Blue'] },
  { name: 'Sports Hoodie', category: 'SPORTSWEAR', subCategory: 'Hoodies', priceUsd: 54.99, localImageName: 'sports-hoodie.jpg', colors: ['Black', 'Grey', 'Navy', 'Red'] },
  { name: 'Gym Shorts', category: 'SPORTSWEAR', subCategory: 'Shorts', priceUsd: 24.99, localImageName: 'gym-shorts.jpg', colors: ['Black', 'Grey', 'Navy', 'Red'] },
  { name: 'Sublimation Jersey', category: 'SPORTSWEAR', subCategory: 'Team Jerseys', priceUsd: 54.99, localImageName: 'sublimation-jersey.jpg', colors: ['Custom'] },
  { name: 'Performance Leggings', category: 'SPORTSWEAR', subCategory: 'Leggings', priceUsd: 47.99, localImageName: 'performance-leggings.jpg', colors: ['Black', 'Charcoal', 'Navy'] },
  { name: 'Windbreaker Jacket', category: 'SPORTSWEAR', subCategory: 'Jackets', priceUsd: 74.99, localImageName: 'windbreaker.jpg', colors: ['Black', 'Navy', 'Red', 'Royal Blue'] },
  { name: 'Cricket Whites', category: 'SPORTSWEAR', subCategory: 'Cricket', priceUsd: 69.99, localImageName: 'cricket-whites.jpg', colors: ['White'] },
];

// ── Mock retail clients & orders ──────────────────────────────────────────────

const MOCK_CLIENTS = [
  { fullName: 'James Hartwell',    email: 'j.hartwell@mail.com',       phone: '+1 312 880 4421' },
  { fullName: 'Sarah Mitchell',    email: 's.mitchell@corp.com',        phone: '+1 415 920 3310' },
  { fullName: 'Omar Patel',        email: 'o.patel@business.net',       phone: '+971 50 123 4567' },
  { fullName: 'Lena Kaufmann',     email: 'l.kaufmann@enterprise.de',   phone: '+49 89 4567 8901' },
  { fullName: 'Carlos Reyes',      email: 'c.reyes@outlook.com',        phone: '+52 55 8765 4321' },
];

const MOCK_CONTRACTS = [
  {
    displayId:      'RFQ-192041',
    companyName:    'Axiom Logistics',
    repEmail:       'procurement@axiom.com',
    deliveryWindow: 'Q3 2025 (Jul–Sep)',
    unitCount:      500,
    specsRaw:       'Industrial work shirts, navy, logo embroidery on chest, sizes S–3XL',
    status:         'IN_PRODUCTION' as const,
  },
  {
    displayId:      'RFQ-188830',
    companyName:    'Crestline Hotels',
    repEmail:       'uniforms@crestline.com',
    deliveryWindow: 'Q2 2025 (Apr–Jun)',
    unitCount:      1200,
    specsRaw:       'Hospitality aprons + polo uniforms, burgundy & navy, staff name tags',
    status:         'APPROVED' as const,
  },
  {
    displayId:      'RFQ-141003',
    companyName:    'Global FC Academy',
    repEmail:       'kit@globalfc.ae',
    deliveryWindow: 'Aug 2025',
    unitCount:      300,
    specsRaw:       'Sublimation football jerseys, club colours, player numbers 1–25',
    status:         'COSTING' as const,
  },
];

// ── syncSequences — self-corrects after all rows are inserted ─────────────────

async function syncSequences() {
  const maxOrder = await prisma.retailOrder.findFirst({
    orderBy: { displayId: 'desc' },
    select:  { displayId: true },
  });
  const maxOrderNum = maxOrder
    ? parseInt(maxOrder.displayId.replace('ORD-', ''), 10)
    : 0;

  const maxContract = await prisma.contract.findFirst({
    orderBy: { displayId: 'desc' },
    select:  { displayId: true },
  });
  const maxContractNum = maxContract
    ? parseInt(maxContract.displayId.replace('RFQ-', ''), 10)
    : 0;

  // setval(..., value, false) → next nextval() returns exactly `value`
  await prisma.$executeRawUnsafe(
    `SELECT setval('order_display_seq', ${maxOrderNum + 1}, false)`,
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval('contract_display_seq', ${maxContractNum + 1}, false)`,
  );

  console.log(
    `✓ Sequences synced — next order: ORD-${String(maxOrderNum + 1).padStart(4, '0')} · next contract: RFQ-${maxContractNum + 1}`,
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting GTM seed...');

  // 1 — Seed products
  console.log(`  Seeding ${CATALOG.length} products...`);
  for (const p of CATALOG) {
    const { colors, ...productData } = p;
    await prisma.product.upsert({
      where:  { sku: `seed-${p.localImageName}` },
      create: {
        sku:  `seed-${p.localImageName}`,
        ...productData,
        colors: { create: colors.map((colorName) => ({ colorName })) },
      },
      update: {
        ...productData,
        colors: {
          deleteMany: {},
          create: colors.map((colorName) => ({ colorName })),
        },
      },
    });
  }
  console.log('  ✓ Products seeded');

  // 2 — Seed clients
  console.log('  Seeding clients...');
  for (const c of MOCK_CLIENTS) {
    await prisma.client.upsert({
      where:  { email: c.email },
      create: c,
      update: c,
    });
  }
  console.log('  ✓ Clients seeded');

  // 3 — Seed a sample order (ORD-0091) tied to first client
  const firstClient = await prisma.client.findFirst({
    where: { email: MOCK_CLIENTS[0]!.email },
  });
  const firstProduct = await prisma.product.findFirst({
    where: { isActive: true },
  });

  if (firstClient && firstProduct) {
    const existingOrder = await prisma.retailOrder.findUnique({
      where: { displayId: 'ORD-0091' },
    });
    if (!existingOrder) {
      await prisma.retailOrder.create({
        data: {
          displayId: 'ORD-0091',
          clientId:  firstClient.id,
          status:    'DISPATCHED',
          items: {
            create: {
              productId: firstProduct.id,
              qty:       3,
              unitPrice: firstProduct.priceUsd,
            },
          },
        },
      });
      console.log('  ✓ Sample order ORD-0091 seeded');
    }
  }

  // 4 — Seed contracts
  console.log('  Seeding contracts...');
  for (const c of MOCK_CONTRACTS) {
    await prisma.contract.upsert({
      where:  { displayId: c.displayId },
      create: c,
      update: c,
    });
  }
  console.log('  ✓ Contracts seeded');

  // 5 — Seed SUPER_ADMIN user
  const adminEmail = 'admin@gtm-admin.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await hashPassword('GTM_Admin_Change_Me_2025!');
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role:  'SUPER_ADMIN',
      },
    });
    console.log('  ✓ SUPER_ADMIN user created — CHANGE PASSWORD before production!');
    console.log(`    Email: ${adminEmail}`);
    console.log('    Password: GTM_Admin_Change_Me_2025!');
  } else {
    console.log('  ✓ SUPER_ADMIN user already exists — skipped');
  }

  // 6 — Sync sequences to match actual seeded data
  await syncSequences();

  console.log('\n✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
