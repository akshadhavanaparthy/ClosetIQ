import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authenticate.js';
import { discoveryService } from '../services/discovery.service.js';
import { UnauthorizedError } from '../utils/errors.js';

export class DiscoveryController {
  async search(req: AuthenticatedRequest, res: Response): Promise<void> {
    const result = await discoveryService.searchProducts(req.query as any);
    res.json({
      success: true,
      data: result.products,
      meta: {
        totalCount: result.total,
        page: Number(req.query.page || 1),
        pageSize: Number(req.query.pageSize || 20),
        timestamp: new Date().toISOString(),
      },
    });
  }

  async getBrands(_req: AuthenticatedRequest, res: Response): Promise<void> {
    const brands = await discoveryService.getBrands();
    res.json({
      success: true,
      data: brands,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async getSizes(_req: AuthenticatedRequest, res: Response): Promise<void> {
    const sizes = await discoveryService.getSizes();
    res.json({
      success: true,
      data: sizes,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await discoveryService.getProductById(id);
    res.json({
      success: true,
      data: product,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async getWishlist(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const wishlist = await discoveryService.getWishlist(req.user.userId);
    res.json({
      success: true,
      data: wishlist,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async addToWishlist(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
    await discoveryService.addToWishlist(req.user.userId, productId);
    res.status(201).json({
      success: true,
      data: { message: 'Added to wishlist' },
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async removeFromWishlist(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
    await discoveryService.removeFromWishlist(req.user.userId, productId);
    res.json({
      success: true,
      data: { message: 'Removed from wishlist' },
      meta: { timestamp: new Date().toISOString() },
    });
  }
}

export const discoveryController = new DiscoveryController();
