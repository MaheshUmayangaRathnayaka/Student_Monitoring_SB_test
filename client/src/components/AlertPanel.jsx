import { useState, useEffect } from 'react';
import { alertService } from '../services';
import { useAuth } from '../context/AuthContext';
import './AlertPanel.css';

const AlertPanel = () => {
  const { role } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thresholds, setThresholds] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, [role]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      
      // Fetch thresholds
      const thresholdsRes = await alertService.getThresholds();
      setThresholds(thresholdsRes.data.thresholds);

      if (role === 'student') {
        // Students see their own alerts
        const response = await alertService.getMyAlerts();
        setAlerts(response.data.alerts || []);
      } else {
        // Teachers/Admins see at-risk students
        const response = await alertService.getAtRiskStudents();
        setAtRiskStudents(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (type) => {
    return type === 'critical' ? '🚨' : '⚠️';
  };

  const getAlertClass = (type) => {
    return type === 'critical' ? 'alert-critical' : 'alert-warning';
  };

  if (loading) {
    return (
      <div className="alert-panel">
        <h2>Alerts & Notifications</h2>
        <p className="loading">Loading alerts...</p>
      </div>
    );
  }

  return (
    <div className="alert-panel">
      <h2>
        {role === 'student' ? 'My Alerts' : 'At-Risk Students'}
      </h2>

      {thresholds && (
        <div className="thresholds-info">
          <h4>Alert Thresholds:</h4>
          <div className="threshold-items">
            <span className="threshold-item">
              🎯 Pass Mark: {thresholds.LOW_MARKS}%
            </span>
            <span className="threshold-item">
              📊 Min Attendance: {thresholds.LOW_ATTENDANCE}%
            </span>
            <span className="threshold-item critical">
              🚨 Critical: {thresholds.CRITICAL_MARKS}%
            </span>
          </div>
        </div>
      )}

      {role === 'student' ? (
        // Student view: Personal alerts
        <div className="alerts-container">
          {alerts.length === 0 ? (
            <div className="no-alerts">
              <span className="success-icon">✅</span>
              <p>Great! You have no alerts.</p>
              <p className="sub-text">Keep up the good work!</p>
            </div>
          ) : (
            <div className="alerts-list">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`alert-card ${getAlertClass(alert.type)}`}
                >
                  <div className="alert-header">
                    <span className="alert-icon">{getAlertIcon(alert.type)}</span>
                    <h4>{alert.title}</h4>
                  </div>
                  <p className="alert-message">{alert.message}</p>
                  {alert.subject && (
                    <p className="alert-subject">
                      📚 Subject: {alert.subject.name} ({alert.subject.code})
                    </p>
                  )}
                  {alert.recommendation && (
                    <div className="alert-recommendation">
                      <strong>💡 Recommendation:</strong>
                      <p>{alert.recommendation}</p>
                    </div>
                  )}
                  <span className={`alert-badge ${alert.category}`}>
                    {alert.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Teacher/Admin view: At-risk students
        <div className="at-risk-container">
          {atRiskStudents.length === 0 ? (
            <div className="no-alerts">
              <span className="success-icon">✅</span>
              <p>No students are currently at risk.</p>
              <p className="sub-text">All students are performing well!</p>
            </div>
          ) : (
            <div className="at-risk-list">
              {atRiskStudents.map((item, index) => (
                <div
                  key={index}
                  className={`at-risk-card alert-${item.alertLevel}`}
                >
                  <div className="student-header">
                    <div className="student-info">
                      <h4>{item.student.name}</h4>
                      <p className="student-id">ID: {item.student.studentId}</p>
                      <p className="student-email">{item.student.email}</p>
                    </div>
                    <span className={`risk-badge ${item.alertLevel}`}>
                      {item.alertLevel.toUpperCase()}
                    </span>
                  </div>

                  <div className="metrics-grid">
                    <div className="metric">
                      <span className="metric-label">Avg Marks</span>
                      <span className={`metric-value ${item.metrics.averageMarks < 40 ? 'critical' : item.metrics.averageMarks < 60 ? 'warning' : 'good'}`}>
                        {item.metrics.averageMarks}%
                      </span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Avg Attendance</span>
                      <span className={`metric-value ${item.metrics.averageAttendance < 65 ? 'critical' : item.metrics.averageAttendance < 75 ? 'warning' : 'good'}`}>
                        {item.metrics.averageAttendance}%
                      </span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Failing Subjects</span>
                      <span className={`metric-value ${item.metrics.failingSubjects > 0 ? 'critical' : 'good'}`}>
                        {item.metrics.failingSubjects}/{item.metrics.totalSubjects}
                      </span>
                    </div>
                  </div>

                  <div className="alerts-summary">
                    {item.alerts.map((alert, idx) => (
                      <div key={idx} className={`mini-alert ${alert.type}`}>
                        <span className="mini-icon">{getAlertIcon(alert.type)}</span>
                        <span className="mini-text">{alert.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertPanel;
