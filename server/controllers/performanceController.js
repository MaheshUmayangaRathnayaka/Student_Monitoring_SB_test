import Performance from '../models/Performance.js';
import Student from '../models/Student.js';
import Subject from '../models/Subject.js';

// @desc    Get all performance records
// @route   GET /api/performance
// @access  Public
export const getAllPerformance = async (req, res) => {
  try {
    const { semester, academicYear, student, subject } = req.query;
    
    // Build query filter
    const filter = {};
    if (semester) filter.semester = semester;
    if (academicYear) filter.academicYear = academicYear;
    if (subject) filter.subject = subject;
    if (student) filter.student = student;
    
    const performances = await Performance.find(filter)
      .populate('student', 'name studentId email')
      .populate('subject', 'name code teacher credits');
    
    res.status(200).json({
      success: true,
      count: performances.length,
      data: performances
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching performance records',
      error: error.message
    });
  }
};

// @desc    Get single performance record by ID
// @route   GET /api/performance/:id
// @access  Public
export const getPerformanceById = async (req, res) => {
  try {
    const performance = await Performance.findById(req.params.id)
      .populate('student', 'name studentId email grade semester')
      .populate('subject', 'name code teacher credits');
    
    if (!performance) {
      return res.status(404).json({
        success: false,
        message: 'Performance record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: performance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching performance record',
      error: error.message
    });
  }
};

// @desc    Create new performance record
// @route   POST /api/performance
// @access  Private
export const createPerformance = async (req, res) => {
  try {
    const { student, subject } = req.body;
    
    // Verify student exists
    const studentExists = await Student.findById(student);
    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Verify subject exists
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    const performance = await Performance.create(req.body);
    
    // Populate the response
    const populatedPerformance = await Performance.findById(performance._id)
      .populate('student', 'name studentId')
      .populate('subject', 'name code teacher');
    
    res.status(201).json({
      success: true,
      data: populatedPerformance
    });
  } catch (error) {
    console.error('Error creating performance:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Performance record already exists for this student-subject-semester combination'
      });
    }
    res.status(400).json({
      success: false,
      message: 'Error creating performance record',
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : null
    });
  }
};

// @desc    Update performance record
// @route   PUT /api/performance/:id
// @access  Private
export const updatePerformance = async (req, res) => {
  try {
    const performance = await Performance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('student', 'name studentId')
     .populate('subject', 'name code teacher');
    
    if (!performance) {
      return res.status(404).json({
        success: false,
        message: 'Performance record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: performance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating performance record',
      error: error.message
    });
  }
};

// @desc    Delete performance record
// @route   DELETE /api/performance/:id
// @access  Private
export const deletePerformance = async (req, res) => {
  try {
    const performance = await Performance.findByIdAndDelete(req.params.id);
    
    if (!performance) {
      return res.status(404).json({
        success: false,
        message: 'Performance record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Performance record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting performance record',
      error: error.message
    });
  }
};

// @desc    Get performance analytics
// @route   GET /api/performance/analytics/overview
// @access  Public
export const getPerformanceAnalytics = async (req, res) => {
  try {
    const { semester, academicYear } = req.query;
    
    const filter = {};
    if (semester) filter.semester = semester;
    if (academicYear) filter.academicYear = academicYear;
    
    const performances = await Performance.find(filter);
    
    if (performances.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No performance data available',
        data: {
          totalRecords: 0,
          averageMarks: 0,
          averageAttendance: 0,
          gradeDistribution: {}
        }
      });
    }
    
    // Calculate analytics
    const totalRecords = performances.length;
    const totalMarks = performances.reduce((sum, p) => sum + p.marks.total, 0);
    const totalAttendance = performances.reduce((sum, p) => sum + p.attendance.percentage, 0);
    
    // Grade distribution
    const gradeDistribution = performances.reduce((acc, p) => {
      acc[p.grade] = (acc[p.grade] || 0) + 1;
      return acc;
    }, {});
    
    // Students at risk (attendance < 75% or grade F/D)
    const studentsAtRisk = performances.filter(
      p => p.attendance.percentage < 75 || p.grade === 'F' || p.grade === 'D'
    ).length;
    
    res.status(200).json({
      success: true,
      data: {
        totalRecords,
        averageMarks: (totalMarks / totalRecords).toFixed(2),
        averageAttendance: (totalAttendance / totalRecords).toFixed(2),
        gradeDistribution,
        studentsAtRisk,
        passRate: ((performances.filter(p => p.grade !== 'F').length / totalRecords) * 100).toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching performance analytics',
      error: error.message
    });
  }
};

// @desc    Get performance records by student ID
// @route   GET /api/performance/student/:studentId
// @access  Protected (Students can only access their own data)
export const getPerformanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { semester, academicYear } = req.query;
    
    // If user is a student, ensure they can only access their own data
    if (req.user.role === 'student') {
      const studentRecord = await Student.findById(studentId);
      if (!studentRecord) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      // Check if the student record belongs to the logged-in user
      if (studentRecord.email !== req.user.email && studentRecord.studentId !== req.user.studentId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view your own performance data.'
        });
      }
    }
    
    // Build query filter
    const filter = { student: studentId };
    if (semester) filter.semester = semester;
    if (academicYear) filter.academicYear = academicYear;
    
    const performances = await Performance.find(filter)
      .populate('student', 'name studentId email grade semester')
      .populate('subject', 'name code teacher credits')
      .sort({ createdAt: -1 });
    
    if (performances.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No performance records found for this student',
        data: []
      });
    }
    
    res.status(200).json({
      success: true,
      count: performances.length,
      data: performances
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student performance records',
      error: error.message
    });
  }
};

