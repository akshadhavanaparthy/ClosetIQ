import { prisma, Prisma } from '@closetiq/database';
import { CreateWardrobeItemDto, UpdateWardrobeItemDto, WardrobeQueryDto, WardrobeItemDto } from '@closetiq/shared-types';
import { mlClient } from './mlClient.service.js';
import { NotFoundError } from '../utils/errors.js';

export class WardrobeService {
  async getItems(userId: string, query: WardrobeQueryDto): Promise<{ items: WardrobeItemDto[]; total: number }> {
    const where: Prisma.WardrobeItemWhereInput = {
      userId,
      isArchived: query.isArchived ?? false,
    };

    if (query.category) {
      where.category = query.category;
    }
    if (query.formalityLevel) {
      where.formalityLevel = query.formalityLevel;
    }
    if (query.season) {
      where.seasons = { has: query.season };
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { subCategory: { contains: query.search, mode: 'insensitive' } },
        { brand: { contains: query.search, mode: 'insensitive' } },
        { primaryColorName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const page = query.page || 1;
    const pageSize = query.pageSize || 20;

    const [rawItems, total] = await Promise.all([
      prisma.wardrobeItem.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.wardrobeItem.count({ where }),
    ]);

    const items: WardrobeItemDto[] = rawItems.map((item) => ({
      id: item.id,
      userId: item.userId,
      name: item.name,
      imageKey: item.imageKey,
      imageUrl: item.imageKey.startsWith('/uploads/') || item.imageKey.startsWith('uploads/')
        ? item.imageKey
        : '',
      category: item.category,
      subCategory: item.subCategory,
      primaryColorHex: item.primaryColorHex,
      primaryColorName: item.primaryColorName,
      secondaryColorHex: item.secondaryColorHex,
      pattern: item.pattern,
      material: item.material,
      formalityLevel: item.formalityLevel,
      seasons: item.seasons,
      fitType: item.fitType,
      brand: item.brand,
      cost: item.cost ? Number(item.cost) : null,
      timesWorn: item.timesWorn,
      isArchived: item.isArchived,
      detectionConfidence: item.detectionConfidence as Record<string, unknown> | null,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));

    return { items, total };
  }

  async createItem(userId: string, dto: CreateWardrobeItemDto): Promise<WardrobeItemDto> {
    // Optionally trigger CV detection metadata if needed
    const detection = await mlClient.detectGarmentAttributes(dto.imageKey);

    const item = await prisma.wardrobeItem.create({
      data: {
        userId,
        name: dto.name,
        imageKey: dto.imageKey,
        category: dto.category,
        subCategory: dto.subCategory,
        primaryColorHex: dto.primaryColorHex,
        primaryColorName: dto.primaryColorName,
        secondaryColorHex: dto.secondaryColorHex || null,
        pattern: dto.pattern || 'Solid',
        material: dto.material || null,
        formalityLevel: dto.formalityLevel || 'CASUAL',
        seasons: dto.seasons || ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
        fitType: dto.fitType || null,
        brand: dto.brand || null,
        cost: dto.cost !== undefined && dto.cost !== null ? new Prisma.Decimal(dto.cost) : null,
        detectionConfidence: detection as any,
      },
    });

    return {
      id: item.id,
      userId: item.userId,
      name: item.name,
      imageKey: item.imageKey,
      imageUrl: item.imageKey.startsWith('/uploads/') || item.imageKey.startsWith('uploads/')
        ? item.imageKey
        : '',
      category: item.category,
      subCategory: item.subCategory,
      primaryColorHex: item.primaryColorHex,
      primaryColorName: item.primaryColorName,
      secondaryColorHex: item.secondaryColorHex,
      pattern: item.pattern,
      material: item.material,
      formalityLevel: item.formalityLevel,
      seasons: item.seasons,
      fitType: item.fitType,
      brand: item.brand,
      cost: item.cost ? Number(item.cost) : null,
      timesWorn: item.timesWorn,
      isArchived: item.isArchived,
      detectionConfidence: item.detectionConfidence as Record<string, unknown> | null,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  async getItemById(userId: string, id: string): Promise<WardrobeItemDto> {
    const item = await prisma.wardrobeItem.findFirst({
      where: { id, userId },
    });

    if (!item) {
      throw new NotFoundError('Wardrobe item not found');
    }

    return {
      id: item.id,
      userId: item.userId,
      name: item.name,
      imageKey: item.imageKey,
      imageUrl: item.imageKey.startsWith('/uploads/') || item.imageKey.startsWith('uploads/')
        ? item.imageKey
        : '',
      category: item.category,
      subCategory: item.subCategory,
      primaryColorHex: item.primaryColorHex,
      primaryColorName: item.primaryColorName,
      secondaryColorHex: item.secondaryColorHex,
      pattern: item.pattern,
      material: item.material,
      formalityLevel: item.formalityLevel,
      seasons: item.seasons,
      fitType: item.fitType,
      brand: item.brand,
      cost: item.cost ? Number(item.cost) : null,
      timesWorn: item.timesWorn,
      isArchived: item.isArchived,
      detectionConfidence: item.detectionConfidence as Record<string, unknown> | null,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  async updateItem(userId: string, id: string, dto: UpdateWardrobeItemDto): Promise<WardrobeItemDto> {
    const existing = await prisma.wardrobeItem.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundError('Wardrobe item not found');
    }

    const item = await prisma.wardrobeItem.update({
      where: { id },
      data: {
        ...dto,
        cost: dto.cost !== undefined && dto.cost !== null ? new Prisma.Decimal(dto.cost) : undefined,
      },
    });

    return {
      id: item.id,
      userId: item.userId,
      name: item.name,
      imageKey: item.imageKey,
      category: item.category,
      subCategory: item.subCategory,
      primaryColorHex: item.primaryColorHex,
      primaryColorName: item.primaryColorName,
      secondaryColorHex: item.secondaryColorHex,
      pattern: item.pattern,
      material: item.material,
      formalityLevel: item.formalityLevel,
      seasons: item.seasons,
      fitType: item.fitType,
      brand: item.brand,
      cost: item.cost ? Number(item.cost) : null,
      timesWorn: item.timesWorn,
      isArchived: item.isArchived,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  async deleteItem(userId: string, id: string): Promise<void> {
    const existing = await prisma.wardrobeItem.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundError('Wardrobe item not found');
    }

    await prisma.wardrobeItem.update({
      where: { id },
      data: { isArchived: true },
    });
  }
}

export const wardrobeService = new WardrobeService();
