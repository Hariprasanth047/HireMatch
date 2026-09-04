import express from 'express';
import { getJobRecommendations } from '../controllers/recommendationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/jobs', protect, authorize('JOB_SEEKER'), getJobRecommendations);

export default router;
