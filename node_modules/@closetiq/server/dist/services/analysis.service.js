"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analysisService = exports.AnalysisService = void 0;
const database_1 = require("@closetiq/database");
const storage_factory_js_1 = require("./storage/storage.factory.js");
const mlClient_service_js_1 = require("./mlClient.service.js");
const errors_js_1 = require("../utils/errors.js");
class AnalysisService {
    async getUploadTicket(userId, category, fileName = 'upload.jpg') {
        const storage = storage_factory_js_1.StorageFactory.getProvider();
        return storage.generateUploadTicket({
            fileName,
            mimeType: 'image/jpeg',
            category,
            userId,
        });
    }
    async processBodyPhoto(userId, imageKey) {
        const mlResult = await mlClient_service_js_1.mlClient.analyzeBodyShape(imageKey);
        const record = await database_1.prisma.bodyAnalysis.create({
            data: {
                userId,
                fullBodyPhotoKey: imageKey,
                shoulderHipRatio: mlResult.shoulderHipRatio,
                waistHipRatio: mlResult.waistHipRatio,
                torsoLegRatio: mlResult.torsoLegRatio,
                detectedBodyShape: mlResult.detectedBodyShape,
                confidenceScore: mlResult.confidenceScore,
                status: database_1.AnalysisStatus.COMPLETED,
            },
        });
        // Update estimated shape on profile
        await database_1.prisma.profile.update({
            where: { userId },
            data: {
                bodyShapeEstimated: mlResult.detectedBodyShape,
            },
        });
        return {
            id: record.id,
            userId: record.userId,
            shoulderHipRatio: record.shoulderHipRatio,
            waistHipRatio: record.waistHipRatio,
            torsoLegRatio: record.torsoLegRatio,
            skinLabL: record.skinLabL,
            skinLabA: record.skinLabA,
            skinLabB: record.skinLabB,
            itaAngle: null,
            detectedBodyShape: record.detectedBodyShape,
            detectedUndertone: record.detectedUndertone,
            detectedPalette: record.detectedPalette,
            confidenceScore: record.confidenceScore,
            status: record.status,
            createdAt: record.createdAt.toISOString(),
        };
    }
    async processPortraitPhoto(userId, imageKey) {
        const mlResult = await mlClient_service_js_1.mlClient.analyzeSkinUndertone(imageKey);
        // Find latest analysis or create one
        let analysis = await database_1.prisma.bodyAnalysis.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        if (analysis) {
            analysis = await database_1.prisma.bodyAnalysis.update({
                where: { id: analysis.id },
                data: {
                    portraitPhotoKey: imageKey,
                    skinLabL: mlResult.skinLabL,
                    skinLabA: mlResult.skinLabA,
                    skinLabB: mlResult.skinLabB,
                    detectedUndertone: mlResult.detectedUndertone,
                    detectedPalette: mlResult.detectedPalette,
                    confidenceScore: (analysis.confidenceScore + mlResult.confidenceScore) / 2,
                },
            });
        }
        else {
            analysis = await database_1.prisma.bodyAnalysis.create({
                data: {
                    userId,
                    portraitPhotoKey: imageKey,
                    skinLabL: mlResult.skinLabL,
                    skinLabA: mlResult.skinLabA,
                    skinLabB: mlResult.skinLabB,
                    detectedUndertone: mlResult.detectedUndertone,
                    detectedPalette: mlResult.detectedPalette,
                    confidenceScore: mlResult.confidenceScore,
                    status: database_1.AnalysisStatus.COMPLETED,
                },
            });
        }
        // Update estimated undertone & palette on profile
        await database_1.prisma.profile.update({
            where: { userId },
            data: {
                undertoneEstimated: mlResult.detectedUndertone,
                seasonalPalette: mlResult.detectedPalette,
            },
        });
        return {
            id: analysis.id,
            userId: analysis.userId,
            shoulderHipRatio: analysis.shoulderHipRatio,
            waistHipRatio: analysis.waistHipRatio,
            torsoLegRatio: analysis.torsoLegRatio,
            skinLabL: analysis.skinLabL,
            skinLabA: analysis.skinLabA,
            skinLabB: analysis.skinLabB,
            itaAngle: mlResult.itaAngle,
            detectedBodyShape: analysis.detectedBodyShape,
            detectedUndertone: analysis.detectedUndertone,
            detectedPalette: analysis.detectedPalette,
            confidenceScore: analysis.confidenceScore,
            status: analysis.status,
            createdAt: analysis.createdAt.toISOString(),
        };
    }
    async getLatestAnalysis(userId) {
        const analysis = await database_1.prisma.bodyAnalysis.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        if (!analysis) {
            throw new errors_js_1.NotFoundError('No body analysis record found for user');
        }
        let itaAngle = null;
        if (analysis.skinLabL !== null && analysis.skinLabB !== null && analysis.skinLabB !== 0) {
            itaAngle = (Math.atan((analysis.skinLabL - 50) / analysis.skinLabB) * 180) / Math.PI;
            itaAngle = Math.round(itaAngle * 10) / 10;
        }
        return {
            id: analysis.id,
            userId: analysis.userId,
            shoulderHipRatio: analysis.shoulderHipRatio,
            waistHipRatio: analysis.waistHipRatio,
            torsoLegRatio: analysis.torsoLegRatio,
            skinLabL: analysis.skinLabL,
            skinLabA: analysis.skinLabA,
            skinLabB: analysis.skinLabB,
            itaAngle,
            detectedBodyShape: analysis.detectedBodyShape,
            detectedUndertone: analysis.detectedUndertone,
            detectedPalette: analysis.detectedPalette,
            confidenceScore: analysis.confidenceScore,
            status: analysis.status,
            createdAt: analysis.createdAt.toISOString(),
        };
    }
    async confirmAnalysis(userId, dto) {
        await database_1.prisma.profile.update({
            where: { userId },
            data: {
                bodyShapeConfirmed: dto.bodyShapeConfirmed,
                undertoneConfirmed: dto.undertoneConfirmed,
                ...(dto.seasonalPalette ? { seasonalPalette: dto.seasonalPalette } : {}),
            },
        });
        await database_1.prisma.auditLog.create({
            data: {
                userId,
                action: 'BODY_ANALYSIS_CONFIRMED',
                details: dto,
            },
        });
    }
}
exports.AnalysisService = AnalysisService;
exports.analysisService = new AnalysisService();
