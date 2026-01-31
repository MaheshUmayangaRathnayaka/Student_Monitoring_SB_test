import express from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentPerformance
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes - allow viewing students without authentication
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.get('/:id/performance', protect, getStudentPerformance);

// Protected routes - only teachers and admins can modify student data
router.post('/', protect, authorize('teacher', 'admin'), createStudent);
router.put('/:id', protect, authorize('teacher', 'admin'), updateStudent);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteStudent);

export default router;
