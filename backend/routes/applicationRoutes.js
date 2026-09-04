import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getApplicationById,
  getJobApplicants,
  getAllRecruiterApplicants,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('JOB_SEEKER'), applyForJob);
router.get('/my-applications', protect, authorize('JOB_SEEKER'), getMyApplications);
router.get('/recruiter/all', protect, authorize('RECRUITER'), getAllRecruiterApplicants);
router.get('/job/:jobId', protect, authorize('RECRUITER'), getJobApplicants);
router.put('/:id/status', protect, authorize('RECRUITER'), updateApplicationStatus);
router.get('/:id', protect, getApplicationById);

export default router;
