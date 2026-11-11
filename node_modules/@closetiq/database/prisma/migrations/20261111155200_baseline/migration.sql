-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'STYLIST', 'ADMIN');

-- CreateEnum
CREATE TYPE "GenderPreference" AS ENUM ('WOMENSWEAR', 'MENSWEAR', 'ANDROGYNOUS');

-- CreateEnum
CREATE TYPE "BodyShape" AS ENUM ('HOURGLASS', 'RECTANGLE', 'PEAR', 'INVERTED_TRIANGLE', 'APPLE', 'UNSPECIFIED');

-- CreateEnum
CREATE TYPE "Undertone" AS ENUM ('COOL', 'WARM', 'NEUTRAL', 'OLIVE', 'UNSPECIFIED');

-- CreateEnum
CREATE TYPE "SeasonalPalette" AS ENUM ('TRUE_SPRING', 'LIGHT_SPRING', 'BRIGHT_SPRING', 'TRUE_SUMMER', 'LIGHT_SUMMER', 'SOFT_SUMMER', 'TRUE_AUTUMN', 'SOFT_AUTUMN', 'DEEP_AUTUMN', 'TRUE_WINTER', 'BRIGHT_WINTER', 'DEEP_WINTER', 'UNSPECIFIED');

-- CreateEnum
CREATE TYPE "ClothingCategory" AS ENUM ('TOP', 'BOTTOM', 'DRESS', 'OUTERWEAR', 'FOOTWEAR', 'ACCESSORY', 'BAG');

-- CreateEnum
CREATE TYPE "Formality" AS ENUM ('CASUAL', 'SMART_CASUAL', 'BUSINESS_CASUAL', 'BUSINESS_FORMAL', 'BLACK_TIE');

-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ProductDataSource" AS ENUM ('ADMIN_MANUAL', 'OFFICIAL_API', 'AFFILIATE_FEED', 'MERCHANT_FEED');

