import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './SubjectPerformanceRadar.css';

const SubjectPerformanceRadar = ({ data, title = 'Subject-wise Performance Analysis' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="radar-chart-container">
        <h3>{title}</h3>
        <p className="no-data">No performance data available</p>
      </div>
    );
  }

  // Transform data for radar chart
  const radarData = data.map((item) => ({
    subject: item.subjectCode || item.subject,
    Marks: item.marks || item.percentage,
    Attendance: item.attendance || item.attendancePercentage,
  }));

  return (
    <div className="radar-chart-container">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b' }} />
          <Radar
            name="Marks (%)"
            dataKey="Marks"
            stroke="#667eea"
            fill="#667eea"
            fillOpacity={0.6}
          />
          <Radar
            name="Attendance (%)"
            dataKey="Attendance"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.4}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {data.length > 0 && (
        <div className="performance-summary">
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total Subjects:</span>
              <span className="stat-value">{data.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg Marks:</span>
              <span className="stat-value">
                {(data.reduce((sum, item) => sum + (item.marks || 0), 0) / data.length).toFixed(2)}%
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg Attendance:</span>
              <span className="stat-value">
                {(data.reduce((sum, item) => sum + (item.attendance || 0), 0) / data.length).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectPerformanceRadar;
