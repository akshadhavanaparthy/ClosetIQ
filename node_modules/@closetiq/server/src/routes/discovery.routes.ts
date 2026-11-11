import { Router } from 'express';
import { discoveryController } from '../controllers/discovery.controller.js';
import { authenticate, optionalAuthenticate } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { ProductQuerySchema } from '@closetiq/shared-types';

const router = Router();

router.get('/brands', optionalAuthenticate, (req, res, next) =>
  discoveryController.getBrands(req, res).catch(next)
);

router.get('/sizes', optionalAuthenticate, (req, res, next) =>
  discoveryController.getSizes(req, res).catch(next)
);

router.get('/search', optionalAuthenticate, validateRequest({ query: ProductQuerySchema }), (req, res, next) =>
  discoveryController.search(req, res).catch(next)
);

router.get('/wishlist', authenticate, (req, res, next) =>
  discoveryController.getWishlist(req, res).catch(next)
);

router.post('/wishlist/:productId', authenticate, (req, res, next) =>
  discoveryController.addToWishlist(req, res).catch(next)
);

router.delete('/wishlist/:productId', authenticate, (req, res, next) =>
  discoveryController.removeFromWishlist(req, res).catch(next)
);

router.get('/:id', optionalAuthenticate, (req, res, next) =>
  discoveryController.getById(req, res).catch(next)
);

export default router;
