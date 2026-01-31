import express from 'express';
import {
  getAllPerformance,
  getPerformanceById,
  createPerformance,
  updatePerformance,
  deletePerformance,
  getPerformanceAnalytics,
  getPerformanceByStudent
} from '../controllers/performanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes - allow viewing performances without authentication
router.get('/', getAllPerformance);
router.get('/student/:studentId', getPerformanceByStudent);
router.get('/:id', getPerformanceById);

// Protected routes - only teachers and admins can modify performance data
router.get('/analytics/overview', protect, authorize('teacher', 'admin'), getPerformanceAnalytics);
router.post('/', protect, authorize('teacher', 'admin'), createPerformance);
router.put('/:id', protect, authorize('teacher', 'admin'), updatePerformance);
router.delete('/:id', protect, authorize('teacher', 'admin'), deletePerformance);

export default router;
