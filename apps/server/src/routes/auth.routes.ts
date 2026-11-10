import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { RegisterRequestSchema, LoginRequestSchema } from '@closetiq/shared-types';

const router = Router();

router.post('/register', validateRequest({ body: RegisterRequestSchema }), (req, res, next) =>
  authController.register(req, res).catch(next)
);

router.post('/login', validateRequest({ body: LoginRequestSchema }), (req, res, next) =>
  authController.login(req, res).catch(next)
);

router.post('/refresh', (req, res, next) =>
  authController.refresh(req, res).catch(next)
);

router.post('/logout', (req, res, next) =>
  authController.logout(req, res).catch(next)
);

export default router;
