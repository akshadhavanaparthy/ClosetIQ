import { Router } from 'express';
import { profileController } from '../controllers/profile.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { UpdateProfileSchema } from '@closetiq/shared-types';

const router = Router();

router.use(authenticate);

router.get('/me', (req, res, next) => profileController.getMe(req, res).catch(next));

router.patch('/me', validateRequest({ body: UpdateProfileSchema }), (req, res, next) =>
  profileController.updateMe(req, res).catch(next)
);

export default router;
