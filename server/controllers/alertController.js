import Performance from '../models/Performance.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// Alert thresholds configuration
const ALERT_THRESHOLDS = {
  LOW_MARKS: 40, // Below 40%
  LOW_ATTENDANCE: 75, // Below 75%
  CRITICAL_MARKS: 33, // Below 33%
  CRITICAL_ATTENDANCE: 65, // Below 65%
};

// @desc    Get at-risk students with alerts
// @route   GET /api/alerts/at-risk
// @access  Private/Teacher/Admin
export const getAtRiskStudents = asyncHandler(async (req, res) => {
  // Get all students with their performance data
  const students = await User.find({ role: 'student', isActive: true })
    .select('name email studentId grade semester');

  const atRiskStudents = [];

  for (const student of students) {
    // Get all performance records for this student
    const performances = await Performance.find({ student: student._id })
      .populate('subject', 'name code');

    if (performances.length === 0) continue;

    // Calculate averages
    const totalPercentage = performances.reduce((sum, p) => sum + p.percentage, 0);
    const avgPercentage = totalPercentage / performances.length;

    const totalAttendance = performances.reduce((sum, p) => sum + p.attendancePercentage, 0);
    const avgAttendance = totalAttendance / performances.length;

    // Determine alert level
    const alerts = [];
    let alertLevel = 'none';

    if (avgPercentage < ALERT_THRESHOLDS.CRITICAL_MARKS) {
      alerts.push({
        type: 'critical',
        category: 'marks',
        message: `Critical: Average marks ${avgPercentage.toFixed(2)}% (below ${ALERT_THRESHOLDS.CRITICAL_MARKS}%)`,
      });
      alertLevel = 'critical';
    } else if (avgPercentage < ALERT_THRESHOLDS.LOW_MARKS) {
      alerts.push({
        type: 'warning',
        category: 'marks',
        message: `Warning: Average marks ${avgPercentage.toFixed(2)}% (below ${ALERT_THRESHOLDS.LOW_MARKS}%)`,
      });
      if (alertLevel !== 'critical') alertLevel = 'warning';
    }

    if (avgAttendance < ALERT_THRESHOLDS.CRITICAL_ATTENDANCE) {
      alerts.push({
        type: 'critical',
        category: 'attendance',
        message: `Critical: Average attendance ${avgAttendance.toFixed(2)}% (below ${ALERT_THRESHOLDS.CRITICAL_ATTENDANCE}%)`,
      });
      alertLevel = 'critical';
    } else if (avgAttendance < ALERT_THRESHOLDS.LOW_ATTENDANCE) {
      alerts.push({
        type: 'warning',
        category: 'attendance',
        message: `Warning: Average attendance ${avgAttendance.toFixed(2)}% (below ${ALERT_THRESHOLDS.LOW_ATTENDANCE}%)`,
      });
      if (alertLevel !== 'critical') alertLevel = 'warning';
    }

    // Check for failing subjects
    const failingSubjects = performances.filter(p => p.percentage < 40);
    if (failingSubjects.length > 0) {
      alerts.push({
        type: 'warning',
        category: 'subjects',
        message: `Failing in ${failingSubjects.length} subject(s)`,
        subjects: failingSubjects.map(p => ({
          name: p.subject.name,
          code: p.subject.code,
          percentage: p.percentage,
        })),
      });
    }

    if (alerts.length > 0) {
      atRiskStudents.push({
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          studentId: student.studentId,
          grade: student.grade,
          semester: student.semester,
        },
        metrics: {
          averageMarks: avgPercentage.toFixed(2),
          averageAttendance: avgAttendance.toFixed(2),
          totalSubjects: performances.length,
          failingSubjects: failingSubjects.length,
        },
        alertLevel,
        alerts,
      });
    }
  }

  // Sort by alert level (critical first)
  atRiskStudents.sort((a, b) => {
    if (a.alertLevel === 'critical' && b.alertLevel !== 'critical') return -1;
    if (a.alertLevel !== 'critical' && b.alertLevel === 'critical') return 1;
    return 0;
  });

  res.json({
    success: true,
    count: atRiskStudents.length,
    thresholds: ALERT_THRESHOLDS,
    data: atRiskStudents,
  });
});

