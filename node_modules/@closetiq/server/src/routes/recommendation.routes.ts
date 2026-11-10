import { Router } from 'express';
import { recommendationController } from '../controllers/recommendation.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  CompleteMyOutfitSchema,
  DailyRecommendationsSchema,
  RecommendationFeedbackSchema,
} from '@closetiq/shared-types';

const router = Router();

router.use(authenticate);

router.post(
  '/complete-my-outfit',
  validateRequest({ body: CompleteMyOutfitSchema }),
  (req, res, next) => recommendationController.completeMyOutfit(req, res).catch(next)
);

router.post(
  '/daily',
  validateRequest({ body: DailyRecommendationsSchema }),
  (req, res, next) => recommendationController.daily(req, res).catch(next)
);

router.post(
  '/feedback',
  validateRequest({ body: RecommendationFeedbackSchema }),
  (req, res, next) => recommendationController.feedback(req, res).catch(next)
);

export default router;
