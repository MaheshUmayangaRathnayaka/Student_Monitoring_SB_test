import Student from '../models/Student.js';
import Performance from '../models/Performance.js';

// @desc    Get all students
// @route   GET /api/students
// @access  Public
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('subjects', 'name code teacher');
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Public
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('subjects');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private
export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Student ID or Email already exists'
      });
    }
    res.status(400).json({
      success: false,
      message: 'Error creating student',
      error: error.message
    });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Also delete associated performance records
    await Performance.deleteMany({ student: req.params.id });
    
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
};

// @desc    Get student performance
// @route   GET /api/students/:id/performance
// @access  Public
export const getStudentPerformance = async (req, res) => {
  try {
    const performance = await Performance.find({ student: req.params.id })
      .populate('subject', 'name code teacher credits')
      .populate('student', 'name studentId');
    
    res.status(200).json({
      success: true,
      count: performance.length,
      data: performance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student performance',
      error: error.message
    });
  }
};

