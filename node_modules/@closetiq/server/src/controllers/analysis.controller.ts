import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authenticate.js';
import { analysisService } from '../services/analysis.service.js';
import { UnauthorizedError } from '../utils/errors.js';

export class AnalysisController {
  async uploadPhoto(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const { imageData, fileName, category } = req.body;
    if (!imageData) {
      res.status(400).json({ success: false, error: { code: 'NO_IMAGE_DATA', message: 'imageData is required' } });
      return;
    }
    const result = await analysisService.saveUploadedImage(req.user.userId, imageData, fileName, category);
    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async getUploadTicket(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const category = (req.body.category || 'BODY_ANALYSIS') as 'BODY_ANALYSIS' | 'PORTRAIT';
    const fileName = req.body.fileName || 'upload.jpg';
    const ticket = await analysisService.getUploadTicket(req.user.userId, category, fileName);
    res.json({
      success: true,
      data: ticket,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async processBody(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const result = await analysisService.processBodyPhoto(req.user.userId, req.body.imageKey);
    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async processPortrait(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const result = await analysisService.processPortraitPhoto(req.user.userId, req.body.imageKey);
    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async getLatest(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const result = await analysisService.getLatestAnalysis(req.user.userId);
    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async confirm(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    await analysisService.confirmAnalysis(req.user.userId, req.body);
    res.json({
      success: true,
      data: { message: 'Body shape and undertone confirmed successfully' },
      meta: { timestamp: new Date().toISOString() },
    });
  }
}

export const analysisController = new AnalysisController();
