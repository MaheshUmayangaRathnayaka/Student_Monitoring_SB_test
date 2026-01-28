import express from 'express';
import {
  getSubjectPerformance,
  getMyPerformance,
  getClassAnalytics,
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Student routes
router.get('/my-performance', protect, authorize('student'), getMyPerformance);

// Teacher/Admin routes
router.get('/class-analytics', protect, authorize('teacher', 'admin'), getClassAnalytics);

// Shared routes (with role-based logic in controller)
router.get('/subject-performance/:studentId', protect, getSubjectPerformance);

export default router;
