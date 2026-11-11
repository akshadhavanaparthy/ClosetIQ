import { Router } from 'express';
import {
  CreateCatalogProductSchema,
  CreateMerchantSchema,
  UpdateCatalogProductSchema,
  VerifyCatalogProductSchema,
} from '@closetiq/shared-types';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { catalogAdminController } from '../controllers/catalogAdmin.controller.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/merchants', (req, res, next) =>
  catalogAdminController.listMerchants(req, res).catch(next)
);
router.post('/merchants', validateRequest({ body: CreateMerchantSchema }), (req, res, next) =>
  catalogAdminController.createMerchant(req, res).catch(next)
);
router.get('/products', (req, res, next) =>
  catalogAdminController.listProducts(req, res).catch(next)
);
router.post('/products', validateRequest({ body: CreateCatalogProductSchema }), (req, res, next) =>
  catalogAdminController.createProduct(req, res).catch(next)
);
router.patch('/products/:id', validateRequest({ body: UpdateCatalogProductSchema }), (req, res, next) =>
  catalogAdminController.updateProduct(req, res).catch(next)
);
router.post('/products/:id/verify', validateRequest({ body: VerifyCatalogProductSchema }), (req, res, next) =>
  catalogAdminController.verifyProduct(req, res).catch(next)
);
router.post('/products/:id/unavailable', (req, res, next) =>
  catalogAdminController.markUnavailable(req, res).catch(next)
);

export default router;
