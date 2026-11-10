import { prisma } from '@closetiq/database';
import { UpdateProfileDto, ProfileResponseDto } from '@closetiq/shared-types';
import { NotFoundError } from '../utils/errors.js';

export class ProfileService {
  async getProfile(userId: string): Promise<ProfileResponseDto> {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found for user');
    }

    return {
      id: profile.id,
      userId: profile.userId,
      fullName: profile.fullName,
      genderPreference: profile.genderPreference,
      heightCm: profile.heightCm,
      bustChestCm: profile.bustChestCm,
      waistCm: profile.waistCm,
      hipCm: profile.hipCm,
      budgetTier: profile.budgetTier,
      bodyShapeEstimated: profile.bodyShapeEstimated,
      bodyShapeConfirmed: profile.bodyShapeConfirmed,
      undertoneEstimated: profile.undertoneEstimated,
      undertoneConfirmed: profile.undertoneConfirmed,
      seasonalPalette: profile.seasonalPalette,
      styleKeywords: profile.styleKeywords,
      avoidColors: profile.avoidColors,
      preferredBrands: profile.preferredBrands,
      preferredCategories: profile.preferredCategories,
      preferredOccasions: profile.preferredOccasions,
      sizeTop: profile.sizeTop,
      sizeBottom: profile.sizeBottom,
      sizeShoes: profile.sizeShoes,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<ProfileResponseDto> {
    // If user provided measurements and bodyShapeEstimated is unspecified, compute it deterministically
    let calculatedShape: any = undefined;
    if (dto.bustChestCm && dto.waistCm && dto.hipCm && dto.bustChestCm > 0 && dto.hipCm > 0) {
      const b = dto.bustChestCm;
      const w = dto.waistCm;
      const h = dto.hipCm;
      const wToB = w / b;
      const wToH = w / h;

      if (wToB <= 0.75 && wToH <= 0.75) {
        if (Math.abs(b - h) / b <= 0.05) {
          calculatedShape = 'HOURGLASS';
        } else if (h > b * 1.05) {
          calculatedShape = 'PEAR';
        } else {
          calculatedShape = 'INVERTED_TRIANGLE';
        }
      } else if (b > h * 1.05) {
        calculatedShape = 'INVERTED_TRIANGLE';
      } else if (h > b * 1.05) {
        calculatedShape = 'PEAR';
      } else if (wToH >= 0.85 && wToB >= 0.85) {
        calculatedShape = 'RECTANGLE';
      } else {
        calculatedShape = 'APPLE';
      }
    }

    const updateData: any = { ...dto };
    if (calculatedShape && !dto.bodyShapeConfirmed) {
      updateData.bodyShapeEstimated = calculatedShape;
    }

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...updateData,
      },
    });

    return {
      id: profile.id,
      userId: profile.userId,
      fullName: profile.fullName,
      genderPreference: profile.genderPreference,
      heightCm: profile.heightCm,
      bustChestCm: profile.bustChestCm,
      waistCm: profile.waistCm,
      hipCm: profile.hipCm,
      budgetTier: profile.budgetTier,
      bodyShapeEstimated: profile.bodyShapeEstimated,
      bodyShapeConfirmed: profile.bodyShapeConfirmed,
      undertoneEstimated: profile.undertoneEstimated,
      undertoneConfirmed: profile.undertoneConfirmed,
      seasonalPalette: profile.seasonalPalette,
      styleKeywords: profile.styleKeywords,
      avoidColors: profile.avoidColors,
      preferredBrands: profile.preferredBrands,
      preferredCategories: profile.preferredCategories,
      preferredOccasions: profile.preferredOccasions,
      sizeTop: profile.sizeTop,
      sizeBottom: profile.sizeBottom,
      sizeShoes: profile.sizeShoes,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}

export const profileService = new ProfileService();
