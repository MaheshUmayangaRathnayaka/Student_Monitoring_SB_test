import express from 'express';
import {
  getAllPerformance,
  getPerformanceById,
  createPerformance,
  updatePerformance,
  deletePerformance,
  getPerformanceAnalytics
} from '../controllers/performanceController.js';

const router = express.Router();

// Public routes
router.get('/', getAllPerformance);
router.get('/analytics/overview', getPerformanceAnalytics);
router.get('/:id', getPerformanceById);

// Protected routes (will add auth middleware later)
router.post('/', createPerformance);
router.put('/:id', updatePerformance);
router.delete('/:id', deletePerformance);

export default router;