-- CreateEnum
CREATE TYPE "ProductVerificationStatus" AS ENUM ('UNVERIFIED', 'MANUALLY_VERIFIED', 'LIVE_VERIFIED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT,
    "genderPreference" "GenderPreference" NOT NULL DEFAULT 'ANDROGYNOUS',
    "heightCm" DOUBLE PRECISION,
    "bustChestCm" DOUBLE PRECISION,
    "waistCm" DOUBLE PRECISION,
    "hipCm" DOUBLE PRECISION,
    "budgetTier" INTEGER NOT NULL DEFAULT 2,
    "bodyShapeEstimated" "BodyShape" NOT NULL DEFAULT 'UNSPECIFIED',
    "bodyShapeConfirmed" "BodyShape" NOT NULL DEFAULT 'UNSPECIFIED',
    "undertoneEstimated" "Undertone" NOT NULL DEFAULT 'UNSPECIFIED',
    "undertoneConfirmed" "Undertone" NOT NULL DEFAULT 'UNSPECIFIED',
    "seasonalPalette" "SeasonalPalette" NOT NULL DEFAULT 'UNSPECIFIED',
    "styleKeywords" TEXT[],
    "avoidColors" TEXT[],
    "preferredBrands" TEXT[],
    "preferredCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredOccasions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sizeTop" TEXT,
    "sizeBottom" TEXT,
    "sizeShoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullBodyPhotoKey" TEXT,
    "portraitPhotoKey" TEXT,
    "shoulderHipRatio" DOUBLE PRECISION,
    "waistHipRatio" DOUBLE PRECISION,
    "torsoLegRatio" DOUBLE PRECISION,
    "skinLabL" DOUBLE PRECISION,
    "skinLabA" DOUBLE PRECISION,
    "skinLabB" DOUBLE PRECISION,
    "detectedBodyShape" "BodyShape" NOT NULL DEFAULT 'UNSPECIFIED',
    "detectedUndertone" "Undertone" NOT NULL DEFAULT 'UNSPECIFIED',
    "detectedPalette" "SeasonalPalette" NOT NULL DEFAULT 'UNSPECIFIED',
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BodyAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WardrobeItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageKey" TEXT NOT NULL,
    "category" "ClothingCategory" NOT NULL,
    "subCategory" TEXT NOT NULL,
    "primaryColorHex" TEXT NOT NULL,
    "primaryColorName" TEXT NOT NULL,
    "secondaryColorHex" TEXT,
    "pattern" TEXT NOT NULL DEFAULT 'Solid',
    "material" TEXT,
    "formalityLevel" "Formality" NOT NULL DEFAULT 'CASUAL',
    "seasons" TEXT[],
    "fitType" TEXT,
    "brand" TEXT,
    "cost" DECIMAL(10,2),
    "timesWorn" INTEGER NOT NULL DEFAULT 0,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "detectionConfidence" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WardrobeItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "homepageUrl" TEXT NOT NULL,
    "affiliateNetwork" TEXT,
    "subIdParamName" TEXT,
    "commissionRate" DECIMAL(5,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "description" TEXT,
    "category" "ClothingCategory" NOT NULL,
    "subCategory" TEXT NOT NULL,
    "displayCategory" TEXT,
    "styleCategory" TEXT,
    "primaryColorHex" TEXT NOT NULL,
    "primaryColorName" TEXT NOT NULL,
    "pattern" TEXT NOT NULL DEFAULT 'Solid',
    "formalityLevel" "Formality" NOT NULL DEFAULT 'SMART_CASUAL',
    "seasons" TEXT[],
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "retailPrice" DECIMAL(10,2),
    "inStock" BOOLEAN NOT NULL DEFAULT false,
    "productUrl" TEXT NOT NULL,
    "affiliateUrl" TEXT,
    "imageUrls" TEXT[],
    "availableSizes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imageAttributionUrl" TEXT,
    "imagePermissionConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "dataSource" "ProductDataSource" NOT NULL DEFAULT 'ADMIN_MANUAL',
    "verificationStatus" "ProductVerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verifiedAt" TIMESTAMP(3),
    "sourceReference" TEXT,
    "lastPriceVerified" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outfit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "occasion" TEXT NOT NULL,
    "season" TEXT,
    "targetFormality" "Formality" NOT NULL DEFAULT 'CASUAL',
    "overallScore" DOUBLE PRECISION NOT NULL,
    "colorHarmonyScore" DOUBLE PRECISION NOT NULL,
    "silhouetteScore" DOUBLE PRECISION NOT NULL,
    "formalityScore" DOUBLE PRECISION NOT NULL,
    "ruleBreakdown" JSONB NOT NULL,
    "stylingAdvice" TEXT,
    "isCurated" BOOLEAN NOT NULL DEFAULT false,
    "isUserCreated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Outfit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutfitItem" (
    "id" TEXT NOT NULL,
    "outfitId" TEXT NOT NULL,
    "wardrobeItemId" TEXT,
    "productId" TEXT,
    "slotType" "ClothingCategory" NOT NULL,
    "layerOrder" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "OutfitItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedOutfit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "outfitId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedOutfit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishlistItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WishlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "outfitId" TEXT NOT NULL,
    "context" JSONB NOT NULL,
    "userRating" INTEGER,
    "feedbackTags" TEXT[],
    "feedbackText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "BodyAnalysis_userId_createdAt_idx" ON "BodyAnalysis"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "WardrobeItem_userId_category_idx" ON "WardrobeItem"("userId", "category");

-- CreateIndex
CREATE INDEX "WardrobeItem_userId_isArchived_idx" ON "WardrobeItem"("userId", "isArchived");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_name_key" ON "Merchant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_slug_key" ON "Merchant"("slug");

-- CreateIndex
CREATE INDEX "Product_category_price_idx" ON "Product"("category", "price");

-- CreateIndex
CREATE INDEX "Product_styleCategory_idx" ON "Product"("styleCategory");

-- CreateIndex
CREATE INDEX "Product_brand_idx" ON "Product"("brand");

-- CreateIndex
CREATE INDEX "Product_primaryColorName_idx" ON "Product"("primaryColorName");

-- CreateIndex
CREATE INDEX "Product_verificationStatus_inStock_idx" ON "Product"("verificationStatus", "inStock");

-- CreateIndex
CREATE INDEX "Product_dataSource_idx" ON "Product"("dataSource");

-- CreateIndex
CREATE UNIQUE INDEX "Product_merchantId_externalId_key" ON "Product"("merchantId", "externalId");

-- CreateIndex
CREATE INDEX "Outfit_userId_overallScore_idx" ON "Outfit"("userId", "overallScore");

-- CreateIndex
CREATE INDEX "OutfitItem_outfitId_idx" ON "OutfitItem"("outfitId");

-- CreateIndex
CREATE INDEX "OutfitItem_wardrobeItemId_idx" ON "OutfitItem"("wardrobeItemId");

-- CreateIndex
CREATE INDEX "OutfitItem_productId_idx" ON "OutfitItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedOutfit_userId_outfitId_key" ON "SavedOutfit"("userId", "outfitId");

-- CreateIndex
CREATE UNIQUE INDEX "WishlistItem_userId_productId_key" ON "WishlistItem"("userId", "productId");

-- CreateIndex
CREATE INDEX "RecommendationLog_userId_createdAt_idx" ON "RecommendationLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BodyAnalysis" ADD CONSTRAINT "BodyAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WardrobeItem" ADD CONSTRAINT "WardrobeItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outfit" ADD CONSTRAINT "Outfit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutfitItem" ADD CONSTRAINT "OutfitItem_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "Outfit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutfitItem" ADD CONSTRAINT "OutfitItem_wardrobeItemId_fkey" FOREIGN KEY ("wardrobeItemId") REFERENCES "WardrobeItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutfitItem" ADD CONSTRAINT "OutfitItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedOutfit" ADD CONSTRAINT "SavedOutfit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedOutfit" ADD CONSTRAINT "SavedOutfit_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "Outfit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationLog" ADD CONSTRAINT "RecommendationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationLog" ADD CONSTRAINT "RecommendationLog_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "Outfit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

