import express from 'express';
import {
  uploadResume,
  getMyResume,
  downloadResume,
  deleteResume,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { uploadResumeFile } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post(
  '/upload',
  protect,
  authorize('JOB_SEEKER'),
  uploadResumeFile.single('resume'),
  uploadResume
);

router.get('/my-resume', protect, authorize('JOB_SEEKER'), getMyResume);
router.get('/download/:id', downloadResume);
router.delete('/:id', protect, authorize('JOB_SEEKER'), deleteResume);

export default router;
