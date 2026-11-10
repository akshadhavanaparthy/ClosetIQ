import { Router } from 'express';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import analysisRoutes from './analysis.routes.js';
import wardrobeRoutes from './wardrobe.routes.js';
import recommendationRoutes from './recommendation.routes.js';
import discoveryRoutes from './discovery.routes.js';
import outfitRoutes from './outfit.routes.js';
import merchantRoutes from './merchant.routes.js';
import privacyRoutes from './privacy.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/analysis', analysisRoutes);
router.use('/wardrobe', wardrobeRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/discovery', discoveryRoutes);
router.use('/outfits', outfitRoutes);
router.use('/merchants', merchantRoutes);
router.use('/privacy', privacyRoutes);

export default router;
