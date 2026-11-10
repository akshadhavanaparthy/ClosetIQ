import { Router } from 'express';
import { outfitController } from '../controllers/outfit.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => outfitController.list(req, res).catch(next));
router.post('/', (req, res, next) => outfitController.create(req, res).catch(next));
router.get('/:id', (req, res, next) => outfitController.getById(req, res).catch(next));
router.delete('/:id', (req, res, next) => outfitController.delete(req, res).catch(next));

export default router;
