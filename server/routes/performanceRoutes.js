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

// Public routes - anyone can view (we'll add student-specific filtering in controller)
router.get('/', protect, getAllPerformance);
router.get('/analytics/overview', protect, authorize('teacher', 'admin'), getPerformanceAnalytics);
router.get('/student/:studentId', protect, getPerformanceByStudent);
router.get('/:id', protect, getPerformanceById);

// Protected routes - only teachers and admins can modify performance data
router.post('/', protect, authorize('teacher', 'admin'), createPerformance);
router.put('/:id', protect, authorize('teacher', 'admin'), updatePerformance);
router.delete('/:id', protect, authorize('teacher', 'admin'), deletePerformance);

export default router;
