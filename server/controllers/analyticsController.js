import Performance from '../models/Performance.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import asyncHandler from 'express-async-handler';

// @desc    Get subject-wise performance for a student (for radar chart)
// @route   GET /api/analytics/subject-performance/:studentId
// @access  Private
export const getSubjectPerformance = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  // Check if requester is the student themselves or a teacher/admin
  if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
    res.status(403);
    throw new Error('Students can only view their own performance');
  }

  // Get student
  const student = await User.findById(studentId);
  if (!student || student.role !== 'student') {
    res.status(404);
    throw new Error('Student not found');
  }

  // Get all performance records for this student
  const performances = await Performance.find({ student: studentId })
    .populate('subject', 'name code credits')
    .sort({ createdAt: -1 });

  if (performances.length === 0) {
    return res.json({
      success: true,
      student: {
        name: student.name,
        studentId: student.studentId,
        email: student.email,
      },
      data: [],
      message: 'No performance records found',
    });
  }

  // Format data for radar chart
  const subjectData = performances.map((performance) => ({
    subject: performance.subject.name,
    subjectCode: performance.subject.code,
    marks: performance.percentage,
    attendance: performance.attendancePercentage,
    grade: performance.grade,
    internal: performance.marks.internal,
    external: performance.marks.external,
    totalMarks: performance.totalMarks,
    maxMarks: 100,
    credits: performance.subject.credits,
  }));

  // Calculate overall metrics
  const totalPercentage = performances.reduce((sum, p) => sum + p.percentage, 0);
  const avgPercentage = totalPercentage / performances.length;

  const totalAttendance = performances.reduce((sum, p) => sum + p.attendancePercentage, 0);
  const avgAttendance = totalAttendance / performances.length;

  // Identify strengths and weaknesses
  const sortedByMarks = [...performances].sort((a, b) => b.percentage - a.percentage);
  const strengths = sortedByMarks.slice(0, 3).map((p) => ({
    subject: p.subject.name,
    code: p.subject.code,
    percentage: p.percentage,
    grade: p.grade,
  }));

  const weaknesses = sortedByMarks.slice(-3).reverse().map((p) => ({
    subject: p.subject.name,
    code: p.subject.code,
    percentage: p.percentage,
    grade: p.grade,
    needsImprovement: p.percentage < 60,
  }));

  res.json({
    success: true,
    student: {
      name: student.name,
      studentId: student.studentId,
      email: student.email,
      grade: student.grade,
      semester: student.semester,
    },
    metrics: {
      averageMarks: avgPercentage.toFixed(2),
      averageAttendance: avgAttendance.toFixed(2),
      totalSubjects: performances.length,
      passedSubjects: performances.filter((p) => p.percentage >= 40).length,
      failedSubjects: performances.filter((p) => p.percentage < 40).length,
    },
    subjectData,
    strengths,
    weaknesses,
  });
});

// @desc    Get my subject-wise performance (for logged-in student)
// @route   GET /api/analytics/my-performance
// @access  Private/Student
export const getMyPerformance = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  // Get all performance records for this student
  const performances = await Performance.find({ student: studentId })
    .populate('subject', 'name code credits')
    .sort({ createdAt: -1 });

  if (performances.length === 0) {
    return res.json({
      success: true,
      student: {
        name: req.user.name,
        studentId: req.user.studentId,
        email: req.user.email,
      },
      data: [],
      message: 'No performance records found',
    });
  }

  // Format data for radar chart
  const subjectData = performances.map((performance) => ({
    subject: performance.subject.name,
    subjectCode: performance.subject.code,
    marks: performance.percentage,
    attendance: performance.attendancePercentage,
    grade: performance.grade,
    internal: performance.marks.internal,
    external: performance.marks.external,
    totalMarks: performance.totalMarks,
    maxMarks: 100,
    credits: performance.subject.credits,
  }));

  // Calculate overall metrics
  const totalPercentage = performances.reduce((sum, p) => sum + p.percentage, 0);
  const avgPercentage = totalPercentage / performances.length;

  const totalAttendance = performances.reduce((sum, p) => sum + p.attendancePercentage, 0);
  const avgAttendance = totalAttendance / performances.length;

  // Identify strengths and weaknesses
  const sortedByMarks = [...performances].sort((a, b) => b.percentage - a.percentage);
  const strengths = sortedByMarks.slice(0, 3).map((p) => ({
    subject: p.subject.name,
    code: p.subject.code,
    percentage: p.percentage,
    grade: p.grade,
  }));

  const weaknesses = sortedByMarks.slice(-3).reverse().map((p) => ({
    subject: p.subject.name,
    code: p.subject.code,
    percentage: p.percentage,
    grade: p.grade,
    needsImprovement: p.percentage < 60,
  }));

  res.json({
    success: true,
    student: {
      name: req.user.name,
      studentId: req.user.studentId,
      email: req.user.email,
      grade: req.user.grade,
      semester: req.user.semester,
    },
    metrics: {
      averageMarks: avgPercentage.toFixed(2),
      averageAttendance: avgAttendance.toFixed(2),
      totalSubjects: performances.length,
      passedSubjects: performances.filter((p) => p.percentage >= 40).length,
      failedSubjects: performances.filter((p) => p.percentage < 40).length,
    },
    subjectData,
    strengths,
    weaknesses,
  });
});

