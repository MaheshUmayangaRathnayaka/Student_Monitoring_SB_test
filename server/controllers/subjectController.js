import Subject from '../models/Subject.js';
import Performance from '../models/Performance.js';

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message
    });
  }
};

// @desc    Get single subject by ID
// @route   GET /api/subjects/:id
// @access  Public
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subject',
      error: error.message
    });
  }
};

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private
export const createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json({
      success: true,
      data: subject
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Subject code already exists'
      });
    }
    res.status(400).json({
      success: false,
      message: 'Error creating subject',
      error: error.message
    });
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private
export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating subject',
      error: error.message
    });
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    // Also delete associated performance records
    await Performance.deleteMany({ subject: req.params.id });
    
    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting subject',
      error: error.message
    });
  }
};

// @desc    Get subject performance statistics
// @route   GET /api/subjects/:id/statistics
// @access  Public
export const getSubjectStatistics = async (req, res) => {
  try {
    const performances = await Performance.find({ subject: req.params.id });
    
    if (performances.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No performance data available for this subject',
        data: {
          totalStudents: 0,
          averageMarks: 0,
          averageAttendance: 0
        }
      });
    }
    
    const totalStudents = performances.length;
    const totalMarks = performances.reduce((sum, p) => sum + p.marks.total, 0);
    const totalAttendance = performances.reduce((sum, p) => sum + p.attendance.percentage, 0);
    
    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        averageMarks: (totalMarks / totalStudents).toFixed(2),
        averageAttendance: (totalAttendance / totalStudents).toFixed(2),
        passRate: ((performances.filter(p => p.grade !== 'F').length / totalStudents) * 100).toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subject statistics',
      error: error.message
    });
  }
};

