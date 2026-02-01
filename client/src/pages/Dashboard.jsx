import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { performanceService, studentService, subjectService } from '../services';
import './Dashboard.css';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsData, studentsData, subjectsData] = await Promise.all([
        performanceService.getAnalytics(),
        studentService.getAll(),
        subjectService.getAll(),
      ]);

      setAnalytics(analyticsData.data);
      setStudents(studentsData.data);
      setSubjects(subjectsData.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const atRiskStudents = students.filter((student) => {
    // This is a placeholder - would need performance data
    return false;
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Performance Dashboard</h1>
        <p>Monitor student performance and analytics</p>
      </div>

      {/* Analytics Cards */}
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="card-icon" style={{ background: '#667eea' }}>
            📊
          </div>
          <div className="card-content">
            <h3>Average Marks</h3>
            <p className="card-value">
              {analytics?.averageMarks || 0}
              <span className="card-unit">/150</span>
            </p>
            <p className="card-subtitle">Overall Performance</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon" style={{ background: '#f093fb' }}>
            ✅
          </div>
          <div className="card-content">
            <h3>Pass Rate</h3>
            <p className="card-value">
              {analytics?.passRate || 0}
              <span className="card-unit">%</span>
            </p>
            <p className="card-subtitle">Students Passing</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon" style={{ background: '#4facfe' }}>
            📅
          </div>
          <div className="card-content">
            <h3>Attendance</h3>
            <p className="card-value">
              {analytics?.averageAttendance || 0}
              <span className="card-unit">%</span>
            </p>
            <p className="card-subtitle">Average Attendance</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon" style={{ background: '#fa709a' }}>
            ⚠️
          </div>
          <div className="card-content">
            <h3>At Risk</h3>
            <p className="card-value">{analytics?.studentsAtRisk || 0}</p>
            <p className="card-subtitle">Students Need Attention</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-value">{students.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Subjects</h3>
          <p className="stat-value">{subjects.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Records</h3>
          <p className="stat-value">{analytics?.totalRecords || 0}</p>
        </div>
      </div>

      {/* Core Subject Articles */}
      <div className="core-subjects-section">
        <h2>📚 Core Subject Articles</h2>
        <div className="subject-links-grid">
          <Link to="/subjects/technical-drawing" className="subject-link-card">
            <div className="subject-icon">📐</div>
            <h3>Technical Drawing & Design</h3>
            <p>Engineering Graphics & CAD</p>
            <span className="read-more">Read Article →</span>
          </Link>

          <Link to="/subjects/environmental-engineering" className="subject-link-card">
            <div className="subject-icon">🌱</div>
            <h3>Environmental Engineering</h3>
            <p>Sustainability & Environment</p>
            <span className="read-more">Read Article →</span>
          </Link>

          <Link to="/subjects/fluid-mechanics" className="subject-link-card">
            <div className="subject-icon">💧</div>
            <h3>Fluid Mechanics</h3>
            <p>Mechanical Engineering</p>
            <span className="read-more">Read Article →</span>
          </Link>

          <Link to="/subjects/simple-mathematics" className="subject-link-card">
            <div className="subject-icon">🔢</div>
            <h3>Simple Mathematics</h3>
            <p>Foundation Mathematics</p>
            <span className="read-more">Read Article →</span>
          </Link>

          <Link to="/subjects/fundamentals-of-electronics" className="subject-link-card">
            <div className="subject-icon">⚡</div>
            <h3>Fundamentals of Electronics</h3>
            <p>Electrical Engineering</p>
            <span className="read-more">Read Article →</span>
          </Link>

          <Link to="/subjects/engineering-ethics" className="subject-link-card">
            <div className="subject-icon">⚖️</div>
            <h3>Engineering Ethics</h3>
            <p>Professional Development</p>
            <span className="read-more">Read Article →</span>
          </Link>
        </div>
      </div>

      {/* Alerts Section */}
      {analytics?.studentsAtRisk > 0 && (
        <div className="alerts-section">
          <h2>⚠️ Attendance Alerts</h2>
          <div className="alert-box">
            <p>
              <strong>{analytics.studentsAtRisk}</strong> students have
              attendance below 75% or are at risk of failing.
            </p>
            <button className="btn btn-secondary">View Details</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
