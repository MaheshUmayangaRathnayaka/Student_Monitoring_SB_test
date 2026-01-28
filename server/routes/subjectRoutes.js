import express from 'express';
import {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectStatistics
} from '../controllers/subjectController.js';

const router = express.Router();

// Public routes
router.get('/', getAllSubjects);
router.get('/:id', getSubjectById);
router.get('/:id/statistics', getSubjectStatistics);

// Protected routes (will add auth middleware later)
router.post('/', createSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

export default router;
