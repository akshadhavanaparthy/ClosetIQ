import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authenticate.js';
import { profileService } from '../services/profile.service.js';
import { UnauthorizedError } from '../utils/errors.js';

export class ProfileController {
  async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const profile = await profileService.getProfile(req.user.userId);
    res.json({
      success: true,
      data: profile,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async updateMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const profile = await profileService.updateProfile(req.user.userId, req.body);
    res.json({
      success: true,
      data: profile,
      meta: { timestamp: new Date().toISOString() },
    });
  }
}

export const profileController = new ProfileController();
