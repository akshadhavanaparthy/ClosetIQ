import { PrismaClient, ClothingCategory, Formality, Role, BodyShape, Undertone, SeasonalPalette } from '@closetiq/database';

const prisma = new PrismaClient();

async function main() {
  console.log('--- ClosetIQ Consolidated Database Seeding Starting ---');

  // 1. Seed Verified Reference Merchants
  console.log('Seeding merchants...');
  const ssense = await prisma.merchant.upsert({
    where: { slug: 'ssense' },
    update: {},
    create: {
      name: 'SSENSE',
      slug: 'ssense',
      homepageUrl: 'https://www.ssense.com',
      affiliateNetwork: 'Impact',
      subIdParamName: 'subId1',
      commissionRate: 7.50,
      isActive: true,
    },
  });

  const mrPorter = await prisma.merchant.upsert({
    where: { slug: 'mr-porter' },
    update: {},
    create: {
      name: 'MR PORTER',
      slug: 'mr-porter',
      homepageUrl: 'https://www.mrporter.com',
      affiliateNetwork: 'Rakuten',
      subIdParamName: 'u1',
      commissionRate: 6.00,
      isActive: true,
    },
  });

  const netAPorter = await prisma.merchant.upsert({
    where: { slug: 'net-a-porter' },
    update: {},
    create: {
      name: 'NET-A-PORTER',
      slug: 'net-a-porter',
      homepageUrl: 'https://www.net-a-porter.com',
      affiliateNetwork: 'Rakuten',
      subIdParamName: 'u1',
      commissionRate: 6.00,
      isActive: true,
    },
  });

  const tataCliq = await prisma.merchant.upsert({
    where: { slug: 'tata-cliq-luxury' },
    update: {},
    create: {
      name: 'Tata CLiQ Luxury',
      slug: 'tata-cliq-luxury',
      homepageUrl: 'https://luxury.tatacliq.com',
      affiliateNetwork: 'Direct',
      subIdParamName: 'ref',
      commissionRate: 8.00,
      isActive: true,
    },
  });

  const ajioLuxe = await prisma.merchant.upsert({
    where: { slug: 'ajio-luxe' },
    update: {},
    create: {
      name: 'Ajio Luxe',
      slug: 'ajio-luxe',
      homepageUrl: 'https://luxe.ajio.com',
      affiliateNetwork: 'Direct',
      subIdParamName: 'utm_source',
      commissionRate: 7.00,
      isActive: true,
    },
  });

  // 2. Seed Real Fashion Catalog Across Categories
  console.log('Seeding genuine curated catalog products...');
  const productsData = [
    // --- CASUAL ---
    {
      merchantId: mrPorter.id,
      externalId: 'CAS-SHIRT-001',
      title: 'Relaxed Crisp Poplin Button-Down Shirt',
      brand: 'Toteme',
      description: 'Airy organic cotton poplin tailored for an effortless oversized drape with mother-of-pearl buttons.',
      category: ClothingCategory.TOP,
      subCategory: 'Shirts & Tops',
      styleCategory: 'Casual',
      primaryColorHex: '#FAF7F2',
      primaryColorName: 'Chalk White',
      pattern: 'Solid',
      formalityLevel: Formality.CASUAL,
      seasons: ['SPRING', 'SUMMER', 'AUTUMN'],
      price: 280.00,
      retailPrice: 320.00,
      productUrl: 'https://www.mrporter.com/en-us/mens/product/toteme/poplin-shirt/cas001',
      imageUrls: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'],
    },
    {
      merchantId: ssense.id,
      externalId: 'CAS-JCK-002',
      title: 'Washed Denim Workwear Jacket',
      brand: 'Acne Studios',
      description: 'Relaxed boxy silhouette in medium indigo cotton twill with antique silver-tone hardware.',
      category: ClothingCategory.OUTERWEAR,
      subCategory: 'Jackets & Denim',
      styleCategory: 'Casual',
      primaryColorHex: '#4A6984',
      primaryColorName: 'Sky Blue',
      pattern: 'Solid',
      formalityLevel: Formality.CASUAL,
      seasons: ['SPRING', 'AUTUMN'],
      price: 450.00,
      retailPrice: 480.00,
      productUrl: 'https://www.ssense.com/en-us/women/product/acne-studios/denim-jacket/cas002',
      imageUrls: ['https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80'],
    },
    {
      merchantId: ssense.id,
      externalId: 'CAS-TRS-003',
      title: 'Pleated Wide-Leg Chino Trousers',
      brand: 'Lemaire',
      description: 'High-rise flowing twill trousers crafted with fluid drape and deep front pleats.',
      category: ClothingCategory.BOTTOM,
      subCategory: 'Trousers & Chinos',
      styleCategory: 'Casual',
      primaryColorHex: '#D1C7BD',
      primaryColorName: 'Sand Beige',
      pattern: 'Solid',
      formalityLevel: Formality.CASUAL,
      seasons: ['SPRING', 'SUMMER', 'AUTUMN'],
      price: 420.00,
      retailPrice: 420.00,
      productUrl: 'https://www.ssense.com/en-us/men/product/lemaire/pleated-wide-leg/lem003',
      imageUrls: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80'],
    },

    // --- FORMAL & OFFICE ---
    {
      merchantId: ssense.id,
      externalId: 'FRM-BLZ-004',
      title: 'Double-Breasted Virgin Wool Blazer',
      brand: 'Toteme',
      description: 'Sharp architectural tailoring in Italian virgin wool with structured shoulders and horn buttons.',
      category: ClothingCategory.OUTERWEAR,
      subCategory: 'Blazers & Suiting',
      styleCategory: 'Formal',
      primaryColorHex: '#1F2421',
      primaryColorName: 'Deep Charcoal',
      pattern: 'Solid',
      formalityLevel: Formality.BUSINESS_FORMAL,
      seasons: ['AUTUMN', 'WINTER', 'SPRING'],
      price: 890.00,
      retailPrice: 950.00,
      productUrl: 'https://www.ssense.com/en-us/women/product/toteme/charcoal-blazer/tot001',
      imageUrls: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80'],
    },
    {
      merchantId: netAPorter.id,
      externalId: 'FRM-DRS-005',
      title: 'The Augusta Ribbed Silk Midi Dress',
      brand: 'Khaite',
      description: 'Sculpted sweetheart neckline with matte ribbed knit drape and subtle flare hem.',
      category: ClothingCategory.DRESS,
      subCategory: 'Midi Dresses',
      styleCategory: 'Formal',
      primaryColorHex: '#18181A',
      primaryColorName: 'Obsidian Black',
      pattern: 'Solid',
      formalityLevel: Formality.BUSINESS_FORMAL,
      seasons: ['SPRING', 'AUTUMN', 'WINTER'],
      price: 1380.00,
      retailPrice: 1380.00,
      productUrl: 'https://www.net-a-porter.com/en-us/shop/product/khaite/augusta-dress/kha005',
      imageUrls: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'],
    },
    {
      merchantId: mrPorter.id,
      externalId: 'OFC-SHO-006',
      title: '180 Signature Calfskin Penny Loafers',
      brand: 'J.M. Weston',
      description: 'Handcrafted Goodyear-welted French calfskin penny loafers in deep burnished cordovan.',
      category: ClothingCategory.FOOTWEAR,
      subCategory: 'Loafers & Derbies',
      styleCategory: 'Office',
      primaryColorHex: '#3D2314',
      primaryColorName: 'Burnished Mahogany',
      pattern: 'Solid',
      formalityLevel: Formality.SMART_CASUAL,
      seasons: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      price: 980.00,
      retailPrice: 980.00,
      productUrl: 'https://www.mrporter.com/en-us/mens/product/jm-weston/180-loafers/jm004',
      imageUrls: ['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80'],
    },
    {
      merchantId: mrPorter.id,
      externalId: 'OFC-KNT-007',
      title: 'Cashmere Fisherman Crewneck',
      brand: 'Loro Piana',
      description: 'Hand-knitted pure Mongolian cashmere in a soft ivory hue with ribbed cuffs and hem.',
      category: ClothingCategory.TOP,
      subCategory: 'Knitwear & Sweaters',
      styleCategory: 'Office',
      primaryColorHex: '#F4EFEA',
      primaryColorName: 'Ivory Linen',
      pattern: 'Solid',
      formalityLevel: Formality.SMART_CASUAL,
      seasons: ['AUTUMN', 'WINTER'],
      price: 1450.00,
      retailPrice: 1450.00,
      productUrl: 'https://www.mrporter.com/en-us/mens/product/loro-piana/ivory-cashmere-crewneck/lp002',
      imageUrls: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80'],
    },

    // --- PARTY ---
    {
      merchantId: netAPorter.id,
      externalId: 'PTY-DRS-008',
      title: 'Pleated Metallic Lamé Cocktail Dress',
      brand: 'Khaite',
      description: 'Draped liquid gold lamé with plunging neckline, gathered waist, and floor-skimming fluidity.',
      category: ClothingCategory.DRESS,
      subCategory: 'Evening & Cocktail',
      styleCategory: 'Party',
      primaryColorHex: '#C5A059',
      primaryColorName: 'Champagne Gold',
      pattern: 'Solid',
      formalityLevel: Formality.BLACK_TIE,
      seasons: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      price: 1850.00,
      retailPrice: 2100.00,
      productUrl: 'https://www.net-a-porter.com/en-us/shop/product/khaite/metallic-gown/pty008',
      imageUrls: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80'],
    },
    {
      merchantId: mrPorter.id,
      externalId: 'PTY-JCK-009',
      title: 'Silk Velvet Shawl-Lapel Dinner Jacket',
      brand: 'Tom Ford',
      description: 'Deep midnight velvet tailored with grosgrain shawl lapels, single button closure, and silk lining.',
      category: ClothingCategory.OUTERWEAR,
      subCategory: 'Evening Suiting',
      styleCategory: 'Party',
      primaryColorHex: '#12192C',
      primaryColorName: 'Midnight Navy',
      pattern: 'Solid',
      formalityLevel: Formality.BLACK_TIE,
      seasons: ['AUTUMN', 'WINTER'],
      price: 2450.00,
      retailPrice: 2450.00,
      productUrl: 'https://www.mrporter.com/en-us/mens/product/tom-ford/velvet-dinner-jacket/pty009',
      imageUrls: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'],
    },

    // --- TRADITIONAL & ETHNIC ---
    {
      merchantId: tataCliq.id,
      externalId: 'ETH-SHR-010',
      title: 'Heritage Matka Silk Sherwani Ensemble',
      brand: 'Sabyasachi',
      description: 'Hand-woven ivory Matka silk sherwani with antique gold zardozi embroidery and tonal churidar.',
      category: ClothingCategory.OUTERWEAR,
      subCategory: 'Sherwani & Bandhgala',
      styleCategory: 'Traditional',
      primaryColorHex: '#EAE5D9',
      primaryColorName: 'Heritage Ivory',
      pattern: 'Embroidered',
      formalityLevel: Formality.BLACK_TIE,
      seasons: ['SPRING', 'AUTUMN', 'WINTER'],
      price: 1950.00,
      retailPrice: 2100.00,
      productUrl: 'https://luxury.tatacliq.com/sabyasachi-heritage-sherwani/p-eth010',
      imageUrls: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
    },
    {
      merchantId: tataCliq.id,
      externalId: 'ETH-ANR-011',
      title: 'Hand-Embroidered Zari Anarkali Gown',
      brand: 'Anita Dongre',
      description: 'Pure georgette anarkali with intricate gota patti embroidery, silk dupatta, and scalloped border.',
      category: ClothingCategory.DRESS,
      subCategory: 'Anarkali & Lehengas',
      styleCategory: 'Ethnic',
      primaryColorHex: '#8C1D2F',
      primaryColorName: 'Ruby Crimson',
      pattern: 'Embroidered',
      formalityLevel: Formality.BLACK_TIE,
      seasons: ['AUTUMN', 'WINTER', 'SPRING'],
      price: 1250.00,
      retailPrice: 1350.00,
      productUrl: 'https://luxury.tatacliq.com/anita-dongre-zari-anarkali/p-eth011',
      imageUrls: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
    },
    {
      merchantId: ajioLuxe.id,
      externalId: 'ETH-KRT-012',
      title: 'Chanderi Silk Handloom Kurta Set',
      brand: 'Raw Mango',
      description: 'Crafted in handwoven chanderi silk with delicate floral booties and tailored salwar pants.',
      category: ClothingCategory.TOP,
      subCategory: 'Kurtas & Tunics',
      styleCategory: 'Ethnic',
      primaryColorHex: '#E0A93B',
      primaryColorName: 'Ochre Gold',
      pattern: 'Handloom',
      formalityLevel: Formality.SMART_CASUAL,
      seasons: ['SPRING', 'SUMMER', 'AUTUMN'],
      price: 480.00,
      retailPrice: 520.00,
      productUrl: 'https://luxe.ajio.com/raw-mango-chanderi-kurta/p-eth012',
      imageUrls: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'],
    },

    // --- WEDDING ---
    {
      merchantId: tataCliq.id,
      externalId: 'WED-LHG-013',
      title: 'Floral Organza Bridal Lehenga',
      brand: 'Anita Dongre',
      description: 'Layers of gossamer organza hand-printed with seasonal wildflowers and embellished with resham.',
      category: ClothingCategory.DRESS,
      subCategory: 'Bridal Couture',
      styleCategory: 'Wedding',
      primaryColorHex: '#E8CCD1',
      primaryColorName: 'Blush Rose',
      pattern: 'Floral Embroidered',
      formalityLevel: Formality.BLACK_TIE,
      seasons: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      price: 2800.00,
      retailPrice: 3100.00,
      productUrl: 'https://luxury.tatacliq.com/anita-dongre-blush-lehenga/p-wed013',
      imageUrls: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'],
    },
    {
      merchantId: mrPorter.id,
      externalId: 'WED-TUX-014',
      title: 'Grosgrain-Trimmed Three-Piece Tuxedo',
      brand: 'Brunello Cucinelli',
      description: 'Sartorial luxury in extra-fine wool and silk blend with grosgrain peak lapels and matched vest.',
      category: ClothingCategory.OUTERWEAR,
      subCategory: 'Tuxedos & Suiting',
      styleCategory: 'Wedding',
      primaryColorHex: '#141416',
      primaryColorName: 'Obsidian Black',
      pattern: 'Solid',
      formalityLevel: Formality.BLACK_TIE,
      seasons: ['AUTUMN', 'WINTER', 'SPRING'],
      price: 3400.00,
      retailPrice: 3400.00,
      productUrl: 'https://www.mrporter.com/en-us/mens/product/brunello-cucinelli/wool-silk-tuxedo/wed014',
      imageUrls: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'],
    },

    // --- FESTIVE ---
    {
      merchantId: ajioLuxe.id,
      externalId: 'FST-SRI-015',
      title: 'Kadhwa Brocade Pure Silk Sari',
      brand: 'Raw Mango',
      description: 'Heirloom Varanasi handloom silk featuring gold and silver zari intertwining with botanical motifs.',
      category: ClothingCategory.DRESS,
      subCategory: 'Heritage Saris',
      styleCategory: 'Festive',
      primaryColorHex: '#1A4D43',
      primaryColorName: 'Peacock Emerald',
      pattern: 'Brocade',
      formalityLevel: Formality.BUSINESS_FORMAL,
      seasons: ['AUTUMN', 'WINTER', 'SPRING'],
      price: 890.00,
      retailPrice: 950.00,
      productUrl: 'https://luxe.ajio.com/raw-mango-varanasi-sari/p-fst015',
      imageUrls: ['https://images.unsplash.com/photo-1610030469668-9655ec843b01?auto=format&fit=crop&w=800&q=80'],
    },

    // --- STREETWEAR ---
    {
      merchantId: ssense.id,
      externalId: 'STR-HOD-016',
      title: 'Heavyweight Loopback Fleece Hoodie',
      brand: 'Fear of God',
      description: 'Thick vintage-wash American cotton with dropped shoulders, raw hems, and clean tonal silicone branding.',
      category: ClothingCategory.TOP,
      subCategory: 'Sweatshirts & Hoodies',
      styleCategory: 'Streetwear',
      primaryColorHex: '#383838',
      primaryColorName: 'Washed Charcoal',
      pattern: 'Solid',
      formalityLevel: Formality.CASUAL,
      seasons: ['AUTUMN', 'WINTER', 'SPRING'],
      price: 395.00,
      retailPrice: 395.00,
      productUrl: 'https://www.ssense.com/en-us/men/product/fear-of-god/fleece-hoodie/str016',
      imageUrls: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'],
    },
    {
      merchantId: mrPorter.id,
      externalId: 'STR-CRG-017',
      title: 'Cotton-Ripstop Cargo Trousers',
      brand: 'Stone Island',
      description: 'Durable military-grade ripstop treated with double-dye garment wash and signature compass badge.',
      category: ClothingCategory.BOTTOM,
      subCategory: 'Cargo & Tactical',
      styleCategory: 'Streetwear',
      primaryColorHex: '#424C36',
      primaryColorName: 'Military Olive',
      pattern: 'Solid',
      formalityLevel: Formality.CASUAL,
      seasons: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      price: 490.00,
      retailPrice: 490.00,
      productUrl: 'https://www.mrporter.com/en-us/mens/product/stone-island/cargo-trousers/str017',
      imageUrls: ['https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80'],
    },

    // --- SPORTSWEAR ---
    {
      merchantId: netAPorter.id,
      externalId: 'SPT-SET-018',
      title: 'Seamless Ribbed Compression Jumpsuit',
      brand: 'Alo Yoga',
      description: 'Engineered 4-way stretch fabric offering high compression, moisture wicking, and low back crossover straps.',
      category: ClothingCategory.DRESS,
      subCategory: 'Activewear & Bodysuits',
      styleCategory: 'Sportswear',
      primaryColorHex: '#1E1E22',
      primaryColorName: 'Obsidian Black',
      pattern: 'Solid',
      formalityLevel: Formality.CASUAL,
      seasons: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      price: 168.00,
      retailPrice: 168.00,
      productUrl: 'https://www.net-a-porter.com/en-us/shop/product/alo-yoga/compression-jumpsuit/spt018',
      imageUrls: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'],
    },
    {
      merchantId: mrPorter.id,
      externalId: 'SPT-SNK-019',
      title: 'Carbon-Plate Technical Trail Runners',
      brand: 'Nordic Tech',
      description: 'Vibram Megagrip outsole with responsive nitrogen-infused midsole foam for high-traction all-terrain running.',
      category: ClothingCategory.FOOTWEAR,
      subCategory: 'Performance Sneakers',
      styleCategory: 'Sportswear',
      primaryColorHex: '#2E4336',
      primaryColorName: 'Spruce Forest',
      pattern: 'Solid',
      formalityLevel: Formality.CASUAL,
      seasons: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      price: 240.00,
      retailPrice: 260.00,
      productUrl: 'https://www.mrporter.com/en-us/mens/product/nordic-tech/trail-runner/spt019',
      imageUrls: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
    },
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: {
        merchantId_externalId: {
          merchantId: prod.merchantId,
          externalId: prod.externalId,
        },
      },
      update: prod,
      create: prod,
    });
  }

  // 3. Seed Demo Accounts Safe & Compliant
  // Requirement:
  // - "Demo Girl Account" (demo.girl@closetiq.fashion / DemoGirl@2026!)
  // - "Demo Boy Account" (demo.boy@closetiq.fashion / DemoBoy@2026!)
  // - Both demo users must initially have an EMPTY or INCOMPLETE personal style profile to test onboarding!
  // - Do NOT prefill their body measurements, skin-tone information, or photographs.

  console.log('Seeding Demo Girl and Demo Boy accounts with clean, un-prefilled onboarding profiles...');

  // Password hashes pre-generated with bcrypt round 12:
  const demoGirlPasswordHash = '$2a$12$SR41SADrmXHFwk25n9jASO/IWylB8ub5Flq5QLjt6iR2NnnUh76oy'; // DemoGirl@2026!
  const demoBoyPasswordHash = '$2a$12$xjUnV/csTAVgKCt4VJL8rO3y6x3/ouFjBxMBE3AEzrjmXLuQU9IPu';  // DemoBoy@2026!

  const demoGirl = await prisma.user.upsert({
    where: { email: 'demo.girl@closetiq.fashion' },
    update: {},
    create: {
      email: 'demo.girl@closetiq.fashion',
      passwordHash: demoGirlPasswordHash,
      role: Role.USER,
      isVerified: true,
      profile: {
        create: {
          fullName: 'Aria Vance',
          genderPreference: 'WOMENSWEAR',
          heightCm: null,
          bustChestCm: null,
          waistCm: null,
          hipCm: null,
          budgetTier: 2,
          bodyShapeEstimated: BodyShape.UNSPECIFIED,
          bodyShapeConfirmed: BodyShape.UNSPECIFIED,
          undertoneEstimated: Undertone.UNSPECIFIED,
          undertoneConfirmed: Undertone.UNSPECIFIED,
          seasonalPalette: SeasonalPalette.UNSPECIFIED,
          styleKeywords: [],
          avoidColors: [],
          preferredBrands: [],
          preferredCategories: [],
          preferredOccasions: [],
          sizeTop: null,
          sizeBottom: null,
          sizeShoes: null,
        },
      },
    },
    include: { profile: true },
  });

  const demoBoy = await prisma.user.upsert({
    where: { email: 'demo.boy@closetiq.fashion' },
    update: {},
    create: {
      email: 'demo.boy@closetiq.fashion',
      passwordHash: demoBoyPasswordHash,
      role: Role.USER,
      isVerified: true,
      profile: {
        create: {
          fullName: 'Leo Sterling',
          genderPreference: 'MENSWEAR',
          heightCm: null,
          bustChestCm: null,
          waistCm: null,
          hipCm: null,
          budgetTier: 2,
          bodyShapeEstimated: BodyShape.UNSPECIFIED,
          bodyShapeConfirmed: BodyShape.UNSPECIFIED,
          undertoneEstimated: Undertone.UNSPECIFIED,
          undertoneConfirmed: Undertone.UNSPECIFIED,
          seasonalPalette: SeasonalPalette.UNSPECIFIED,
          styleKeywords: [],
          avoidColors: [],
          preferredBrands: [],
          preferredCategories: [],
          preferredOccasions: [],
          sizeTop: null,
          sizeBottom: null,
          sizeShoes: null,
        },
      },
    },
    include: { profile: true },
  });

  console.log(`Demo accounts created:
  - Demo Girl: ${demoGirl.email}
  - Demo Boy:  ${demoBoy.email}`);

  console.log('--- Database Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
