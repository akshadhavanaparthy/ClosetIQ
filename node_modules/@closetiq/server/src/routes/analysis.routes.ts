import { Router } from 'express';
import { analysisController } from '../controllers/analysis.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  ProcessBodyAnalysisSchema,
  ProcessPortraitAnalysisSchema,
  ConfirmAnalysisSchema,
} from '@closetiq/shared-types';

const router = Router();

router.use(authenticate);

router.post('/upload', (req, res, next) =>
  analysisController.uploadPhoto(req, res).catch(next)
);

router.post('/upload-ticket', (req, res, next) =>
  analysisController.getUploadTicket(req, res).catch(next)
);

router.post('/process-body', validateRequest({ body: ProcessBodyAnalysisSchema }), (req, res, next) =>
  analysisController.processBody(req, res).catch(next)
);

router.post('/process-portrait', validateRequest({ body: ProcessPortraitAnalysisSchema }), (req, res, next) =>
  analysisController.processPortrait(req, res).catch(next)
);

router.get('/latest', (req, res, next) =>
  analysisController.getLatest(req, res).catch(next)
);

router.post('/confirm', validateRequest({ body: ConfirmAnalysisSchema }), (req, res, next) =>
  analysisController.confirm(req, res).catch(next)
);

export default router;
