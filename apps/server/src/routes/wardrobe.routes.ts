import { Router } from 'express';
import { wardrobeController } from '../controllers/wardrobe.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  CreateWardrobeItemSchema,
  UpdateWardrobeItemSchema,
  WardrobeQuerySchema,
} from '@closetiq/shared-types';

const router = Router();

router.use(authenticate);

router.get('/', validateRequest({ query: WardrobeQuerySchema }), (req, res, next) =>
  wardrobeController.getItems(req, res).catch(next)
);

router.post('/', validateRequest({ body: CreateWardrobeItemSchema }), (req, res, next) =>
  wardrobeController.createItem(req, res).catch(next)
);

router.get('/:id', (req, res, next) =>
  wardrobeController.getItemById(req, res).catch(next)
);

router.patch('/:id', validateRequest({ body: UpdateWardrobeItemSchema }), (req, res, next) =>
  wardrobeController.updateItem(req, res).catch(next)
);

router.delete('/:id', (req, res, next) =>
  wardrobeController.deleteItem(req, res).catch(next)
);

export default router;
