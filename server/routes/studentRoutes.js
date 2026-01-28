import express from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentPerformance
} from '../controllers/studentController.js';

const router = express.Router();

// Public routes
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.get('/:id/performance', getStudentPerformance);

// Protected routes (will add auth middleware later)
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;