// @desc    Get overall class analytics
// @route   GET /api/analytics/class-analytics
// @access  Private/Teacher/Admin
export const getClassAnalytics = asyncHandler(async (req, res) => {
  const { grade, semester } = req.query;

  // Build query for students
  const studentQuery = { role: 'student', isActive: true };
  if (grade) studentQuery.grade = grade;
  if (semester) studentQuery.semester = semester;

  const students = await User.find(studentQuery);
  const studentIds = students.map((s) => s._id);

  // Get all performance records for these students
  const performances = await Performance.find({ student: { $in: studentIds } })
    .populate('student', 'name studentId grade semester')
    .populate('subject', 'name code');

  if (performances.length === 0) {
    return res.json({
      success: true,
      data: [],
      message: 'No performance data found',
    });
  }

  // Calculate class-wide metrics
  const totalPercentage = performances.reduce((sum, p) => sum + p.percentage, 0);
  const avgClassPerformance = totalPercentage / performances.length;

  const passCount = performances.filter((p) => p.percentage >= 40).length;
  const passRate = (passCount / performances.length) * 100;

  // Grade distribution
  const gradeDistribution = {
    'A+': performances.filter((p) => p.grade === 'A+').length,
    A: performances.filter((p) => p.grade === 'A').length,
    'B+': performances.filter((p) => p.grade === 'B+').length,
    B: performances.filter((p) => p.grade === 'B').length,
    'C+': performances.filter((p) => p.grade === 'C+').length,
    C: performances.filter((p) => p.grade === 'C').length,
    D: performances.filter((p) => p.grade === 'D').length,
    F: performances.filter((p) => p.grade === 'F').length,
  };

  // Subject-wise performance
  const subjectMap = new Map();
  performances.forEach((p) => {
    const subjectKey = p.subject._id.toString();
    if (!subjectMap.has(subjectKey)) {
      subjectMap.set(subjectKey, {
        subject: p.subject.name,
        code: p.subject.code,
        totalMarks: 0,
        count: 0,
        students: [],
      });
    }
    const subjectData = subjectMap.get(subjectKey);
    subjectData.totalMarks += p.percentage;
    subjectData.count += 1;
    subjectData.students.push({
      name: p.student.name,
      studentId: p.student.studentId,
      marks: p.percentage,
      grade: p.grade,
    });
  });

  const subjectPerformance = Array.from(subjectMap.values()).map((s) => ({
    subject: s.subject,
    code: s.code,
    averageMarks: (s.totalMarks / s.count).toFixed(2),
    totalStudents: s.count,
    topPerformers: s.students
      .sort((a, b) => b.marks - a.marks)
      .slice(0, 3)
      .map((st) => ({
        name: st.name,
        studentId: st.studentId,
        marks: st.marks,
        grade: st.grade,
      })),
  }));

  res.json({
    success: true,
    filter: { grade, semester },
    metrics: {
      totalStudents: students.length,
      totalPerformanceRecords: performances.length,
      averageClassPerformance: avgClassPerformance.toFixed(2),
      passRate: passRate.toFixed(2),
    },
    gradeDistribution,
    subjectPerformance,
  });
});

