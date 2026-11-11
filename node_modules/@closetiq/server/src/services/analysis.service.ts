import { prisma, AnalysisStatus } from '@closetiq/database';
import { StorageFactory } from './storage/storage.factory.js';
import { mlClient } from './mlClient.service.js';
import { ConfirmAnalysisDto, BodyAnalysisResponseDto } from '@closetiq/shared-types';
import { NotFoundError, ServiceUnavailableError } from '../utils/errors.js';

export class AnalysisService {
  async saveUploadedImage(_userId: string, _imageData: string, _fileName = 'photo.jpg', _category = 'PORTRAIT') {
    throw new ServiceUnavailableError('Image storage is not configured.');
  }

  async getUploadTicket(userId: string, category: 'BODY_ANALYSIS' | 'PORTRAIT', fileName = 'upload.jpg') {
    const storage = StorageFactory.getProvider();
    return storage.generateUploadTicket({
      fileName,
      mimeType: 'image/jpeg',
      category,
      userId,
    });
  }

  async processBodyPhoto(userId: string, imageKey: string): Promise<BodyAnalysisResponseDto> {
    const mlResult = await mlClient.analyzeBodyShape(imageKey);

    const record = await prisma.bodyAnalysis.create({
      data: {
        userId,
        fullBodyPhotoKey: imageKey,
        shoulderHipRatio: mlResult.shoulderHipRatio,
        waistHipRatio: mlResult.waistHipRatio,
        torsoLegRatio: mlResult.torsoLegRatio,
        detectedBodyShape: mlResult.detectedBodyShape,
        confidenceScore: mlResult.confidenceScore,
        status: AnalysisStatus.COMPLETED,
      },
    });

    // Update estimated shape on profile
    await prisma.profile.update({
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
      status: record.status as any,
      createdAt: record.createdAt.toISOString(),
    };
  }

  async processPortraitPhoto(userId: string, imageKey: string): Promise<BodyAnalysisResponseDto> {
    const mlResult = await mlClient.analyzeSkinUndertone(imageKey);

    // Find latest analysis or create one
    let analysis = await prisma.bodyAnalysis.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (analysis) {
      analysis = await prisma.bodyAnalysis.update({
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
    } else {
      analysis = await prisma.bodyAnalysis.create({
        data: {
          userId,
          portraitPhotoKey: imageKey,
          skinLabL: mlResult.skinLabL,
          skinLabA: mlResult.skinLabA,
          skinLabB: mlResult.skinLabB,
          detectedUndertone: mlResult.detectedUndertone,
          detectedPalette: mlResult.detectedPalette,
          confidenceScore: mlResult.confidenceScore,
          status: AnalysisStatus.COMPLETED,
        },
      });
    }

    // Update estimated undertone & palette on profile
    await prisma.profile.update({
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
      status: analysis.status as any,
      createdAt: analysis.createdAt.toISOString(),
    };
  }

  async getLatestAnalysis(userId: string): Promise<BodyAnalysisResponseDto> {
    const analysis = await prisma.bodyAnalysis.findFirst({
      where: { userId, status: AnalysisStatus.COMPLETED },
      orderBy: { createdAt: 'desc' },
    });

    if (!analysis) {
      throw new NotFoundError('No completed body analysis record found for user');
    }

    let itaAngle: number | null = null;
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
      status: analysis.status as any,
      createdAt: analysis.createdAt.toISOString(),
    };
  }

  async confirmAnalysis(userId: string, dto: ConfirmAnalysisDto): Promise<void> {
    await prisma.profile.update({
      where: { userId },
      data: {
        bodyShapeConfirmed: dto.bodyShapeConfirmed,
        undertoneConfirmed: dto.undertoneConfirmed,
        ...(dto.seasonalPalette ? { seasonalPalette: dto.seasonalPalette } : {}),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'BODY_ANALYSIS_CONFIRMED',
        details: dto as any,
      },
    });
  }
}

export const analysisService = new AnalysisService();
