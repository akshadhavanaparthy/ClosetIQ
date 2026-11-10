import { Router } from 'express';
import { privacyController } from '../controllers/privacy.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/export-data', (req, res, next) =>
  privacyController.exportData(req, res).catch(next)
);

router.post('/delete-account', (req, res, next) =>
  privacyController.deleteAccount(req, res).catch(next)
);

export default router;
