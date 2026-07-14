// server/prisma/seed.ts
// ─────────────────────────────────────────────────────────────────────────────
// Seeds the GTM database. CATALOG is kept in sync with CatalogData.js (65 items).
// Run with: npm run db:seed
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient, ProductCategory } from '@prisma/client';
import { hashPassword } from '../src/lib/password.js';

const prisma = new PrismaClient();

type SeedProduct = {
  name:          string;
  category:      ProductCategory;
  subCategory:   string;
  priceUsd:      number;
  localImageName:string;
  colors:        string[];
};

const SEED_COLORS = ['Navy Blue', 'Black', 'Burgundy', 'White', 'Grey'];

// ── CATALOG — 65 products, mirrored 1-to-1 from website/src/components/CatalogData.js ──

const CATALOG: SeedProduct[] = [
  // ── APPAREL — Casual Wear ─────────────────────────────────────────────────
  { name: 'Hoodies',                   category: 'APPAREL', subCategory: 'Casual Wear',       priceUsd: 24.99, localImageName: 'Hoodie black.png',                    colors: SEED_COLORS },
  { name: 'T-Shirts',                  category: 'APPAREL', subCategory: 'Casual Wear',       priceUsd: 12.99, localImageName: 't-shirts.jpg',                         colors: SEED_COLORS },
  { name: 'Polo Shirts',               category: 'APPAREL', subCategory: 'Casual Wear',       priceUsd: 19.99, localImageName: 'polo-shirts.jpg',                      colors: SEED_COLORS },
  { name: 'Long Sleeve T-Shirts',      category: 'APPAREL', subCategory: 'Casual Wear',       priceUsd: 16.99, localImageName: 'long-sleeve-t-shirts.jpg',             colors: SEED_COLORS },
  { name: 'Henley Shirts',             category: 'APPAREL', subCategory: 'Casual Wear',       priceUsd: 18.99, localImageName: 'henley-shirts.jpg',                    colors: SEED_COLORS },
  { name: 'Zip-Up Hoodies',            category: 'APPAREL', subCategory: 'Casual Wear',       priceUsd: 29.99, localImageName: 'zip-up-hoodies.jpg',                   colors: SEED_COLORS },
  { name: 'Casual Shirts',             category: 'APPAREL', subCategory: 'Casual Wear',       priceUsd: 21.99, localImageName: 'casual-shirts.jpg',                    colors: SEED_COLORS },
  // ── APPAREL — Loungewear ──────────────────────────────────────────────────
  { name: 'Sweatshirts',               category: 'APPAREL', subCategory: 'Loungewear',        priceUsd: 22.99, localImageName: 'sweatshirts.jpg',                      colors: SEED_COLORS },
  { name: 'Fleece Trousers / Joggers', category: 'APPAREL', subCategory: 'Loungewear',        priceUsd: 19.99, localImageName: 'fleece-trousers-joggers.jpg',          colors: SEED_COLORS },
  { name: 'Sweatpants',                category: 'APPAREL', subCategory: 'Loungewear',        priceUsd: 17.99, localImageName: 'sweatpants.jpg',                       colors: SEED_COLORS },
  { name: 'Shorts',                    category: 'APPAREL', subCategory: 'Loungewear',        priceUsd: 14.99, localImageName: 'shorts.jpg',                           colors: SEED_COLORS },
  { name: 'Tank Tops',                 category: 'APPAREL', subCategory: 'Loungewear',        priceUsd: 11.99, localImageName: 'tank-tops.jpg',                        colors: SEED_COLORS },
  { name: 'Pyjamas and Loungewear',    category: 'APPAREL', subCategory: 'Loungewear',        priceUsd: 26.99, localImageName: 'pyjamas-and-loungewear.jpg',           colors: SEED_COLORS },
  // ── APPAREL — Knitwear ────────────────────────────────────────────────────
  { name: 'Jackets',                   category: 'APPAREL', subCategory: 'Knitwear',          priceUsd: 39.99, localImageName: 'jackets.jpg',                          colors: SEED_COLORS },
  { name: 'Vests',                     category: 'APPAREL', subCategory: 'Knitwear',          priceUsd: 27.99, localImageName: 'vests.jpg',                            colors: SEED_COLORS },
  { name: 'Chinos and Casual Trousers',category: 'APPAREL', subCategory: 'Knitwear',          priceUsd: 29.99, localImageName: 'chinos-and-casual-trousers.jpg',       colors: SEED_COLORS },
  { name: 'Cargo Pants',               category: 'APPAREL', subCategory: 'Knitwear',          priceUsd: 31.99, localImageName: 'cargo-pants.jpg',                      colors: SEED_COLORS },
  { name: 'Knitwear and Cardigans',    category: 'APPAREL', subCategory: 'Knitwear',          priceUsd: 34.99, localImageName: 'knitwear-and-cardigans.jpg',           colors: SEED_COLORS },
  // ── UNIFORM & WORKWEAR — Industrial Workwear ──────────────────────────────
  { name: 'Coveralls',                              category: 'UNIFORM_WORKWEAR', subCategory: 'Industrial Workwear', priceUsd: 49.99, localImageName: 'coveralls.jpg',                        colors: SEED_COLORS },
  { name: 'Overalls',                               category: 'UNIFORM_WORKWEAR', subCategory: 'Industrial Workwear', priceUsd: 44.99, localImageName: 'overalls.jpg',                         colors: SEED_COLORS },
  { name: 'Industrial Work Shirts',                 category: 'UNIFORM_WORKWEAR', subCategory: 'Industrial Workwear', priceUsd: 27.99, localImageName: 'industrial-work-shirts.jpg',           colors: SEED_COLORS },
  { name: 'Work Trousers',                          category: 'UNIFORM_WORKWEAR', subCategory: 'Industrial Workwear', priceUsd: 34.99, localImageName: 'work-trousers.jpg',                    colors: SEED_COLORS },
  { name: 'Cargo Pants',                            category: 'UNIFORM_WORKWEAR', subCategory: 'Industrial Workwear', priceUsd: 36.99, localImageName: 'workwear-cargo-pants.jpg',             colors: SEED_COLORS },
  { name: 'Bib Overalls',                           category: 'UNIFORM_WORKWEAR', subCategory: 'Industrial Workwear', priceUsd: 42.99, localImageName: 'bib-overalls.jpg',                     colors: SEED_COLORS },
  { name: 'Mechanic Uniforms',                      category: 'UNIFORM_WORKWEAR', subCategory: 'Industrial Workwear', priceUsd: 54.99, localImageName: 'mechanic-uniforms.jpg',                colors: SEED_COLORS },
  { name: 'Fire-Retardant (FR) Coveralls',          category: 'UNIFORM_WORKWEAR', subCategory: 'Industrial Workwear', priceUsd: 89.99, localImageName: 'fire-retardant-coveralls.jpg',         colors: SEED_COLORS },
  { name: 'Welding Jackets',                        category: 'UNIFORM_WORKWEAR', subCategory: 'Industrial Workwear', priceUsd: 64.99, localImageName: 'welding-jackets.jpg',                  colors: SEED_COLORS },
  { name: 'Welding Trousers',                       category: 'UNIFORM_WORKWEAR', subCategory: 'Industrial Workwear', priceUsd: 54.99, localImageName: 'welding-trousers.jpg',                 colors: SEED_COLORS },
  // ── UNIFORM & WORKWEAR — Hospitality Uniforms ─────────────────────────────
  { name: 'Hotel Staff Suiting',                    category: 'UNIFORM_WORKWEAR', subCategory: 'Hospitality Uniforms', priceUsd: 79.99, localImageName: 'hotel-staff-suiting.jpg',             colors: SEED_COLORS },
  { name: 'Chef Coats and Jackets',                 category: 'UNIFORM_WORKWEAR', subCategory: 'Hospitality Uniforms', priceUsd: 34.99, localImageName: 'chef-coats-and-jackets.jpg',          colors: SEED_COLORS },
  { name: 'Chef Aprons',                            category: 'UNIFORM_WORKWEAR', subCategory: 'Hospitality Uniforms', priceUsd: 18.99, localImageName: 'chef-aprons.jpg',                     colors: SEED_COLORS },
  { name: 'Housekeeping Uniforms',                  category: 'UNIFORM_WORKWEAR', subCategory: 'Hospitality Uniforms', priceUsd: 39.99, localImageName: 'housekeeping-uniforms.jpg',            colors: SEED_COLORS },
  { name: 'Waiter and Restaurant Uniforms',         category: 'UNIFORM_WORKWEAR', subCategory: 'Hospitality Uniforms', priceUsd: 44.99, localImageName: 'waiter-and-restaurant-uniforms.jpg',  colors: SEED_COLORS },
  // ── UNIFORM & WORKWEAR — Medical Uniforms ─────────────────────────────────
  { name: 'Lab Coats',                              category: 'UNIFORM_WORKWEAR', subCategory: 'Medical Uniforms', priceUsd: 29.99, localImageName: 'lab-coats.jpg',                           colors: SEED_COLORS },
  { name: 'Medical Scrubs',                         category: 'UNIFORM_WORKWEAR', subCategory: 'Medical Uniforms', priceUsd: 27.99, localImageName: 'medical-scrubs.jpg',                      colors: SEED_COLORS },
  // ── UNIFORM & WORKWEAR — Corporate Uniforms ───────────────────────────────
  { name: 'Safari Suits',                           category: 'UNIFORM_WORKWEAR', subCategory: 'Corporate Uniforms', priceUsd: 69.99, localImageName: 'safari-suits.jpg',                     colors: SEED_COLORS },
  { name: 'Corporate Uniforms and Blazers',         category: 'UNIFORM_WORKWEAR', subCategory: 'Corporate Uniforms', priceUsd: 89.99, localImageName: 'corporate-uniforms-and-blazers.jpg',   colors: SEED_COLORS },
  // ── UNIFORM & WORKWEAR — Safety Wear ─────────────────────────────────────
  { name: 'High Visibility (Hi-Vis) Jackets',       category: 'UNIFORM_WORKWEAR', subCategory: 'Safety Wear', priceUsd: 34.99, localImageName: 'hi-vis-jackets.jpg',                          colors: SEED_COLORS },
  { name: 'Security Uniforms',                      category: 'UNIFORM_WORKWEAR', subCategory: 'Safety Wear', priceUsd: 59.99, localImageName: 'security-uniforms.jpg',                       colors: SEED_COLORS },
  { name: 'Reflective Safety Vests',                category: 'UNIFORM_WORKWEAR', subCategory: 'Safety Wear', priceUsd: 14.99, localImageName: 'reflective-safety-vests.jpg',                 colors: SEED_COLORS },
  { name: 'Rain Suits and Waterproof Jackets',      category: 'UNIFORM_WORKWEAR', subCategory: 'Safety Wear', priceUsd: 49.99, localImageName: 'rain-suits-and-waterproof-jackets.jpg',       colors: SEED_COLORS },
  { name: 'Caps and Headwear',                      category: 'UNIFORM_WORKWEAR', subCategory: 'Safety Wear', priceUsd: 12.99, localImageName: 'caps-and-headwear.jpg',                       colors: SEED_COLORS },
  // ── SPORTSWEAR — Teamwear ─────────────────────────────────────────────────
  { name: 'Football Jerseys',           category: 'SPORTSWEAR', subCategory: 'Teamwear', priceUsd: 29.99, localImageName: 'football-jerseys.jpg',       colors: SEED_COLORS },
  { name: 'Basketball Jerseys',         category: 'SPORTSWEAR', subCategory: 'Teamwear', priceUsd: 27.99, localImageName: 'basketball-jerseys.jpg',     colors: SEED_COLORS },
  { name: 'Baseball Jerseys',           category: 'SPORTSWEAR', subCategory: 'Teamwear', priceUsd: 31.99, localImageName: 'baseball-jerseys.jpg',       colors: SEED_COLORS },
  { name: 'Soccer Jerseys',             category: 'SPORTSWEAR', subCategory: 'Teamwear', priceUsd: 29.99, localImageName: 'soccer-jerseys.jpg',         colors: SEED_COLORS },
  { name: 'Cricket Jerseys',            category: 'SPORTSWEAR', subCategory: 'Teamwear', priceUsd: 26.99, localImageName: 'cricket-jerseys.jpg',        colors: SEED_COLORS },
  { name: 'Rugby Jerseys',              category: 'SPORTSWEAR', subCategory: 'Teamwear', priceUsd: 34.99, localImageName: 'rugby-jerseys.jpg',          colors: SEED_COLORS },
  { name: 'Volleyball Jerseys',         category: 'SPORTSWEAR', subCategory: 'Teamwear', priceUsd: 24.99, localImageName: 'volleyball-jerseys.jpg',     colors: SEED_COLORS },
  { name: 'Cycling Jerseys',            category: 'SPORTSWEAR', subCategory: 'Teamwear', priceUsd: 39.99, localImageName: 'cycling-jerseys.jpg',        colors: SEED_COLORS },
  { name: 'Sleeveless Jerseys',         category: 'SPORTSWEAR', subCategory: 'Teamwear', priceUsd: 19.99, localImageName: 'sleeveless-jerseys.jpg',     colors: SEED_COLORS },
  { name: 'Teamwear Sets',              category: 'SPORTSWEAR', subCategory: 'Teamwear', priceUsd: 54.99, localImageName: 'teamwear-sets.jpg',           colors: SEED_COLORS },
  // ── SPORTSWEAR — Training Wear ────────────────────────────────────────────
  { name: 'Compression Shirts',              category: 'SPORTSWEAR', subCategory: 'Training Wear', priceUsd: 22.99, localImageName: 'compression-shirts.jpg',                colors: SEED_COLORS },
  { name: 'Compression Tights and Leggings', category: 'SPORTSWEAR', subCategory: 'Training Wear', priceUsd: 24.99, localImageName: 'compression-tights-and-leggings.jpg',  colors: SEED_COLORS },
  { name: 'Training T-Shirts',               category: 'SPORTSWEAR', subCategory: 'Training Wear', priceUsd: 17.99, localImageName: 'training-t-shirts.jpg',                colors: SEED_COLORS },
  { name: 'Tank Tops',                       category: 'SPORTSWEAR', subCategory: 'Training Wear', priceUsd: 14.99, localImageName: 'sporty-tank-tops.jpg',                 colors: SEED_COLORS },
  { name: 'Warm-Up Suits',                   category: 'SPORTSWEAR', subCategory: 'Training Wear', priceUsd: 49.99, localImageName: 'warm-up-suits.jpg',                    colors: SEED_COLORS },
  { name: 'Running Shorts',                  category: 'SPORTSWEAR', subCategory: 'Training Wear', priceUsd: 16.99, localImageName: 'running-shorts.jpg',                   colors: SEED_COLORS },
  // ── SPORTSWEAR — Performance Wear ────────────────────────────────────────
  { name: 'Performance Polo Shirts',    category: 'SPORTSWEAR', subCategory: 'Performance Wear',  priceUsd: 26.99, localImageName: 'performance-polo-shirts.jpg',  colors: SEED_COLORS },
  // ── SPORTSWEAR — Athleisure Wear ─────────────────────────────────────────
  { name: 'Hoodies',                    category: 'SPORTSWEAR', subCategory: 'Athleisure Wear',   priceUsd: 34.99, localImageName: 'athleisure-hoodies.jpg',        colors: SEED_COLORS },
  { name: 'Sweatshirts',                category: 'SPORTSWEAR', subCategory: 'Athleisure Wear',   priceUsd: 28.99, localImageName: 'athleisure-sweatshirts.jpg',    colors: SEED_COLORS },
  { name: 'Jackets',                    category: 'SPORTSWEAR', subCategory: 'Athleisure Wear',   priceUsd: 44.99, localImageName: 'athleisure-jackets.jpg',        colors: SEED_COLORS },
  { name: 'Tracksuits',                 category: 'SPORTSWEAR', subCategory: 'Athleisure Wear',   priceUsd: 59.99, localImageName: 'tracksuits.jpg',                colors: SEED_COLORS },
  { name: 'Shorts',                     category: 'SPORTSWEAR', subCategory: 'Athleisure Wear',   priceUsd: 18.99, localImageName: 'athleisure-shorts.jpg',         colors: SEED_COLORS },
  { name: 'Track Pants',                category: 'SPORTSWEAR', subCategory: 'Athleisure Wear',   priceUsd: 29.99, localImageName: 'track-pants.jpg',               colors: SEED_COLORS },
];



