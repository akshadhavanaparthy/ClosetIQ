import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authenticate.js';
import { catalogAdminService } from '../services/catalogAdmin.service.js';
import { NotFoundError, UnauthorizedError } from '../utils/errors.js';

export class CatalogAdminController {
  async listMerchants(_req: AuthenticatedRequest, res: Response): Promise<void> {
    const merchants = await catalogAdminService.listMerchants();
    res.json({
      success: true,
      data: merchants,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async createMerchant(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const merchant = await catalogAdminService.createMerchant(req.body);
    res.status(201).json({
      success: true,
      data: merchant,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async listProducts(_req: AuthenticatedRequest, res: Response): Promise<void> {
    const products = await catalogAdminService.listProducts();
    res.json({
      success: true,
      data: products,
      meta: { totalCount: products.length, timestamp: new Date().toISOString() },
    });
  }

  async createProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const product = await catalogAdminService.createProduct(req.body);
    res.status(201).json({
      success: true,
      data: product,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async updateProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!productId) throw new NotFoundError('Product identifier is required.');
    const product = await catalogAdminService.updateProduct(productId, req.body);
    res.json({
      success: true,
      data: product,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async verifyProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!productId) throw new NotFoundError('Product identifier is required.');
    const product = await catalogAdminService.verifyManualProduct(productId, req.body.inStock);
    res.json({
      success: true,
      data: product,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async markUnavailable(req: AuthenticatedRequest, res: Response): Promise<void> {
    const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!productId) throw new NotFoundError('Product identifier is required.');
    const product = await catalogAdminService.setProductUnavailable(productId);
    res.json({
      success: true,
      data: product,
      meta: { timestamp: new Date().toISOString() },
    });
  }
}

export const catalogAdminController = new CatalogAdminController();
