import express from 'express';
import jwt from 'jsonwebtoken';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyPostedJobs,
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { User } from '../models/User.js';

const router = express.Router();

// Middleware to optionally attach user if token exists (for public jobs search with personalized match)
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hirematch_super_secret_jwt_key_2026');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      // Ignore token errors for public routes
    }
  }
  next();
};

router.route('/')
  .get(optionalAuth, getJobs)
  .post(protect, authorize('RECRUITER'), createJob);

router.get('/recruiter/my-jobs', protect, authorize('RECRUITER'), getMyPostedJobs);

router.route('/:id')
  .get(optionalAuth, getJobById)
  .put(protect, authorize('RECRUITER'), updateJob)
  .delete(protect, authorize('RECRUITER'), deleteJob);

export default router;
