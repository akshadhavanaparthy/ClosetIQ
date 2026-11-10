import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authenticate.js';
import { merchantService } from '../services/merchant.service.js';

export class MerchantController {
  async redirect(req: AuthenticatedRequest, res: Response): Promise<void> {
    const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
    const outfitId = req.query.outfitId as string | undefined;
    const userId = req.user?.userId;
    const ipAddress = req.ip || req.socket.remoteAddress;

    const targetUrl = await merchantService.handleRedirect(productId, userId, outfitId, ipAddress);

    // Issue HTTP 302 Found redirect
    res.redirect(302, targetUrl);
  }
}

export const merchantController = new MerchantController();
