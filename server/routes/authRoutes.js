import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  getAllUsers,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin/Teacher only routes
router.get('/users', protect, authorize('admin', 'teacher'), getAllUsers);

export default router;