// @desc    Get student-specific alerts
// @route   GET /api/alerts/my-alerts
// @access  Private/Student
export const getMyAlerts = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  // Get all performance records for this student
  const performances = await Performance.find({ student: studentId })
    .populate('subject', 'name code credits');

  if (performances.length === 0) {
    return res.json({
      success: true,
      alerts: [],
      message: 'No performance records found',
    });
  }

  // Calculate metrics
  const totalPercentage = performances.reduce((sum, p) => sum + p.percentage, 0);
  const avgPercentage = totalPercentage / performances.length;

  const totalAttendance = performances.reduce((sum, p) => sum + p.attendancePercentage, 0);
  const avgAttendance = totalAttendance / performances.length;

  const alerts = [];

  // Check overall performance
  if (avgPercentage < ALERT_THRESHOLDS.CRITICAL_MARKS) {
    alerts.push({
      type: 'critical',
      category: 'overall',
      title: 'Critical: Low Overall Performance',
      message: `Your average is ${avgPercentage.toFixed(2)}%. Immediate attention required!`,
      recommendation: 'Please contact your teachers and schedule extra study sessions.',
    });
  } else if (avgPercentage < ALERT_THRESHOLDS.LOW_MARKS) {
    alerts.push({
      type: 'warning',
      category: 'overall',
      title: 'Warning: Below Average Performance',
      message: `Your average is ${avgPercentage.toFixed(2)}%. Focus on improvement.`,
      recommendation: 'Review your weak subjects and seek help from teachers.',
    });
  }

  // Check attendance
  if (avgAttendance < ALERT_THRESHOLDS.CRITICAL_ATTENDANCE) {
    alerts.push({
      type: 'critical',
      category: 'attendance',
      title: 'Critical: Low Attendance',
      message: `Your attendance is ${avgAttendance.toFixed(2)}%. This may affect your eligibility!`,
      recommendation: 'Improve your attendance immediately. Minimum 75% required.',
    });
  } else if (avgAttendance < ALERT_THRESHOLDS.LOW_ATTENDANCE) {
    alerts.push({
      type: 'warning',
      category: 'attendance',
      title: 'Warning: Attendance Below Requirement',
      message: `Your attendance is ${avgAttendance.toFixed(2)}%. Aim for 75% minimum.`,
      recommendation: 'Attend classes regularly to meet the minimum requirement.',
    });
  }

  // Check individual subjects
  performances.forEach((performance) => {
    if (performance.percentage < ALERT_THRESHOLDS.CRITICAL_MARKS) {
      alerts.push({
        type: 'critical',
        category: 'subject',
        title: `Critical: Failing in ${performance.subject.name}`,
        message: `You scored ${performance.percentage.toFixed(2)}% in ${performance.subject.name}.`,
        subject: {
          name: performance.subject.name,
          code: performance.subject.code,
        },
        recommendation: 'Schedule remedial classes and extra practice for this subject.',
      });
    } else if (performance.percentage < ALERT_THRESHOLDS.LOW_MARKS) {
      alerts.push({
        type: 'warning',
        category: 'subject',
        title: `Warning: Low Score in ${performance.subject.name}`,
        message: `You scored ${performance.percentage.toFixed(2)}% in ${performance.subject.name}.`,
        subject: {
          name: performance.subject.name,
          code: performance.subject.code,
        },
        recommendation: 'Focus more on this subject to improve your grade.',
      });
    }

    // Check subject-specific attendance
    if (performance.attendancePercentage < ALERT_THRESHOLDS.LOW_ATTENDANCE) {
      alerts.push({
        type: 'warning',
        category: 'subject-attendance',
        title: `Low Attendance in ${performance.subject.name}`,
        message: `Your attendance in ${performance.subject.name} is ${performance.attendancePercentage.toFixed(2)}%.`,
        subject: {
          name: performance.subject.name,
          code: performance.subject.code,
        },
        recommendation: 'Attend all classes for this subject.',
      });
    }
  });

  res.json({
    success: true,
    count: alerts.length,
    metrics: {
      averageMarks: avgPercentage.toFixed(2),
      averageAttendance: avgAttendance.toFixed(2),
      totalSubjects: performances.length,
    },
    thresholds: ALERT_THRESHOLDS,
    alerts,
  });
});

// @desc    Get alert thresholds configuration
// @route   GET /api/alerts/thresholds
// @access  Private
export const getAlertThresholds = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    thresholds: ALERT_THRESHOLDS,
  });
});

