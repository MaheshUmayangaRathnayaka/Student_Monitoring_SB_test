import express from 'express';
import {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectStatistics
} from '../controllers/subjectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes - anyone can view subjects
router.get('/', getAllSubjects);
router.get('/:id', getSubjectById);
router.get('/:id/statistics', getSubjectStatistics);

// Protected routes - only teachers and admins can modify subjects
router.post('/', protect, authorize('teacher', 'admin'), createSubject);
router.put('/:id', protect, authorize('teacher', 'admin'), updateSubject);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteSubject);

export default router;
