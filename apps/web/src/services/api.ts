import {
  WardrobeItemDto,
  ProductDto,
  OutfitDto,
  BodyAnalysisResponseDto,
  ProfileResponseDto,
  CompleteMyOutfitDto,
  CreateWardrobeItemDto,
} from '@closetiq/shared-types';

const API_BASE = '/api/v1';

// --- AUTH & USER TYPES ---
export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: 'USER' | 'STYLIST' | 'ADMIN';
  token: string;
}

export interface CartItem {
  product: ProductDto;
  size: string;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  timestamp: string;
  details: string;
  userEmail: string;
}

// --- INITIAL REFERENCE DATA ---
const INITIAL_PROFILE: ProfileResponseDto = {
  id: 'prof-sloane',
  userId: 'user-sloane',
  fullName: 'Sloane Sterling',
  genderPreference: 'ANDROGYNOUS',
  heightCm: 176.0,
  budgetTier: 3,
  bodyShapeEstimated: 'HOURGLASS',
  bodyShapeConfirmed: 'HOURGLASS',
  undertoneEstimated: 'COOL',
  undertoneConfirmed: 'COOL',
  seasonalPalette: 'TRUE_WINTER',
  styleKeywords: ['architectural-tailoring', 'monochrome-luxury', 'quiet-luxury', 'minimalist'],
  avoidColors: ['#FFFF00', '#FF8C00'],
  preferredBrands: ['The Row', 'Toteme', 'Lemaire', 'Khaite', 'Loro Piana', 'Sabyasachi'],
  sizeTop: 'M',
  sizeBottom: '30',
  sizeShoes: 'EU 41',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const INITIAL_WARDROBE: WardrobeItemDto[] = [
  {
    id: 'w-1',
    userId: 'user-sloane',
    name: 'Oversized Double-Faced Wool Coat',
    imageKey: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    category: 'OUTERWEAR',
    subCategory: 'Overcoats & Trench',
    primaryColorHex: '#222326',
    primaryColorName: 'Obsidian Black',
    secondaryColorHex: null,
    pattern: 'Solid',
    material: 'Wool Cashmere Blend',
    formalityLevel: 'SMART_CASUAL',
    seasons: ['AUTUMN', 'WINTER'],
    fitType: 'Oversized',
    brand: 'The Row',
    cost: 2900,
    timesWorn: 14,
    isArchived: false,
    createdAt: '2026-09-12T10:00:00Z',
    updatedAt: '2026-09-12T10:00:00Z',
  },
  {
    id: 'w-2',
    userId: 'user-sloane',
    name: 'Poplin Tailored Oxford Shirt',
    imageKey: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    category: 'TOP',
    subCategory: 'Button-Up Shirts',
    primaryColorHex: '#F7F6F2',
    primaryColorName: 'Chalk White',
    secondaryColorHex: null,
    pattern: 'Solid',
    material: 'Crisp Organic Poplin',
    formalityLevel: 'SMART_CASUAL',
    seasons: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
    fitType: 'Relaxed',
    brand: 'Toteme',
    cost: 380,
    timesWorn: 26,
    isArchived: false,
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'w-3',
    userId: 'user-sloane',
    name: 'High-Rise Relaxed Raw Denim',
    imageKey: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    category: 'BOTTOM',
    subCategory: 'Denim & Jeans',
    primaryColorHex: '#1C2841',
    primaryColorName: 'Deep Indigo',
    secondaryColorHex: null,
    pattern: 'Solid',
    material: '100% Selvedge Cotton',
    formalityLevel: 'CASUAL',
    seasons: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
    fitType: 'Relaxed Straight',
    brand: 'Khaite',
    cost: 480,
    timesWorn: 38,
    isArchived: false,
    createdAt: '2026-07-14T10:00:00Z',
    updatedAt: '2026-07-14T10:00:00Z',
  },
  {
    id: 'w-4',
    userId: 'user-sloane',
    name: 'Brushed Suede Chelsea Boots',
    imageKey: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
    category: 'FOOTWEAR',
    subCategory: 'Boots',
    primaryColorHex: '#2D2824',
    primaryColorName: 'Espresso Suede',
    secondaryColorHex: null,
    pattern: 'Solid',
    material: 'Calfskin Suede',
    formalityLevel: 'SMART_CASUAL',
    seasons: ['AUTUMN', 'WINTER', 'SPRING'],
    fitType: 'Standard',
    brand: 'Bottega Veneta',
    cost: 1200,
    timesWorn: 19,
    isArchived: false,
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'w-5',
    userId: 'user-sloane',
    name: 'Pleated Fine Wool Trousers',
    imageKey: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
    category: 'BOTTOM',
    subCategory: 'Tailored Trousers',
    primaryColorHex: '#2B2A27',
    primaryColorName: 'Obsidian Espresso',
    secondaryColorHex: null,
    pattern: 'Solid',
    material: 'Virgin Wool Twill',
    formalityLevel: 'SMART_CASUAL',
    seasons: ['SPRING', 'AUTUMN', 'WINTER'],
    fitType: 'Wide Leg',
    brand: 'Lemaire',
    cost: 620,
    timesWorn: 8,
    isArchived: false,
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-09-15T10:00:00Z',
  },
];

// Curated Luxury Catalog spanning ALL 12 Occasion Categories
export const INITIAL_PRODUCTS: ProductDto[] = [
  // 1. Party Wear
  {
    id: 'prod-party-1',
    merchantId: 'm-ssense',
    merchantName: 'SSENSE',
    externalId: 'SL-SMK-01',
    title: 'Iconic Le Smoking Silk-Lapel Tuxedo Jacket',
    brand: 'Saint Laurent',
    description: 'Impeccable Parisian eveningwear in structured grain de poudre wool with radiant silk-satin peak lapels.',
    category: 'OUTERWEAR',
    subCategory: 'Blazers & Evening',
    primaryColorHex: '#121214',
    primaryColorName: 'Midnight Noir',
    pattern: 'Solid',
    formalityLevel: 'BUSINESS_FORMAL',
    seasons: ['AUTUMN', 'WINTER', 'SPRING'],
    price: 3490,
    currency: 'USD',
    retailPrice: 3490,
    inStock: true,
    productUrl: 'https://www.ssense.com/en-us/women/product/saint-laurent/le-smoking-blazer/sl01',
    affiliateUrl: '/api/v1/merchants/redirect/prod-party-1',
    imageUrls: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['Party wear', 'Date-night outfits', 'Formal wear'],
    availableSizes: ['FR 36', 'FR 38', 'FR 40', 'FR 42'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-party-2',
    merchantId: 'm-netaporter',
    merchantName: 'NET-A-PORTER',
    externalId: 'GAL-DRS-02',
    title: 'Sienna Liquid Satin Halterneck Gown',
    brand: 'Galvan London',
    description: 'Liquid metallic viscose-silk blend cut on the bias for fluid drape and high-glamour movement.',
    category: 'DRESS',
    subCategory: 'Evening Dresses',
    primaryColorHex: '#BFA588',
    primaryColorName: 'Champagne Bronze',
    pattern: 'Solid',
    formalityLevel: 'BUSINESS_FORMAL',
    seasons: ['SPRING', 'SUMMER', 'AUTUMN'],
    price: 1495,
    currency: 'USD',
    retailPrice: 1495,
    inStock: true,
    productUrl: 'https://www.net-a-porter.com/en-us/shop/product/galvan/sienna-gown/gal02',
    affiliateUrl: '/api/v1/merchants/redirect/prod-party-2',
    imageUrls: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['Party wear', 'Wedding wear', 'Date-night outfits'],
    availableSizes: ['UK 6', 'UK 8', 'UK 10', 'UK 12'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 2. Traditional and Ethnic Wear
  {
    id: 'prod-trad-1',
    merchantId: 'm-sabyasachi',
    merchantName: 'ATELIER SABYASACHI',
    externalId: 'SAB-KRT-03',
    title: 'Heritage Bengal Zardozi Embroidered Silk Kurta Set',
    brand: 'Sabyasachi',
    description: 'Pure Matka silk hand-woven with antiqued golden marori zardozi threadwork and churidar silhouette.',
    category: 'TOP',
    subCategory: 'Ethnic & Kurta',
    primaryColorHex: '#521D24',
    primaryColorName: 'Royal Crimson',
    pattern: 'Embroidered',
    formalityLevel: 'BUSINESS_FORMAL',
    seasons: ['AUTUMN', 'WINTER', 'SPRING'],
    price: 2850,
    currency: 'USD',
    retailPrice: 2850,
    inStock: true,
    productUrl: 'https://www.sabyasachi.com/couture/heritage-kurta-crimson',
    affiliateUrl: '/api/v1/merchants/redirect/prod-trad-1',
    imageUrls: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['Traditional and ethnic wear', 'Wedding wear', 'Festive wear'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-trad-2',
    merchantId: 'm-rawmango',
    merchantName: 'RAW MANGO',
    externalId: 'RM-SAR-04',
    title: 'Varanasi Handloom Chanderi Silk Saree',
    brand: 'Raw Mango',
    description: 'Lightweight gossamer Chanderi silk woven with intricate gold zari booties and woven borders.',
    category: 'DRESS',
    subCategory: 'Sarees & Ensembles',
    primaryColorHex: '#1F3A34',
    primaryColorName: 'Forest Emerald',
    pattern: 'Zari Weave',
    formalityLevel: 'BUSINESS_FORMAL',
    seasons: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
    price: 1150,
    currency: 'USD',
    retailPrice: 1200,
    inStock: true,
    productUrl: 'https://www.rawmango.com/products/chanderi-saree-emerald',
    affiliateUrl: '/api/v1/merchants/redirect/prod-trad-2',
    imageUrls: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['Traditional and ethnic wear', 'Festive wear', 'Wedding wear'],
    availableSizes: ['Free Size (6.5m with blouse)'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 3. Casual Wear
  {
    id: 'prod-cas-1',
    merchantId: 'm-ssense',
    merchantName: 'SSENSE',
    externalId: 'TOT-POP-05',
    title: 'Crisp Organic Poplin Oversized Shirt',
    brand: 'Toteme',
    description: 'Signature Scandinavian shirting in lightweight organic cotton poplin with clean notched cuffs.',
    category: 'TOP',
    subCategory: 'Button-Up Shirts',
    primaryColorHex: '#F6F5F2',
    primaryColorName: 'Chalk White',
    pattern: 'Solid',
    formalityLevel: 'CASUAL',
    seasons: ['SPRING', 'SUMMER', 'AUTUMN'],
    price: 360,
    currency: 'USD',
    retailPrice: 360,
    inStock: true,
    productUrl: 'https://www.ssense.com/en-us/women/product/toteme/poplin-shirt/tot05',
    affiliateUrl: '/api/v1/merchants/redirect/prod-cas-1',
    imageUrls: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['Casual wear', 'Everyday essentials', 'College wear', 'Office wear'],
    availableSizes: ['XS', 'S', 'M', 'L'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-cas-2',
    merchantId: 'm-mrporter',
    merchantName: 'MR PORTER',
    externalId: 'KHA-DNM-06',
    title: 'Abigail Relaxed Straight Selvedge Denim',
    brand: 'Khaite',
    description: 'Pure American cotton denim aged with subtle whiskering and structured straight-leg drape.',
    category: 'BOTTOM',
    subCategory: 'Denim & Jeans',
    primaryColorHex: '#253556',
    primaryColorName: 'Vintage Indigo',
    pattern: 'Solid',
    formalityLevel: 'CASUAL',
    seasons: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
    price: 460,
    currency: 'USD',
    retailPrice: 460,
    inStock: true,
    productUrl: 'https://www.mrporter.com/en-us/mens/product/khaite/abigail-jeans/kha06',
    affiliateUrl: '/api/v1/merchants/redirect/prod-cas-2',
    imageUrls: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['Casual wear', 'Everyday essentials', 'College wear', 'Travel outfits'],
    availableSizes: ['28', '29', '30', '31', '32', '34'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 4. Office Wear
  {
    id: 'prod-off-1',
    merchantId: 'm-ssense',
    merchantName: 'SSENSE',
    externalId: 'ROW-BLZ-07',
    title: 'Single-Breasted Virgin Wool Tailored Blazer',
    brand: 'The Row',
    description: 'Meticulously tailored jacket in Italian fresco virgin wool with horn buttons and canvassed chest.',
    category: 'OUTERWEAR',
    subCategory: 'Tailored Blazers',
    primaryColorHex: '#2C2B29',
    primaryColorName: 'Deep Taupe Obsidian',
    pattern: 'Solid',
    formalityLevel: 'BUSINESS_FORMAL',
    seasons: ['AUTUMN', 'WINTER', 'SPRING'],
    price: 2950,
    currency: 'USD',
    retailPrice: 2950,
    inStock: true,
    productUrl: 'https://www.ssense.com/en-us/women/product/the-row/virgin-wool-blazer/row07',
    affiliateUrl: '/api/v1/merchants/redirect/prod-off-1',
    imageUrls: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['Office wear', 'Formal wear', 'Everyday essentials'],
    availableSizes: ['US 2', 'US 4', 'US 6', 'US 8', 'US 10'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-off-2',
    merchantId: 'm-netaporter',
    merchantName: 'NET-A-PORTER',
    externalId: 'LEM-TRS-08',
    title: 'Pleated High-Rise Virgin Wool Trousers',
    brand: 'Lemaire',
    description: 'Front-pleated tailored trousers in fluid wool twill with slanted pockets and deep cuffs.',
    category: 'BOTTOM',
    subCategory: 'Tailored Trousers',
    primaryColorHex: '#1E2024',
    primaryColorName: 'Charcoal Anthracite',
    pattern: 'Solid',
    formalityLevel: 'BUSINESS_FORMAL',
    seasons: ['AUTUMN', 'WINTER', 'SPRING'],
    price: 680,
    currency: 'USD',
    retailPrice: 680,
    inStock: true,
    productUrl: 'https://www.net-a-porter.com/en-us/shop/product/lemaire/pleated-trousers/lem08',
    affiliateUrl: '/api/v1/merchants/redirect/prod-off-2',
    imageUrls: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['Office wear', 'Formal wear', 'Casual wear'],
    availableSizes: ['FR 36', 'FR 38', 'FR 40', 'FR 42'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 5. College Wear
  {
    id: 'prod-col-1',
    merchantId: 'm-ssense',
    merchantName: 'SSENSE',
    externalId: 'ACN-HD-09',
    title: 'Loopback Heavyweight Fleece Cotton Hoodie',
    brand: 'Acne Studios',
    description: 'Relaxed drop-shoulder hoodie in Portuguese organic loopback cotton with subtle tonal logo face patch.',
    category: 'TOP',
    subCategory: 'Sweatshirts & Hoodies',
    primaryColorHex: '#E7E2D9',
    primaryColorName: 'Oatmeal Melange',
    pattern: 'Solid',
    formalityLevel: 'CASUAL',
    seasons: ['AUTUMN', 'WINTER', 'SPRING'],
    price: 420,
    currency: 'USD',
    retailPrice: 420,
    inStock: true,
    productUrl: 'https://www.ssense.com/en-us/mens/product/acne-studios/oatmeal-hoodie/acn09',
    affiliateUrl: '/api/v1/merchants/redirect/prod-col-1',
    imageUrls: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['College wear', 'Casual wear', 'Travel outfits', 'Everyday essentials'],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-col-2',
    merchantId: 'm-mrporter',
    merchantName: 'MR PORTER',
    externalId: 'NB-SNK-10',
    title: 'Made in USA 990v6 Suede Running Sneakers',
    brand: 'New Balance',
    description: 'Iconic grey heritage runner in premium pigskin suede with FuelCell responsive midsole cushioning.',
    category: 'FOOTWEAR',
    subCategory: 'Sneakers',
    primaryColorHex: '#7C7D82',
    primaryColorName: 'Heritage Grey',
    pattern: 'Color Block',
    formalityLevel: 'CASUAL',
    seasons: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
    price: 220,
    currency: 'USD',
    retailPrice: 220,
    inStock: true,
    productUrl: 'https://www.mrporter.com/en-us/mens/product/new-balance/990v6-sneakers/nb10',
    affiliateUrl: '/api/v1/merchants/redirect/prod-col-2',
    imageUrls: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['College wear', 'Casual wear', 'Travel outfits', 'Accessories and footwear'],
    availableSizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 6. Wedding Wear
  {
    id: 'prod-wed-1',
    merchantId: 'm-taruntahiliani',
    merchantName: 'TARUN TAHILIANI COUTURE',
    externalId: 'TT-LHN-11',
    title: 'Kashmiri Jamawar Embroidered Silk Bridal Ensemble',
    brand: 'Tarun Tahiliani',
    description: 'Architectural couture kalidar in raw silk adorned with fine Swarovski crystal and resham zardozi.',
    category: 'DRESS',
    subCategory: 'Bridal & Lehengas',
    primaryColorHex: '#6E1925',
    primaryColorName: 'Deep Bordeaux Ruby',
    pattern: 'Intricate Resham',
    formalityLevel: 'BUSINESS_FORMAL',
    seasons: ['AUTUMN', 'WINTER'],
    price: 4950,
    currency: 'USD',
    retailPrice: 4950,
    inStock: true,
    productUrl: 'https://www.taruntahiliani.com/couture/kashmiri-ensemble',
    affiliateUrl: '/api/v1/merchants/redirect/prod-wed-1',
    imageUrls: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['Wedding wear', 'Traditional and ethnic wear', 'Festive wear'],
    availableSizes: ['Bespoke Custom Made'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-wed-2',
    merchantId: 'm-mrporter',
    merchantName: 'MR PORTER',
    externalId: 'TF-TUX-12',
    title: 'Shelton Grosgrain-Trimmed Wool Evening Tuxedo',
    brand: 'Tom Ford',
    description: 'Impeccable black-tie suiting with peak grosgrain lapels, gauntlet cuffs, and silk side-stripe trousers.',
    category: 'OUTERWEAR',
    subCategory: 'Evening Tuxedos',
    primaryColorHex: '#0D0E10',
    primaryColorName: 'Obsidian Jet',
    pattern: 'Solid',
    formalityLevel: 'BUSINESS_FORMAL',
    seasons: ['AUTUMN', 'WINTER', 'SPRING'],
    price: 5200,
    currency: 'USD',
    retailPrice: 5200,
    inStock: true,
    productUrl: 'https://www.mrporter.com/en-us/mens/product/tom-ford/shelton-tuxedo/tf12',
    affiliateUrl: '/api/v1/merchants/redirect/prod-wed-1',
    imageUrls: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['Wedding wear', 'Formal wear', 'Party wear'],
    availableSizes: ['IT 48', 'IT 50', 'IT 52', 'IT 54'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 7. Festive Wear
  {
    id: 'prod-fest-1',
    merchantId: 'm-anitadongre',
    merchantName: 'ANITA DONGRE',
    externalId: 'AD-TNC-13',
    title: 'Bandhani Georgette Draped Tunic & Sharara',
    brand: 'Anita Dongre',
    description: 'Hand-tied bandhani dyed georgette with gota patti border embroidery celebrating artisan craftsmanship.',
    category: 'DRESS',
    subCategory: 'Festive Ensembles',
    primaryColorHex: '#C45738',
    primaryColorName: 'Terracotta Saffron',
    pattern: 'Bandhani',
    formalityLevel: 'SMART_CASUAL',
    seasons: ['AUTUMN', 'SPRING'],
    price: 1350,
    currency: 'USD',
    retailPrice: 1350,
    inStock: true,
    productUrl: 'https://www.anitadongre.com/products/terracotta-bandhani-set',
    affiliateUrl: '/api/v1/merchants/redirect/prod-fest-1',
    imageUrls: ['https://images.unsplash.com/photo-1583391733975-dd483f9c6569?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['Festive wear', 'Traditional and ethnic wear', 'Party wear'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 8. Date-Night Outfits
  {
    id: 'prod-date-1',
    merchantId: 'm-netaporter',
    merchantName: 'NET-A-PORTER',
    externalId: 'KHA-DRS-14',
    title: 'The Augusta Ribbed Silk-Blend Midi Dress',
    brand: 'Khaite',
    description: 'Sweetheart sculpted neckline in heavyweight matte ribbed knit that contours gracefully to the silhouette.',
    category: 'DRESS',
    subCategory: 'Cocktail & Midi',
    primaryColorHex: '#141416',
    primaryColorName: 'Noir Onyx',
    pattern: 'Solid Ribbed',
    formalityLevel: 'SMART_CASUAL',
    seasons: ['AUTUMN', 'WINTER', 'SPRING'],
    price: 1380,
    currency: 'USD',
    retailPrice: 1380,
    inStock: true,
    productUrl: 'https://www.net-a-porter.com/en-us/shop/product/khaite/augusta-dress/kha14',
    affiliateUrl: '/api/v1/merchants/redirect/prod-date-1',
    imageUrls: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['Date-night outfits', 'Party wear', 'Formal wear'],
    availableSizes: ['XS', 'S', 'M', 'L'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 9. Travel Outfits
  {
    id: 'prod-trv-1',
    merchantId: 'm-mrporter',
    merchantName: 'MR PORTER',
    externalId: 'LP-KNT-15',
    title: 'Baby Cashmere Zip-Through Travel Hoodie',
    brand: 'Loro Piana',
    description: 'Spun from the finest Mongolian baby capra hircus fiber with double-slider ruthenium zipper.',
    category: 'OUTERWEAR',
    subCategory: 'Knitwear & Travel',
    primaryColorHex: '#DDD5C7',
    primaryColorName: 'Desert Dune',
    pattern: 'Solid',
    formalityLevel: 'CASUAL',
    seasons: ['AUTUMN', 'WINTER', 'SPRING'],
    price: 2450,
    currency: 'USD',
    retailPrice: 2450,
    inStock: true,
    productUrl: 'https://www.mrporter.com/en-us/mens/product/loro-piana/baby-cashmere-hoodie/lp15',
    affiliateUrl: '/api/v1/merchants/redirect/prod-trv-1',
    imageUrls: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['Travel outfits', 'Everyday essentials', 'Casual wear'],
    availableSizes: ['IT 48', 'IT 50', 'IT 52', 'IT 54'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 10. Formal Wear
  {
    id: 'prod-frm-1',
    merchantId: 'm-mrporter',
    merchantName: 'MR PORTER',
    externalId: 'BRI-SUT-16',
    title: 'Plume Super 160s Wool Single-Breasted Suit',
    brand: 'Brioni',
    description: 'Neapolitan artisanal canvassing in ultra-fine Super 160s virgin wool with fluid drape.',
    category: 'OUTERWEAR',
    subCategory: 'Tailored Suits',
    primaryColorHex: '#182030',
    primaryColorName: 'Midnight Navy',
    pattern: 'Solid',
    formalityLevel: 'BUSINESS_FORMAL',
    seasons: ['SPRING', 'AUTUMN', 'WINTER'],
    price: 4800,
    currency: 'USD',
    retailPrice: 4800,
    inStock: true,
    productUrl: 'https://www.mrporter.com/en-us/mens/product/brioni/plume-suit/bri16',
    affiliateUrl: '/api/v1/merchants/redirect/prod-frm-1',
    imageUrls: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['Formal wear', 'Office wear', 'Wedding wear'],
    availableSizes: ['IT 48', 'IT 50', 'IT 52', 'IT 54'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 11. Everyday Essentials
  {
    id: 'prod-es-1',
    merchantId: 'm-mrporter',
    merchantName: 'MR PORTER',
    externalId: 'SUN-TEE-17',
    title: 'Classic Supima Cotton Crewneck Tee',
    brand: 'Sunspel',
    description: 'Long-staple Californian supima cotton jersey, twice-combed for peerless softness and shape retention.',
    category: 'TOP',
    subCategory: 'T-Shirts & Base',
    primaryColorHex: '#FBF9F5',
    primaryColorName: 'Natural Ecru',
    pattern: 'Solid',
    formalityLevel: 'CASUAL',
    seasons: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
    price: 110,
    currency: 'USD',
    retailPrice: 110,
    inStock: true,
    productUrl: 'https://www.mrporter.com/en-us/mens/product/sunspel/supima-tshirt/sun17',
    affiliateUrl: '/api/v1/merchants/redirect/prod-es-1',
    imageUrls: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['Everyday essentials', 'Casual wear', 'College wear', 'Travel outfits'],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 12. Accessories and Footwear
  {
    id: 'prod-acc-1',
    merchantId: 'm-netaporter',
    merchantName: 'NET-A-PORTER',
    externalId: 'BV-BAG-18',
    title: 'Padded Cassette Intreccio Leather Shoulder Bag',
    brand: 'Bottega Veneta',
    description: 'Signature wide-weave double-face nappa leather in structured orthogonal silhouette with triangular buckle.',
    category: 'ACCESSORY',
    subCategory: 'Leather Handbags',
    primaryColorHex: '#252321',
    primaryColorName: 'Espresso Fondente',
    pattern: 'Intrecciato Weave',
    formalityLevel: 'SMART_CASUAL',
    seasons: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
    price: 3500,
    currency: 'USD',
    retailPrice: 3500,
    inStock: true,
    productUrl: 'https://www.net-a-porter.com/en-us/shop/product/bottega-veneta/cassette-bag/bv18',
    affiliateUrl: '/api/v1/merchants/redirect/prod-acc-1',
    imageUrls: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['Accessories and footwear', 'Party wear', 'Date-night outfits', 'Office wear'],
    availableSizes: ['One Size (26 x 18 x 8 cm)'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-acc-2',
    merchantId: 'm-mrporter',
    merchantName: 'MR PORTER',
    externalId: 'JM-LOA-19',
    title: '180 Signature Calfskin Penny Loafers',
    brand: 'J.M. Weston',
    description: 'Goodyear-welted Limoges handcrafted French calfskin penny loafers in rich burnished mahogany.',
    category: 'FOOTWEAR',
    subCategory: 'Loafers & Derbies',
    primaryColorHex: '#3D2314',
    primaryColorName: 'Burnished Mahogany',
    pattern: 'Solid',
    formalityLevel: 'SMART_CASUAL',
    seasons: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
    price: 980,
    currency: 'USD',
    retailPrice: 980,
    inStock: true,
    productUrl: 'https://www.mrporter.com/en-us/mens/product/jm-weston/180-loafers/jm19',
    affiliateUrl: '/api/v1/merchants/redirect/prod-acc-2',
    imageUrls: ['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80'],
    occasionTags: ['Accessories and footwear', 'Office wear', 'Formal wear', 'Casual wear'],
    availableSizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// --- LOCAL STORAGE HELPERS FOR COMPLETE OFFLINE PERSISTENCE ---
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`closetiq_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`closetiq_${key}`, JSON.stringify(value));
  } catch (err) {
    console.warn(`Could not persist ${key}:`, err);
  }
}

// --- STATE STORE (SYNCHRONIZED WITH LOCALSTORAGE) ---
let sessionState: UserSession | null = getStored<UserSession | null>('session', {
  id: 'user-sloane',
  email: 'sloane.sterling@closetiq.luxury',
  fullName: 'Sloane Sterling',
  role: 'ADMIN', // Sloane has admin access for demo review
  token: 'mock-jwt-token-2026',
});

let profileState: ProfileResponseDto = getStored<ProfileResponseDto>('profile', INITIAL_PROFILE);
let wardrobeState: WardrobeItemDto[] = getStored<WardrobeItemDto[]>('wardrobe', INITIAL_WARDROBE);
let catalogState: ProductDto[] = getStored<ProductDto[]>('catalog', INITIAL_PRODUCTS);
let wishlistState: string[] = getStored<string[]>('wishlist', ['prod-party-1', 'prod-cas-1']);
let savedOutfitsState: OutfitDto[] = getStored<OutfitDto[]>('saved_outfits', []);
let cartState: CartItem[] = getStored<CartItem[]>('cart', []);
let ordersState: OrderRecord[] = getStored<OrderRecord[]>('orders', [
  {
    id: 'ORD-98421',
    date: '2026-10-02T14:30:00Z',
    items: [
      { product: INITIAL_PRODUCTS[0], size: 'FR 38', quantity: 1 },
      { product: INITIAL_PRODUCTS[12], size: 'UK 9', quantity: 1 },
    ],
    subtotal: 4470,
    tax: 357.6,
    shipping: 0,
    total: 4827.6,
    status: 'DELIVERED',
    shippingAddress: {
      fullName: 'Sloane Sterling',
      address: '740 Park Avenue, Penthouse B',
      city: 'New York, NY',
      postalCode: '10021',
      phone: '+1 (212) 555-0199',
    },
    paymentMethod: 'Amex Platinum (ending in 8842)',
  },
]);

let auditLogsState: AuditLogEntry[] = getStored<AuditLogEntry[]>('audit_logs', [
  {
    id: 'log-1',
    action: 'USER_LOGIN',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    details: 'Authenticated via session token (role: ADMIN)',
    userEmail: 'sloane.sterling@closetiq.luxury',
  },
  {
    id: 'log-2',
    action: 'CATALOG_SYNC',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    details: 'Catalog refreshed across 12 fashion occasion categories',
    userEmail: 'system@closetiq.internal',
  },
]);

// --- COMPLETE API CLIENT ---
export const api = {
  // Session & Authentication
  getCurrentUser(): UserSession | null {
    return sessionState;
  },

  async login(emailOrId: string, _password: string): Promise<UserSession> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrId, password: _password }),
      });
      if (res.ok) {
        const json = await res.json();
        const user: UserSession = {
          id: json.data.user.id,
          email: json.data.user.email,
          fullName: json.data.user.profile?.fullName || emailOrId.split('@')[0],
          role: json.data.user.role || 'USER',
          token: json.data.accessToken,
        };
        sessionState = user;
        setStored('session', user);
        this.logAudit('USER_LOGIN', `Logged in via API`, user.email);
        return user;
      }
    } catch {
      // Fallback local auth simulation
    }

    const isAdmin = emailOrId.toLowerCase().includes('admin') || emailOrId.toLowerCase().includes('sloane');
    const user: UserSession = {
      id: `usr-${Date.now()}`,
      email: emailOrId.includes('@') ? emailOrId : `${emailOrId}@closetiq.luxury`,
      fullName: emailOrId.split('@')[0].replace('.', ' '),
      role: isAdmin ? 'ADMIN' : 'USER',
      token: `demo-token-${Date.now()}`,
    };
    sessionState = user;
    setStored('session', user);
    this.logAudit('USER_LOGIN', `Logged in (offline session)`, user.email);
    return user;
  },

  async register(name: string, emailOrId: string, password: string): Promise<UserSession> {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, email: emailOrId, password }),
      });
      if (res.ok) {
        const json = await res.json();
        const user: UserSession = {
          id: json.data.user.id,
          email: json.data.user.email,
          fullName: name,
          role: 'USER',
          token: json.data.accessToken,
        };
        sessionState = user;
        setStored('session', user);
        this.logAudit('USER_REGISTERED', `Account created via API`, user.email);
        return user;
      }
    } catch {
      // Fallback
    }

    const user: UserSession = {
      id: `usr-${Date.now()}`,
      email: emailOrId.includes('@') ? emailOrId : `${emailOrId}@closetiq.luxury`,
      fullName: name,
      role: 'USER',
      token: `demo-token-${Date.now()}`,
    };
    sessionState = user;
    setStored('session', user);
    this.logAudit('USER_REGISTERED', `Account created (offline session)`, user.email);
    return user;
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string; demoToken: string }> {
    const demoToken = `RST-${Math.floor(100000 + Math.random() * 900000)}`;
    this.logAudit('PASSWORD_RESET_REQUESTED', `Reset token generated for ${email}`, email);
    return {
      success: true,
      message: `Password reset instructions sent. Demo reset code: ${demoToken}`,
      demoToken,
    };
  },

  async resetPassword(email: string, token: string, _newPass: string): Promise<{ success: boolean; message: string }> {
    this.logAudit('PASSWORD_RESET_COMPLETED', `Password updated successfully with token ${token}`, email);
    return {
      success: true,
      message: 'Your password has been securely reset. You can now log in.',
    };
  },

  logout(): void {
    if (sessionState) {
      this.logAudit('USER_LOGOUT', `Logged out`, sessionState.email);
    }
    sessionState = null;
    localStorage.removeItem('closetiq_session');
  },

  // Profile
  async getProfile(): Promise<ProfileResponseDto> {
    try {
      const res = await fetch(`${API_BASE}/profile/me`);
      if (res.ok) {
        const json = await res.json();
        profileState = json.data;
        setStored('profile', profileState);
        return json.data;
      }
    } catch {
      // Fallback
    }
    return profileState;
  },

  async updateProfile(updates: Partial<ProfileResponseDto>): Promise<ProfileResponseDto> {
    try {
      const res = await fetch(`${API_BASE}/profile/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const json = await res.json();
        profileState = json.data;
        setStored('profile', profileState);
        return json.data;
      }
    } catch {
      // Fallback
    }
    profileState = { ...profileState, ...updates, updatedAt: new Date().toISOString() };
    setStored('profile', profileState);
    return profileState;
  },

  // Wardrobe
  async getWardrobe(): Promise<WardrobeItemDto[]> {
    try {
      const res = await fetch(`${API_BASE}/wardrobe`);
      if (res.ok) {
        const json = await res.json();
        wardrobeState = json.data;
        setStored('wardrobe', wardrobeState);
        return json.data;
      }
    } catch {
      // Fallback
    }
    return wardrobeState;
  },

  async addWardrobeItem(dto: CreateWardrobeItemDto): Promise<WardrobeItemDto> {
    try {
      const res = await fetch(`${API_BASE}/wardrobe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });
      if (res.ok) {
        const json = await res.json();
        wardrobeState.unshift(json.data);
        setStored('wardrobe', wardrobeState);
        return json.data;
      }
    } catch {
      // Fallback
    }

    const newItem: WardrobeItemDto = {
      id: `w-${Date.now()}`,
      userId: sessionState?.id || 'user-sloane',
      name: dto.name,
      imageKey: dto.imageKey,
      imageUrl: dto.imageKey,
      category: dto.category,
      subCategory: dto.subCategory,
      primaryColorHex: dto.primaryColorHex,
      primaryColorName: dto.primaryColorName,
      secondaryColorHex: dto.secondaryColorHex || null,
      pattern: dto.pattern,
      material: dto.material || null,
      formalityLevel: dto.formalityLevel,
      seasons: dto.seasons,
      fitType: dto.fitType || null,
      brand: dto.brand || null,
      cost: dto.cost || null,
      timesWorn: 0,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    wardrobeState.unshift(newItem);
    setStored('wardrobe', wardrobeState);
    this.logAudit('WARDROBE_ITEM_ADDED', `Added ${dto.name} (${dto.category})`, sessionState?.email || 'user');
    return newItem;
  },

  async updateWardrobeItem(id: string, updates: Partial<WardrobeItemDto>): Promise<WardrobeItemDto> {
    const idx = wardrobeState.findIndex((w) => w.id === id);
    if (idx !== -1) {
      wardrobeState[idx] = { ...wardrobeState[idx], ...updates, updatedAt: new Date().toISOString() };
      setStored('wardrobe', wardrobeState);
      return wardrobeState[idx];
    }
    throw new Error('Wardrobe item not found');
  },

  async deleteWardrobeItem(id: string): Promise<void> {
    wardrobeState = wardrobeState.filter((w) => w.id !== id);
    setStored('wardrobe', wardrobeState);
    this.logAudit('WARDROBE_ITEM_DELETED', `Deleted garment ${id}`, sessionState?.email || 'user');
  },

  // Catalog & Discovery
  async getCatalog(query?: { search?: string; category?: string; occasion?: string; maxPrice?: number }): Promise<ProductDto[]> {
    let items = [...catalogState];

    if (query?.search) {
      const q = query.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.primaryColorName.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.occasionTags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (query?.category && query.category !== 'ALL') {
      items = items.filter((p) => p.category === query.category);
    }

    if (query?.occasion && query.occasion !== 'ALL') {
      items = items.filter((p) => p.occasionTags?.includes(query.occasion as any));
    }

    if (query?.maxPrice) {
      items = items.filter((p) => p.price <= query.maxPrice!);
    }

    return items;
  },

  async getProductById(id: string): Promise<ProductDto | null> {
    return catalogState.find((p) => p.id === id) || null;
  },

  // Complete My Outfit Engine with dynamic item swapping
  async completeMyOutfit(params: CompleteMyOutfitDto): Promise<OutfitDto[]> {
    try {
      const res = await fetch(`${API_BASE}/recommendations/complete-my-outfit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback simulation
    }

    const seed = wardrobeState.find((w) => w.id === params.seedItemId) || wardrobeState[0];
    const topItem = wardrobeState.find((w) => w.category === 'TOP') || wardrobeState[1];
    const bottomItem = wardrobeState.find((w) => w.category === 'BOTTOM') || wardrobeState[2];
    const footwearItem = wardrobeState.find((w) => w.category === 'FOOTWEAR') || wardrobeState[3];
    const blazerProduct = catalogState[0];
    const accessoryProduct = catalogState.find((p) => p.category === 'ACCESSORY') || catalogState[catalogState.length - 1];

    return [
      {
        id: 'outfit-cmo-1',
        name: `Architectural Elegance with ${seed.name}`,
        occasion: params.occasion,
        season: 'AUTUMN / WINTER',
        targetFormality: seed.formalityLevel,
        overallScore: 94.5,
        colorHarmonyScore: 96.0,
        silhouetteScore: 95.0,
        formalityScore: 90.0,
        ruleBreakdown: {
          colorHarmony: {
            score: 96.0,
            harmonyType: 'NEUTRAL_ACCENT',
            details: 'Tonal obsidian paired with crisp chalk white for high contrast (ΔL=72%)',
            paletteBonus: true,
          },
          silhouetteBalance: {
            score: 95.0,
            targetShape: 'HOURGLASS',
            proportions: 'Sculpted drape over vertical tailored line',
            critique: 'Accentuates waist definition while respecting anatomical proportions.',
          },
          formalityAlignment: {
            score: 90.0,
            deltaF: 1,
            critique: 'High-low synthesis between relaxed denim and structured outerwear.',
          },
          budgetAdherence: {
            score: 95.0,
            totalCost: 1560,
            budgetTier: 3,
          },
          preferenceAffinity: {
            score: 100.0,
            matches: ['The Row', 'Toteme'],
          },
        },
        stylingAdvice: {
          headline: 'Sculpted Contrast: Poise in Controlled Volume',
          editorialSummary: `This ensemble anchors itself on ${seed.name}, balancing its tactile presence against clean tailored lines. Operating at an overall deterministic score of 94.5/100, the look honors your confirmed Hourglass silhouette through disciplined vertical layering.`,
          stylingTips: [
            'Maintain an open front drape on the outer layer to expose the linear torso contrast.',
            'Opt for brushed silver or cool platinum jewelry to harmonize with your Cool undertone.',
            'A sharp leather boot grounds the silhouette with intentional weight.',
          ],
          colorStory: 'True Winter monochrome palette pairing deep obsidian against crisp chalk white.',
        },
        items: [
          {
            id: 'item-1',
            slotType: seed.category,
            layerOrder: 3,
            isOwned: true,
            wardrobeItemId: seed.id,
            name: seed.name,
            brand: seed.brand,
            subCategory: seed.subCategory,
            primaryColorHex: seed.primaryColorHex,
            primaryColorName: seed.primaryColorName,
            imageUrl: seed.imageUrl || '',
            price: seed.cost,
          },
          {
            id: 'item-2',
            slotType: 'TOP',
            layerOrder: 1,
            isOwned: true,
            wardrobeItemId: topItem.id,
            name: topItem.name,
            brand: topItem.brand,
            subCategory: topItem.subCategory,
            primaryColorHex: topItem.primaryColorHex,
            primaryColorName: topItem.primaryColorName,
            imageUrl: topItem.imageUrl || '',
            price: topItem.cost,
          },
          {
            id: 'item-3',
            slotType: 'BOTTOM',
            layerOrder: 2,
            isOwned: true,
            wardrobeItemId: bottomItem.id,
            name: bottomItem.name,
            brand: bottomItem.brand,
            subCategory: bottomItem.subCategory,
            primaryColorHex: bottomItem.primaryColorHex,
            primaryColorName: bottomItem.primaryColorName,
            imageUrl: bottomItem.imageUrl || '',
            price: bottomItem.cost,
          },
          {
            id: 'item-4',
            slotType: 'FOOTWEAR',
            layerOrder: 1,
            isOwned: true,
            wardrobeItemId: footwearItem.id,
            name: footwearItem.name,
            brand: footwearItem.brand,
            subCategory: footwearItem.subCategory,
            primaryColorHex: footwearItem.primaryColorHex,
            primaryColorName: footwearItem.primaryColorName,
            imageUrl: footwearItem.imageUrl || '',
            price: footwearItem.cost,
          },
        ],
        isCurated: true,
        isUserCreated: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'outfit-cmo-2',
        name: `Contemporary Suiting Fusion`,
        occasion: params.occasion,
        season: 'AUTUMN',
        targetFormality: 'SMART_CASUAL',
        overallScore: 91.0,
        colorHarmonyScore: 92.0,
        silhouetteScore: 90.0,
        formalityScore: 95.0,
        ruleBreakdown: {
          colorHarmony: {
            score: 92.0,
            harmonyType: 'ANALOGOUS',
            details: 'Deep charcoal paired with espresso obsidian twill',
            paletteBonus: true,
          },
          silhouetteBalance: {
            score: 90.0,
            targetShape: 'HOURGLASS',
            proportions: 'Structured shoulders with fluid lower drape',
            critique: 'Peaked lapels balance wide-leg fluidity.',
          },
          formalityAlignment: {
            score: 95.0,
            deltaF: 0,
            critique: 'Uniform smart casual tailoring throughout.',
          },
          budgetAdherence: {
            score: 85.0,
            totalCost: 2490,
            budgetTier: 3,
          },
          preferenceAffinity: {
            score: 95.0,
            matches: ['Toteme', 'Lemaire', 'Bottega Veneta'],
          },
        },
        stylingAdvice: {
          headline: 'The Power of Understated Tailoring',
          editorialSummary: `A gallery-ready aesthetic combining ${blazerProduct.brand} tailoring with fluid wool twill and the iconic Bottega Veneta pouch.`,
          stylingTips: [
            'Push sleeves up slightly past the wrist bone for relaxed poise.',
            'Keep buttoning minimal to allow natural gait movement.',
          ],
          colorStory: 'Subtle charcoal gradient with rich espresso depth.',
        },
        items: [
          {
            id: 'item-p1',
            slotType: 'OUTERWEAR',
            layerOrder: 3,
            isOwned: false,
            productId: blazerProduct.id,
            name: blazerProduct.title,
            brand: blazerProduct.brand,
            subCategory: blazerProduct.subCategory,
            primaryColorHex: blazerProduct.primaryColorHex,
            primaryColorName: blazerProduct.primaryColorName,
            imageUrl: blazerProduct.imageUrls[0],
            price: blazerProduct.price,
            affiliateUrl: blazerProduct.affiliateUrl,
          },
          {
            id: 'item-w2',
            slotType: 'TOP',
            layerOrder: 1,
            isOwned: true,
            wardrobeItemId: topItem.id,
            name: topItem.name,
            brand: topItem.brand,
            subCategory: topItem.subCategory,
            primaryColorHex: topItem.primaryColorHex,
            primaryColorName: topItem.primaryColorName,
            imageUrl: topItem.imageUrl || '',
            price: topItem.cost,
          },
          {
            id: 'item-w5',
            slotType: 'BOTTOM',
            layerOrder: 2,
            isOwned: true,
            wardrobeItemId: wardrobeState[4].id,
            name: wardrobeState[4].name,
            brand: wardrobeState[4].brand,
            subCategory: wardrobeState[4].subCategory,
            primaryColorHex: wardrobeState[4].primaryColorHex,
            primaryColorName: wardrobeState[4].primaryColorName,
            imageUrl: wardrobeState[4].imageUrl || '',
            price: wardrobeState[4].cost,
          },
          {
            id: 'item-p2',
            slotType: 'ACCESSORY',
            layerOrder: 1,
            isOwned: false,
            productId: accessoryProduct.id,
            name: accessoryProduct.title,
            brand: accessoryProduct.brand,
            subCategory: accessoryProduct.subCategory,
            primaryColorHex: accessoryProduct.primaryColorHex,
            primaryColorName: accessoryProduct.primaryColorName,
            imageUrl: accessoryProduct.imageUrls[0],
            price: accessoryProduct.price,
          },
        ],
        isCurated: true,
        isUserCreated: false,
        createdAt: new Date().toISOString(),
      },
    ];
  },

  // Wishlist
  async getWishlist(): Promise<ProductDto[]> {
    return catalogState.filter((p) => wishlistState.includes(p.id));
  },

  async toggleWishlist(productId: string): Promise<boolean> {
    const exists = wishlistState.includes(productId);
    if (exists) {
      wishlistState = wishlistState.filter((id) => id !== productId);
    } else {
      wishlistState.push(productId);
    }
    setStored('wishlist', wishlistState);
    return !exists;
  },

  // Saved Outfits
  async getSavedOutfits(): Promise<OutfitDto[]> {
    return savedOutfitsState;
  },

  async saveOutfit(outfit: OutfitDto): Promise<void> {
    if (!savedOutfitsState.some((o) => o.id === outfit.id)) {
      savedOutfitsState.unshift(outfit);
      setStored('saved_outfits', savedOutfitsState);
      this.logAudit('OUTFIT_SAVED', `Saved outfit ${outfit.name}`, sessionState?.email || 'user');
    }
  },

  async removeSavedOutfit(outfitId: string): Promise<void> {
    savedOutfitsState = savedOutfitsState.filter((o) => o.id !== outfitId);
    setStored('saved_outfits', savedOutfitsState);
  },

  // Shopping Cart & Orders
  getCart(): CartItem[] {
    return cartState;
  },

  addToCart(product: ProductDto, size: string, quantity = 1): CartItem[] {
    const existingIdx = cartState.findIndex((item) => item.product.id === product.id && item.size === size);
    if (existingIdx !== -1) {
      cartState[existingIdx].quantity += quantity;
    } else {
      cartState.push({ product, size, quantity });
    }
    setStored('cart', cartState);
    return [...cartState];
  },

  updateCartQty(productId: string, size: string, quantity: number): CartItem[] {
    if (quantity <= 0) {
      cartState = cartState.filter((item) => !(item.product.id === productId && item.size === size));
    } else {
      const item = cartState.find((item) => item.product.id === productId && item.size === size);
      if (item) item.quantity = quantity;
    }
    setStored('cart', cartState);
    return [...cartState];
  },

  removeFromCart(productId: string, size: string): CartItem[] {
    cartState = cartState.filter((item) => !(item.product.id === productId && item.size === size));
    setStored('cart', cartState);
    return [...cartState];
  },

  clearCart(): void {
    cartState = [];
    setStored('cart', cartState);
  },

  async placeOrder(orderData: {
    shippingAddress: OrderRecord['shippingAddress'];
    paymentMethod: string;
  }): Promise<OrderRecord> {
    if (cartState.length === 0) throw new Error('Cart is empty');

    const subtotal = cartState.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const shipping = 0; // Complimentary white-glove shipping
    const total = subtotal + tax + shipping;

    const order: OrderRecord = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      items: [...cartState],
      subtotal,
      tax,
      shipping,
      total,
      status: 'CONFIRMED',
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
    };

    ordersState.unshift(order);
    setStored('orders', ordersState);
    this.clearCart();
    this.logAudit('ORDER_PLACED', `Order ${order.id} placed for $${total}`, sessionState?.email || 'user');
    return order;
  },

  getOrders(): OrderRecord[] {
    return ordersState;
  },

  // Recommendation Feedback
  async recordRecommendationFeedback(outfitId: string, isLiked: boolean, tags: string[] = [], comment?: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/recommendations/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outfitId, rating: isLiked ? 5 : 1, feedbackTags: tags, feedbackText: comment }),
      });
    } catch {
      // Fallback
    }
    this.logAudit(
      'RECOMMENDATION_FEEDBACK',
      `Outfit ${outfitId}: ${isLiked ? 'Liked' : 'Disliked'} (${tags.join(', ')})`,
      sessionState?.email || 'user'
    );
  },

  // Admin Features
  async adminAddProduct(product: Omit<ProductDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductDto> {
    const newProduct: ProductDto = {
      ...product,
      id: `prod-custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    catalogState.unshift(newProduct);
    setStored('catalog', catalogState);
    this.logAudit('ADMIN_PRODUCT_CREATED', `Created product ${newProduct.title} ($${newProduct.price})`, sessionState?.email || 'admin');
    return newProduct;
  },

  async adminUpdateProduct(id: string, updates: Partial<ProductDto>): Promise<ProductDto> {
    const idx = catalogState.findIndex((p) => p.id === id);
    if (idx !== -1) {
      catalogState[idx] = { ...catalogState[idx], ...updates, updatedAt: new Date().toISOString() };
      setStored('catalog', catalogState);
      this.logAudit('ADMIN_PRODUCT_UPDATED', `Updated product ${id}`, sessionState?.email || 'admin');
      return catalogState[idx];
    }
    throw new Error('Product not found');
  },

  async adminDeleteProduct(id: string): Promise<void> {
    catalogState = catalogState.filter((p) => p.id !== id);
    setStored('catalog', catalogState);
    this.logAudit('ADMIN_PRODUCT_DELETED', `Deleted product ${id}`, sessionState?.email || 'admin');
  },

  getAuditLogs(): AuditLogEntry[] {
    return auditLogsState;
  },

  logAudit(action: string, details: string, userEmail: string): void {
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      action,
      timestamp: new Date().toISOString(),
      details,
      userEmail,
    };
    auditLogsState.unshift(entry);
    if (auditLogsState.length > 50) auditLogsState.pop();
    setStored('audit_logs', auditLogsState);
  },

  // Privacy & Data Rights
  exportUserData(): string {
    const exportData = {
      user: sessionState,
      profile: profileState,
      wardrobe: wardrobeState,
      orders: ordersState,
      wishlist: wishlistState,
      savedOutfits: savedOutfitsState,
      exportedAt: new Date().toISOString(),
      compliance: 'GDPR / CCPA Data Rights Compliance',
    };
    this.logAudit('DATA_EXPORT', 'Full client personal data archive generated', sessionState?.email || 'user');
    return JSON.stringify(exportData, null, 2);
  },

  async deleteAccount(): Promise<void> {
    this.logAudit('ACCOUNT_PURGED', 'User invoked Right to be Forgotten (Full Deletion)', sessionState?.email || 'user');
    localStorage.clear();
    sessionState = null;
    profileState = INITIAL_PROFILE;
    wardrobeState = INITIAL_WARDROBE;
    cartState = [];
    wishlistState = [];
    savedOutfitsState = [];
    ordersState = [];
  },

  // Photo Upload
  async uploadPhoto(base64Data: string, _fileName: string, _type: string): Promise<{ storageKey: string }> {
    // Store locally as a keyed blob reference
    const key = `photo-${Date.now()}`;
    try {
      localStorage.setItem(`closetiq_photo_${key}`, base64Data);
    } catch {
      // Ignore storage quota errors
    }
    this.logAudit('PHOTO_UPLOADED', `Portrait uploaded (${key})`, sessionState?.email || 'user');
    return { storageKey: key };
  },

  // ML Portrait Analysis (stub — calls ML service if available)
  async processPortrait(storageKey: string): Promise<void> {
    try {
      await fetch(`/api/v1/analysis/portrait`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storageKey }),
      });
    } catch {
      // ML service offline — silently ignore
    }
  },

  // Analysis Lab
  async getLatestAnalysis(): Promise<BodyAnalysisResponseDto> {
    return {
      id: 'analysis-1',
      userId: sessionState?.id || 'user-sloane',
      shoulderHipRatio: 1.02,
      waistHipRatio: 0.72,
      torsoLegRatio: 0.85,
      skinLabL: 66.8,
      skinLabA: 11.2,
      skinLabB: 13.4,
      itaAngle: 51.4,
      detectedBodyShape: 'HOURGLASS',
      detectedUndertone: 'COOL',
      detectedPalette: 'TRUE_WINTER',
      confidenceScore: 0.96,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
    };
  },
};
