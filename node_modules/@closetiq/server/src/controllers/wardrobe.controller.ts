import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authenticate.js';
import { wardrobeService } from '../services/wardrobe.service.js';
import { UnauthorizedError } from '../utils/errors.js';

export class WardrobeController {
  async getItems(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const result = await wardrobeService.getItems(req.user.userId, req.query as any);
    res.json({
      success: true,
      data: result.items,
      meta: {
        totalCount: result.total,
        page: Number(req.query.page || 1),
        pageSize: Number(req.query.pageSize || 20),
        timestamp: new Date().toISOString(),
      },
    });
  }

  async createItem(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const item = await wardrobeService.createItem(req.user.userId, req.body);
    res.status(201).json({
      success: true,
      data: item,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async getItemById(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await wardrobeService.getItemById(req.user.userId, id);
    res.json({
      success: true,
      data: item,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async updateItem(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await wardrobeService.updateItem(req.user.userId, id, req.body);
    res.json({
      success: true,
      data: item,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async deleteItem(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await wardrobeService.deleteItem(req.user.userId, id);
    res.json({
      success: true,
      data: { message: 'Item archived successfully' },
      meta: { timestamp: new Date().toISOString() },
    });
  }
}

export const wardrobeController = new WardrobeController();
