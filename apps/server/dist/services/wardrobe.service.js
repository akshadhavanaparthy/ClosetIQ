"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wardrobeService = exports.WardrobeService = void 0;
const database_1 = require("@closetiq/database");
const mlClient_service_js_1 = require("./mlClient.service.js");
const errors_js_1 = require("../utils/errors.js");
class WardrobeService {
    async getItems(userId, query) {
        const where = {
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
            database_1.prisma.wardrobeItem.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            }),
            database_1.prisma.wardrobeItem.count({ where }),
        ]);
        const items = rawItems.map((item) => ({
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
            detectionConfidence: item.detectionConfidence,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        }));
        return { items, total };
    }
    async createItem(userId, dto) {
        // Optionally trigger CV detection metadata if needed
        const detection = await mlClient_service_js_1.mlClient.detectGarmentAttributes(dto.imageKey);
        const item = await database_1.prisma.wardrobeItem.create({
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
                cost: dto.cost !== undefined && dto.cost !== null ? new database_1.Prisma.Decimal(dto.cost) : null,
                detectionConfidence: detection,
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
            detectionConfidence: item.detectionConfidence,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        };
    }
    async getItemById(userId, id) {
        const item = await database_1.prisma.wardrobeItem.findFirst({
            where: { id, userId },
        });
        if (!item) {
            throw new errors_js_1.NotFoundError('Wardrobe item not found');
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
            detectionConfidence: item.detectionConfidence,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        };
    }
    async updateItem(userId, id, dto) {
        const existing = await database_1.prisma.wardrobeItem.findFirst({
            where: { id, userId },
        });
        if (!existing) {
            throw new errors_js_1.NotFoundError('Wardrobe item not found');
        }
        const item = await database_1.prisma.wardrobeItem.update({
            where: { id },
            data: {
                ...dto,
                cost: dto.cost !== undefined && dto.cost !== null ? new database_1.Prisma.Decimal(dto.cost) : undefined,
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
    async deleteItem(userId, id) {
        const existing = await database_1.prisma.wardrobeItem.findFirst({
            where: { id, userId },
        });
        if (!existing) {
            throw new errors_js_1.NotFoundError('Wardrobe item not found');
        }
        await database_1.prisma.wardrobeItem.update({
            where: { id },
            data: { isArchived: true },
        });
    }
}
exports.WardrobeService = WardrobeService;
exports.wardrobeService = new WardrobeService();