// ── syncSequences ─────────────────────────────────────────────────────────────
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

  // A — Explicitly clear all mock retail orders, contracts, and clients by their IDs/emails if they exist
  console.log('  Clearing any historical mock data...');
  try {
    const mockOrder = await prisma.retailOrder.findFirst({
      where: { displayId: 'ORD-0091' }
    });
    if (mockOrder) {
      await prisma.orderItem.deleteMany({
        where: { orderId: mockOrder.id }
      });
      await prisma.retailOrder.delete({
        where: { id: mockOrder.id }
      });
      console.log('  ✓ Mock order ORD-0091 deleted');
    }

    await prisma.contract.deleteMany({
      where: {
        displayId: { in: ['RFQ-192041', 'RFQ-188830', 'RFQ-141003'] }
      }
    });
    console.log('  ✓ Mock contracts deleted');

    await prisma.client.deleteMany({
      where: {
        email: { in: [
          'j.hartwell@mail.com',
          's.mitchell@corp.com',
          'o.patel@business.net',
          'l.kaufmann@enterprise.de',
          'c.reyes@outlook.com'
        ] }
      }
    });
    console.log('  ✓ Mock clients deleted');
  } catch (err) {
    console.log('  ⚠ Error clearing mock data (might not exist yet):', (err as any).message);
  }

  const productCount = await prisma.product.count();

  if (productCount === 0) {
    console.log('  Database appears empty. Seeding catalog products...');
    
    // 1 — Seed all 65 products (mirrored from CatalogData.js)
    console.log(`  Seeding ${CATALOG.length} products...`);
    for (const p of CATALOG) {
      const { colors, ...productData } = p;
      await prisma.product.create({
        data: {
          sku:  `seed-${p.localImageName}`,
          ...productData,
          colors: { create: colors.map((colorName) => ({ colorName })) },
        },
      });
    }
    console.log(`  ✓ ${CATALOG.length} products seeded`);
  } else {
    console.log('  Database already has products. Skipping full catalog seed.');
  }

  // 5 — Seed operator accounts
  const OPERATORS = [
    { email: 'aman@gtm-admin.com',  name: 'Aman'  },
    { email: 'yazir@gtm-admin.com', name: 'Yazir' },
  ];

  if (process.env.NODE_ENV === 'production' && !process.env.INITIAL_OPERATOR_PASSWORD) {
    console.error('❌ ERROR: INITIAL_OPERATOR_PASSWORD must be configured in production!');
    process.exit(1);
  }

  const defaultPassword = process.env.INITIAL_OPERATOR_PASSWORD || 'gtmadmin-2026';
  const sharedPasswordHash = await hashPassword(defaultPassword);

  for (const op of OPERATORS) {
    await prisma.user.upsert({
      where:  { email: op.email },
      update: { role: 'SUPER_ADMIN' }, // Protect active passwords from resets on startup
      create: { email: op.email, passwordHash: sharedPasswordHash, role: 'SUPER_ADMIN' },
    });
    console.log(`  ✓ Operator upserted — ${op.name} <${op.email}>`);
  }

  // 6 — Sync DB sequences
  await syncSequences();

  console.log('\n✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
