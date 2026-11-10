import { Router } from 'express';
import { merchantController } from '../controllers/merchant.controller.js';
import { optionalAuthenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/redirect/:productId', optionalAuthenticate, (req, res, next) =>
  merchantController.redirect(req, res).catch(next)
);

export default router;
