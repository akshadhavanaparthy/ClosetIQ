// ClosetIQ Development Seed Script
// NOTE: All seeded developmental test records are strictly and clearly labeled as "[DEMO DATA]"
// No fake AI results or fake production data are inserted.

import { PrismaClient, ClothingSlot, FormalityLevel, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- ClosetIQ Database Seeding Starting ---');

  // 1. Core Category Taxonomy (Structural foundation required by the system)
  console.log('Seeding core hierarchical categories...');

  // Top level categories
  const topSlot = await prisma.category.upsert({
    where: { slug: 'tops' },
    update: {},
    create: {
      name: 'Tops',
      slug: 'tops',
      slotType: ClothingSlot.TOP,
      displayOrder: 1,
    },
  });

  const bottomSlot = await prisma.category.upsert({
    where: { slug: 'bottoms' },
    update: {},
    create: {
      name: 'Bottoms',
      slug: 'bottoms',
      slotType: ClothingSlot.BOTTOM,
      displayOrder: 2,
    },
  });

  const outerwearSlot = await prisma.category.upsert({
    where: { slug: 'outerwear' },
    update: {},
    create: {
      name: 'Outerwear',
      slug: 'outerwear',
      slotType: ClothingSlot.OUTERWEAR,
      displayOrder: 3,
    },
  });

  const footwearSlot = await prisma.category.upsert({
    where: { slug: 'footwear' },
    update: {},
    create: {
      name: 'Footwear',
      slug: 'footwear',
      slotType: ClothingSlot.FOOTWEAR,
      displayOrder: 4,
    },
  });

  const accessorySlot = await prisma.category.upsert({
    where: { slug: 'accessories' },
    update: {},
    create: {
      name: 'Accessories',
      slug: 'accessories',
      slotType: ClothingSlot.ACCESSORY,
      displayOrder: 5,
    },
  });

  // Subcategories
  const subCategories = [
    { name: 'Button-Up Shirts', slug: 'button-up-shirts', slotType: ClothingSlot.TOP, parentId: topSlot.id },
    { name: 'T-Shirts & Polos', slug: 't-shirts-polos', slotType: ClothingSlot.TOP, parentId: topSlot.id },
    { name: 'Knitwear & Sweaters', slug: 'knitwear-sweaters', slotType: ClothingSlot.TOP, parentId: topSlot.id },
    { name: 'Tailored Trousers', slug: 'tailored-trousers', slotType: ClothingSlot.BOTTOM, parentId: bottomSlot.id },
    { name: 'Denim & Jeans', slug: 'denim-jeans', slotType: ClothingSlot.BOTTOM, parentId: bottomSlot.id },
    { name: 'Blazers & Jackets', slug: 'blazers-jackets', slotType: ClothingSlot.OUTERWEAR, parentId: outerwearSlot.id },
    { name: 'Overcoats & Trench', slug: 'overcoats-trench', slotType: ClothingSlot.OUTERWEAR, parentId: outerwearSlot.id },
    { name: 'Loafers & Derbies', slug: 'loafers-derbies', slotType: ClothingSlot.FOOTWEAR, parentId: footwearSlot.id },
    { name: 'Minimalist Sneakers', slug: 'minimalist-sneakers', slotType: ClothingSlot.FOOTWEAR, parentId: footwearSlot.id },
    { name: 'Leather Belts', slug: 'leather-belts', slotType: ClothingSlot.ACCESSORY, parentId: accessorySlot.id },
  ];

  for (const cat of subCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { parentId: cat.parentId },
      create: cat,
    });
  }

  // 2. Reference Fashion Brands
  console.log('Seeding reference brand catalog...');
  const brands = [
    { name: 'Loro Piana', slug: 'loro-piana', priceTier: 3, countryOfOrigin: 'Italy' },
    { name: 'Brunello Cucinelli', slug: 'brunello-cucinelli', priceTier: 3, countryOfOrigin: 'Italy' },
    { name: 'Toteme', slug: 'toteme', priceTier: 2, countryOfOrigin: 'Sweden' },
    { name: 'COS', slug: 'cos', priceTier: 1, countryOfOrigin: 'United Kingdom' },
    { name: 'Arket', slug: 'arket', priceTier: 1, countryOfOrigin: 'Sweden' },
  ];

  const seededBrands: Record<string, string> = {};
  for (const b of brands) {
    const brandRecord = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
    seededBrands[b.slug] = brandRecord.id;
  }

  // 3. Clearly Labeled [DEMO DATA] User & Profile
  console.log('Seeding [DEMO DATA] development user and profile...');
  const demoEmail = 'demo.user@closetiq.fashion';
  
  // Clean up existing demo user if present to ensure idempotency
  const existingUser = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (existingUser) {
    await prisma.user.delete({ where: { id: existingUser.id } });
  }

  const demoUser = await prisma.user.create({
    data: {
      email: demoEmail,
      // Argon2/Bcrypt placeholder hash for local testing
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$DEMO_PASSWORD_SALT$DEMO_PASSWORD_HASH',
      role: UserRole.USER,
      isVerified: true,
      profile: {
        create: {
          firstName: '[DEMO DATA] Alex',
          lastName: 'Vane',
          displayName: '[DEMO DATA] Alex Vane',
          bio: '[DEMO DATA] Minimalist styling enthusiast with focus on neutral tones and tailored fits.',
          gender: 'ANDROGYNOUS',
        },
      },
      preferences: {
        create: {
          budgetTier: 2,
          preferredCurrency: 'USD',
          preferredBrands: ['COS', 'Toteme'],
          avoidedColors: ['#FF0000', '#00FF00'],
          preferredFits: ['relaxed', 'tailored'],
        },
      },
      measurementProfile: {
        create: {
          heightCm: 178.0,
          weightKg: 70.0,
          chestBustCm: 96.0,
          waistCm: 80.0,
          hipCm: 98.0,
          topSizeStandard: 'M',
          bottomSizeStandard: '32',
          shoeSizeStandard: 'US 10',
          unitSystem: 'METRIC',
        },
      },
      styleProfile: {
        create: {
          primaryStyleArchetype: 'Quiet Luxury',
          secondaryStyleArchetype: 'Minimalist',
          styleKeywords: ['tailored', 'monochrome', 'linen', 'structured'],
          formalityComfortZone: 3,
          lifestyleTags: ['office', 'city', 'weekend'],
          isComplete: true,
        },
      },
    },
  });

  // 4. Clearly Labeled [DEMO DATA] Wardrobe Items
  console.log('Seeding [DEMO DATA] wardrobe items...');
  const blazerCategory = await prisma.category.findUnique({ where: { slug: 'blazers-jackets' } });
  const shirtCategory = await prisma.category.findUnique({ where: { slug: 'button-up-shirts' } });
  const trouserCategory = await prisma.category.findUnique({ where: { slug: 'tailored-trousers' } });

  if (blazerCategory && shirtCategory && trouserCategory) {
    const item1 = await prisma.wardrobeItem.create({
      data: {
        userId: demoUser.id,
        categoryId: blazerCategory.id,
        name: '[DEMO DATA] Midnight Navy Wool Blazer',
        brandName: 'COS',
        primaryColorName: 'Navy',
        primaryColorHex: '#1B263B',
        pattern: 'SOLID',
        material: 'Wool',
        formalityLevel: FormalityLevel.BUSINESS_CASUAL,
        seasonalSuitability: ['AUTUMN', 'WINTER', 'SPRING'],
        fitType: 'TAILORED',
        purchasePrice: 220.0,
      },
    });

    const item2 = await prisma.wardrobeItem.create({
      data: {
        userId: demoUser.id,
        categoryId: shirtCategory.id,
        name: '[DEMO DATA] Crisp White Poplin Shirt',
        brandName: 'Arket',
        primaryColorName: 'White',
        primaryColorHex: '#FFFFFF',
        pattern: 'SOLID',
        material: 'Cotton Poplin',
        formalityLevel: FormalityLevel.SMART_CASUAL,
        seasonalSuitability: ['ALL_YEAR'],
        fitType: 'REGULAR',
        purchasePrice: 95.0,
      },
    });

    const item3 = await prisma.wardrobeItem.create({
      data: {
        userId: demoUser.id,
        categoryId: trouserCategory.id,
        name: '[DEMO DATA] Charcoal Pleated Trousers',
        brandName: 'COS',
        primaryColorName: 'Charcoal',
        primaryColorHex: '#2E2E2E',
        pattern: 'SOLID',
        material: 'Wool Blend',
        formalityLevel: FormalityLevel.BUSINESS_CASUAL,
        seasonalSuitability: ['AUTUMN', 'WINTER', 'SPRING'],
        fitType: 'RELAXED',
        purchasePrice: 150.0,
      },
    });
  }

  // 5. Clearly Labeled [DEMO DATA] Catalog Product with Normalized Attributes & Merchant Source
  console.log('Seeding [DEMO DATA] product with normalized attributes & merchant source...');
  const loafersCategory = await prisma.category.findUnique({ where: { slug: 'loafers-derbies' } });
  
  if (loafersCategory && seededBrands['loro-piana']) {
    const demoProduct = await prisma.product.create({
      data: {
        brandId: seededBrands['loro-piana'],
        categoryId: loafersCategory.id,
        title: '[DEMO DATA] Summer Walk Suede Loafers',
        slug: 'demo-summer-walk-suede-loafers',
        sku: 'DEMO-LP-SW-001',
        description: '[DEMO DATA] Water-repellent suede loafers with latex soles and signature hand-stitched detailing.',
        basePrice: 980.0,
        currency: 'USD',
        retailPrice: 980.0,
        isAvailable: true,
        attributes: {
          create: {
            primaryColorName: 'Sand Beige',
            primaryColorHex: '#D4C5B9',
            colorFamily: 'NEUTRAL',
            pattern: 'SOLID',
            material: 'Suede Calfskin',
            formalityLevel: FormalityLevel.SMART_CASUAL,
            seasonalSuitability: ['SPRING', 'SUMMER', 'AUTUMN'],
            fitType: 'REGULAR',
          },
        },
        merchantSources: {
          create: {
            merchantName: 'Mr Porter',
            merchantSlug: 'mr-porter',
            externalSku: 'MP-LP-99812',
            productUrl: 'https://example.com/demo/mr-porter/summer-walk-loafers',
            affiliateUrl: 'https://example.com/affiliate/redirect?id=demo123',
            inStock: true,
            availableSizes: ['41', '42', '43', '44'],
            currentPrice: 980.0,
            currency: 'USD',
            affiliateNetwork: 'Impact',
            commissionRate: 8.5,
          },
        },
      },
    });
  }

  console.log('--- ClosetIQ Database Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
