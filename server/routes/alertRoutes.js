import express from 'express';
import {
  getAtRiskStudents,
  getMyAlerts,
  getAlertThresholds,
} from '../controllers/alertController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.get('/thresholds', protect, getAlertThresholds);

// Teacher/Admin routes
router.get('/at-risk', protect, authorize('teacher', 'admin'), getAtRiskStudents);

// Student routes
router.get('/my-alerts', protect, authorize('student'), getMyAlerts);

export default router;
