import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './PerformanceChart.css';

const PerformanceChart = ({ gradeDistribution }) => {
  // Transform grade distribution object to array for charts
  const chartData = Object.entries(gradeDistribution || {}).map(([grade, count]) => ({
    grade,
    count,
  }));

  // Colors for different grades
  const COLORS = {
    'A+': '#10b981',
    'A': '#34d399',
    'B+': '#60a5fa',
    'B': '#93c5fd',
    'C+': '#fbbf24',
    'C': '#fcd34d',
    'D': '#fb923c',
    'F': '#ef4444',
    'I': '#9ca3af',
  };

  const pieData = chartData.map(item => ({
    name: item.grade,
    value: item.count,
    color: COLORS[item.grade] || '#9ca3af',
  }));

  return (
    <div className="performance-chart">
      <div className="chart-wrapper">
        <h3>Grade Distribution (Bar Chart)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="grade" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#667eea" name="Number of Students" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-wrapper">
        <h3>Grade Distribution (Pie Chart)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Grade Legend */}
      <div className="grade-legend">
        <h4>Grade Reference</h4>
        <div className="legend-grid">
          {Object.entries(COLORS).map(([grade, color]) => (
            <div key={grade} className="legend-item">
              <div className="legend-color" style={{ background: color }}></div>
              <span>{grade}</span>
              <span className="legend-count">({gradeDistribution?.[grade] || 0})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
