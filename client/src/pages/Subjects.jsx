import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './SubjectManagement.css';

const Subjects = () => {
  const { user, role } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [marks, setMarks] = useState({});
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [zScore, setZScore] = useState(0);
  const [pieChartData, setPieChartData] = useState([]);
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    teacher: '',
    credits: 1,
    semester: '',
    description: ''
  });

  const isTeacher = role === 'teacher' || role === 'admin';
  const isStudent = role === 'student';

  useEffect(() => {
    fetchSubjects();
    if (isTeacher) {
      fetchStudents();
    } else if (isStudent) {
      // For students, automatically load their own performance
      fetchStudentPerformances(user._id || user.id);
    }
  }, [role, user]);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentPerformances();
    }
  }, [selectedStudent]);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    }
  };

  const fetchStudents = async () => {
    if (!isTeacher) return;
    
    try {
      const response = await api.get('/students');
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const fetchStudentPerformances = async (studentId = selectedStudent) => {
    if (!studentId) return;
    
    try {
      const response = await api.get(`/performance/student/${studentId}`);
      setPerformances(response.data || []);
      
      // Initialize marks state
      const initialMarks = {};
      subjects.forEach(subject => {
        const existingPerf = (response.data || []).find(p => p.subject?._id === subject._id);
        initialMarks[subject._id] = {
          internal: existingPerf?.marks?.internal || 0,
          finals: existingPerf?.marks?.finals || 0,
          attendance: existingPerf?.attendance?.percentage || 0
        };
      });
      setMarks(initialMarks);
      
      // Calculate Z-score and pie chart data
      calculateZScore(response.data || [], subjects);
    } catch (error) {
      console.error('Error fetching performances:', error);
      setPerformances([]);
      if (error.message?.includes('Access denied')) {
        alert('Access denied. You can only view your own performance data.');
      }
    }
  };

  const calculateZScore = (performanceData, subjectsData) => {
    if (!performanceData.length || !subjectsData.length) {
      setZScore(0);
      setPieChartData([]);
      return;
    }

    let totalWeightedMarks = 0;
    let totalCredits = 0;
    const chartData = [];
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

    performanceData.forEach((performance, index) => {
      const subject = performance.subject;
      const credits = subject?.credits || 3; // Default to 3 credits if not specified
      const totalMarks = performance.marks?.total || 0;
      
      // Calculate weighted contribution (marks * credits)
      const weightedMarks = totalMarks * credits;
      totalWeightedMarks += weightedMarks;
      totalCredits += credits;

      // Add to pie chart data
      chartData.push({
        name: subject?.name || 'Unknown',
        value: weightedMarks,
        percentage: 0, // Will calculate after we have total
        credits: credits,
        marks: totalMarks,
        fill: colors[index % colors.length]
      });
    });

    // Calculate Z-score (weighted average)
    const calculatedZScore = totalCredits > 0 ? (totalWeightedMarks / totalCredits) : 0;
    
    // Update percentages for pie chart
    chartData.forEach(item => {
      item.percentage = totalWeightedMarks > 0 ? ((item.value / totalWeightedMarks) * 100).toFixed(1) : 0;
    });

    setZScore(calculatedZScore);
    setPieChartData(chartData);
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    if (!isTeacher) {
      alert('Only teachers can add subjects');
      return;
    }
    
    setLoading(true);
    
    try {
      await api.post('/subjects', subjectForm);
      setSubjectForm({
        name: '',
        code: '',
        teacher: '',
        credits: 1,
        semester: '',
        description: ''
      });
      setShowSubjectForm(false);
      await fetchSubjects();
      
      // Refresh marks table if a student is selected
      if (selectedStudent) {
        await fetchStudentPerformances();
      }
      
      alert('Subject created successfully!');
    } catch (error) {
      alert(error.message || 'Error creating subject');
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (subjectId, field, value) => {
    if (!isTeacher) return;
    
    const newMarks = {
      ...marks,
      [subjectId]: {
        ...marks[subjectId],
        [field]: Math.max(0, Number(value))
      }
    };
    setMarks(newMarks);
    
    // Recalculate Z-score with current marks
    const updatedPerformances = performances.map(perf => {
      if (perf.subject?._id === subjectId) {
        const currentMarks = newMarks[subjectId];
        return {
          ...perf,
          marks: {
            ...perf.marks,
            internal: currentMarks.internal,
            finals: currentMarks.finals,
            total: currentMarks.internal + currentMarks.finals
          }
        };
      }
      return perf;
    });
    
    calculateZScore(updatedPerformances, subjects);
  };

  const handleSaveMarks = async (subjectId) => {
    if (!isTeacher) {
      alert('Only teachers can modify marks');
      return;
    }
    
    if (!selectedStudent) {
      alert('Please select a student first');
      return;
    }

    setLoading(true);
    try {
      const markData = marks[subjectId];
      const performanceData = {
        student: selectedStudent,
        subject: subjectId,
        marks: {
          internal: markData.internal,
          finals: markData.finals,
          total: markData.internal + markData.finals
        },
        attendance: {
          percentage: markData.attendance
        }
      };

      // Check if performance already exists
      const existingPerf = performances.find(p => p.subject?._id === subjectId);
      
      if (existingPerf) {
        await api.put(`/performance/${existingPerf._id}`, performanceData);
      } else {
        await api.post('/performance', performanceData);
      }
      
      await fetchStudentPerformances();
      alert('Marks saved successfully!');
    } catch (error) {
      alert(error.message || 'Error saving marks');
    } finally {
      setLoading(false);
    }
  };

  // Student view - only show their own marks
  if (isStudent) {
    return (
      <div className="subjects-container">
        <div className="subjects-header">
          <h1>My Performance</h1>
          <div className="student-info">
            <p><strong>Student:</strong> {user.name}</p>
            {user.studentId && <p><strong>ID:</strong> {user.studentId}</p>}
          </div>
        </div>

        <div className="subjects-list">
          <h2>Available Subjects ({subjects.length})</h2>
          <div className="subjects-grid">
            {subjects.map(subject => (
              <div key={subject._id} className="subject-card">
                <h3>{subject.name}</h3>
                <p><strong>Code:</strong> {subject.code}</p>
                <p><strong>Teacher:</strong> {subject.teacher}</p>
                <p><strong>Credits:</strong> {subject.credits}</p>
                <p><strong>Semester:</strong> {subject.semester}</p>
                {subject.description && <p><strong>Description:</strong> {subject.description}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="marks-display">
          <h2>My Marks</h2>
          {performances.length > 0 ? (
            <div className="marks-table">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Subject Code</th>
                    <th>Internal Marks</th>
                    <th>Final Marks</th>
                    <th>Total</th>
                    <th>Attendance %</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {performances.slice(0, 3).map(performance => (
                    <tr key={performance._id}>
                      <td>{performance.subject?.name}</td>
                      <td>{performance.subject?.code}</td>
                      <td>{performance.marks?.internal}</td>
                      <td>{performance.marks?.finals}</td>
                      <td className="total-marks">{performance.marks?.total}</td>
                      <td>{performance.attendance?.percentage}%</td>
                      <td><span className={`grade grade-${performance.grade?.toLowerCase()}`}>{performance.grade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">
              <p>No performance data available yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Teacher view - can manage subjects and marks
  return (
    <div className="subjects-container">
      <div className="subjects-header">
        <h1>Subject Management</h1>
        <div className="teacher-info">
          <p><strong>Teacher:</strong> {user.name}</p>
          <button 
            className="btn-primary"
            onClick={() => setShowSubjectForm(!showSubjectForm)}
          >
            {showSubjectForm ? 'Cancel' : 'Add Subject'}
          </button>
        </div>
      </div>

      {showSubjectForm && (
        <div className="subject-form-container">
          <h2>Create New Subject</h2>
          <form onSubmit={handleSubjectSubmit} className="subject-form">
            <div className="form-row">
              <div className="form-group">
                <label>Subject Name *</label>
                <input
                  type="text"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Subject Code *</label>
                <input
                  type="text"
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm({...subjectForm, code: e.target.value.toUpperCase()})}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Teacher *</label>
                <input
                  type="text"
                  value={subjectForm.teacher}
                  onChange={(e) => setSubjectForm({...subjectForm, teacher: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Credits *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={subjectForm.credits}
                  onChange={(e) => setSubjectForm({...subjectForm, credits: Number(e.target.value)})}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Semester *</label>
                <select
                  value={subjectForm.semester}
                  onChange={(e) => setSubjectForm({...subjectForm, semester: e.target.value})}
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="1st">1st Semester</option>
                  <option value="2nd">2nd Semester</option>
                  <option value="3rd">3rd Semester</option>
                  <option value="4th">4th Semester</option>
                  <option value="5th">5th Semester</option>
                  <option value="6th">6th Semester</option>
                  <option value="7th">7th Semester</option>
                  <option value="8th">8th Semester</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({...subjectForm, description: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Subject'}
            </button>
          </form>
        </div>
      )}

      <div className="subjects-list">
        <h2>Available Subjects ({subjects.length})</h2>
        <div className="subjects-grid">
          {subjects.map(subject => (
            <div key={subject._id} className="subject-card">
              <h3>{subject.name}</h3>
              <p><strong>Code:</strong> {subject.code}</p>
              <p><strong>Teacher:</strong> {subject.teacher}</p>
              <p><strong>Credits:</strong> {subject.credits}</p>
              <p><strong>Semester:</strong> {subject.semester}</p>
              {subject.description && <p><strong>Description:</strong> {subject.description}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="marks-management">
        <h2>Student Marks Management</h2>
        
        <div className="student-selector">
          <label>Select Student:</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Choose a student...</option>
            {students.map(student => (
              <option key={student._id} value={student._id}>
                {student.name} ({student.studentId})
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && subjects.length > 0 && (
          <div className="marks-table">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Subject Code</th>
                  <th>Internal Marks (0-50)</th>
                  <th>Final Marks (0-50)</th>
                  <th>Total (0-100)</th>
                  <th>Attendance %</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {subjects.slice(0, 3).map(subject => { // Limit to 3 subjects as requested
                  const subjectMarks = marks[subject._id] || { internal: 0, finals: 0, attendance: 0 };
                  const total = subjectMarks.internal + subjectMarks.finals;
                  
                  return (
                    <tr key={subject._id}>
                      <td>{subject.name}</td>
                      <td>{subject.code}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={subjectMarks.internal}
                          onChange={(e) => handleMarksChange(subject._id, 'internal', e.target.value)}
                          className="marks-input"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={subjectMarks.finals}
                          onChange={(e) => handleMarksChange(subject._id, 'finals', e.target.value)}
                          className="marks-input"
                        />
                      </td>
                      <td className="total-marks">{total}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={subjectMarks.attendance}
                          onChange={(e) => handleMarksChange(subject._id, 'attendance', e.target.value)}
                          className="marks-input"
                        />
                      </td>
                      <td>
                        <button
                          className="btn-save"
                          onClick={() => handleSaveMarks(subject._id)}
                          disabled={loading}
                        >
                          {loading ? 'Saving...' : 'Save'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {selectedStudent && performances.length > 0 && (
          <div className="zscore-section">
            <h3>Performance Analytics</h3>
            <div className="analytics-container">
              <div className="zscore-display">
                <h4>Z-Score (Credit-Weighted Average)</h4>
                <div className="zscore-value">
                  {zScore.toFixed(2)}/100
                </div>
                <div className="zscore-percentage">
                  {((zScore / 100) * 100).toFixed(1)}%
                </div>
              </div>
              
              {pieChartData.length > 0 && (
                <div className="pie-chart-container">
                  <h4>Subject Contribution to Z-Score</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `Weighted Score: ${value.toFixed(1)}`,
                          `${props.payload.name} (${props.payload.credits} credits, ${props.payload.marks}/100 marks)`
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="subject-breakdown">
                    <h5>Subject Breakdown:</h5>
                    {pieChartData.map((subject, index) => (
                      <div key={index} className="subject-item">
                        <span className="subject-color" style={{backgroundColor: subject.fill}}></span>
                        <span className="subject-name">{subject.name}</span>
                        <span className="subject-details">
                          {subject.marks}/100 × {subject.credits} credits = {subject.value} weighted points ({subject.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;
