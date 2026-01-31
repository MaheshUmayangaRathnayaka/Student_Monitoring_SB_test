import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, studentId, phone, semester } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Validate role-specific requirements
  if (role === 'student' && !studentId) {
    res.status(400);
    throw new Error('Student ID is required for student role');
  }

  // Check if studentId already exists (for students)
  if (role === 'student' && studentId) {
    const studentIdExists = await User.findOne({ studentId });
    if (studentIdExists) {
      res.status(400);
      throw new Error('Student ID already exists');
    }
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'student',
    studentId: role === 'student' ? studentId : undefined,
    phone,
    semester: role === 'student' ? semester : undefined,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.isActive) {
    res.status(401);
    throw new Error('Invalid credentials or account is inactive');
  }

  // Check password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    studentId: user.studentId,
    token: generateToken(user._id),
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    studentId: user.studentId,
    grade: user.grade,
    semester: user.semester,
    phone: user.phone,
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;

  // Students can update grade and semester
  if (user.role === 'student') {
    user.grade = req.body.grade || user.grade;
    user.semester = req.body.semester || user.semester;
  }

  // Update password if provided
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    studentId: updatedUser.studentId,
    token: generateToken(updatedUser._id),
  });
});

// @desc    Get all users (Admin/Teacher only)
// @route   GET /api/auth/users
// @access  Private/Admin/Teacher
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;

  const query = {};

  // Filter by role
  if (role) {
    query.role = role;
  }

  // Search by name or email
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query).select('-password');

  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});

