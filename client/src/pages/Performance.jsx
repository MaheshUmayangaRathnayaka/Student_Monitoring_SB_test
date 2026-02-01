import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import PerformanceChart from '../components/PerformanceChart';
import './SubjectManagement.css';
import './SubjectAverages.css';

const Performance = () => {
  const { user, role } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [marks, setMarks] = useState({});
  const [savedMarks, setSavedMarks] = useState({}); // Track saved state
  const [unsavedChanges, setUnsavedChanges] = useState(new Set()); // Track which subjects have unsaved changes
  const [loading, setLoading] = useState(false);
  const [loadingStudent, setLoadingStudent] = useState(false); // Loading state for student data
  const [savingSubject, setSavingSubject] = useState(null); // Track which subject is being saved
  const [zScore, setZScore] = useState(0);
  const [pieChartData, setPieChartData] = useState([]);
  const [subjectAverages, setSubjectAverages] = useState([]);

  const isTeacher = role === 'teacher' || role === 'admin';
  const isStudent = role === 'student';

  useEffect(() => {
    fetchSubjects();
    if (isTeacher) {
      fetchStudents();
      calculateSubjectAverages();
    } else if (isStudent) {
      // For students, automatically load their own performance
      fetchStudentPerformances(user._id || user.id);
    }
    
    // Check server connection status
    checkServerConnection();
  }, [role, user]);

  useEffect(() => {
    if (selectedStudent && subjects.length > 0) {
      // Clear previous student's data first
      setMarks({});
      setSavedMarks({});
      setUnsavedChanges(new Set());
      setPerformances([]);
      setPieChartData([]);
      setZScore(0);
      
      // Then fetch new student's data
      fetchStudentPerformances();
    } else if (!selectedStudent) {
      // Clear everything when no student is selected
      setMarks({});
      setSavedMarks({});
      setUnsavedChanges(new Set());
      setPerformances([]);
      setPieChartData([]);
      setZScore(0);
    }
  }, [selectedStudent, subjects.length]);

  const checkServerConnection = async () => {
    try {
      await api.get('/subjects');
      const statusEl = document.getElementById('connection-status');
      if (statusEl) {
        statusEl.textContent = 'Connected';
        statusEl.parentElement.className = 'server-status connected';
      }
    } catch (error) {
      const statusEl = document.getElementById('connection-status');
      if (statusEl) {
        statusEl.textContent = 'Disconnected';
        statusEl.parentElement.className = 'server-status disconnected';
      }
      console.warn('⚠️ Server connection failed');
    }
  };

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

  const calculateSubjectAverages = async () => {
    if (!isTeacher) return;
    
    try {
      // Fetch all performances
      const response = await api.get('/performance');
      const allPerformances = response.data || [];
      
      // Group performances by subject and calculate averages
      const subjectMap = {};
      
      allPerformances.forEach(perf => {
        const subjectId = perf.subject?._id;
        const subjectName = perf.subject?.name || 'Unknown';
        const totalMarks = perf.marks?.total || 0;
        
        if (!subjectMap[subjectId]) {
          subjectMap[subjectId] = {
            name: subjectName,
            totalMarks: 0,
            count: 0
          };
        }
        
        subjectMap[subjectId].totalMarks += totalMarks;
        subjectMap[subjectId].count += 1;
      });
      
      // Calculate averages and format for bar chart
      const averagesData = Object.values(subjectMap).map(subject => ({
        name: subject.name,
        average: subject.count > 0 ? (subject.totalMarks / subject.count).toFixed(2) : 0,
        students: subject.count
      }));
      
      setSubjectAverages(averagesData);
    } catch (error) {
      console.error('Error calculating subject averages:', error);
      setSubjectAverages([]);
    }
  };

  const fetchStudentPerformances = async (studentId = selectedStudent) => {
    if (!studentId) {
      // Clear all data if no student
      setPerformances([]);
      setMarks({});
      setSavedMarks({});
      setUnsavedChanges(new Set());
      setPieChartData([]);
      setZScore(0);
      setLoadingStudent(false);
      return;
    }
    
    setLoadingStudent(true);
    try {
      console.log(`🔄 Loading marks for student: ${studentId}`);
      const response = await api.get(`/performance/student/${studentId}`);
      
      // Handle both direct array and data wrapper responses
      const performanceData = Array.isArray(response) ? response : (response.data || []);
      
      console.log(`📊 Found ${performanceData.length} performance records for student`);
      setPerformances(performanceData);
      
      // Initialize marks state for ALL subjects (even those without performance records)
      const initialMarks = {};
      subjects.forEach(subject => {
        const existingPerf = performanceData.find(p => p.subject?._id === subject._id);
        
        if (existingPerf) {
          console.log(`✅ Loading saved marks for ${subject.name}:`, existingPerf.marks);
        }
        
        initialMarks[subject._id] = {
          internal: existingPerf?.marks?.internal || 0,
          finals: existingPerf?.marks?.finals || 0,
          attendance: existingPerf?.attendance?.percentage || 0,
          _id: existingPerf?._id || null // Store performance ID for updates
        };
      });
      
      console.log('📊 Final loaded marks state:', initialMarks);
      setMarks(initialMarks);
      setSavedMarks(JSON.parse(JSON.stringify(initialMarks))); // Deep copy for comparison
      setUnsavedChanges(new Set()); // Clear unsaved changes
      
      // Calculate Z-score and pie chart data with the correct data
      calculateZScore(performanceData, subjects);
    } catch (error) {
      console.error('❌ Error fetching performances:', error);
      setPerformances([]);
      setMarks({});
      setSavedMarks({});
      
      if (!error.response) {
        console.warn('⚠️ Server connection failed - using offline mode');
        // Don't show alert for connection errors, just log
      } else if (error.message?.includes('Access denied')) {
        alert('Access denied. You can only view your own performance data.');
      } else {
        console.warn('⚠️ Error loading student data:', error.message);
      }
    } finally {
      setLoadingStudent(false);
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

  const handleMarksChange = (subjectId, field, value) => {
    if (!isTeacher) return;
    
    const newValue = Math.max(0, Number(value));
    console.log(`📝 Changing ${field} for subject ${subjectId}: ${newValue}`);
    
    const newMarks = {
      ...marks,
      [subjectId]: {
        ...marks[subjectId],
        [field]: newValue
      }
    };
    setMarks(newMarks);
    
    // Track unsaved changes
    const hasChanges = savedMarks[subjectId] && (
      newMarks[subjectId].internal !== savedMarks[subjectId].internal ||
      newMarks[subjectId].finals !== savedMarks[subjectId].finals ||
      newMarks[subjectId].attendance !== savedMarks[subjectId].attendance
    );
    
    const newUnsavedChanges = new Set(unsavedChanges);
    if (hasChanges) {
      newUnsavedChanges.add(subjectId);
      console.log(`⚠️ Subject ${subjectId} has unsaved changes`);
    } else {
      newUnsavedChanges.delete(subjectId);
    }
    setUnsavedChanges(newUnsavedChanges);
    
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
      alert('Only teachers can modify marks. Please login as a teacher.');
      return;
    }
    
    if (!selectedStudent) {
      alert('Please select a student first');
      return;
    }

    setSavingSubject(subjectId);
    try {
      const markData = marks[subjectId];
      const performanceData = {
        student: selectedStudent,
        subject: subjectId,
        marks: {
          internal: markData.internal || 0,
          finals: markData.finals || 0,
          total: (markData.internal || 0) + (markData.finals || 0)
        },
        attendance: {
          percentage: markData.attendance || 0,
          present: 0,
          total: 0
        },
        semester: '1st',
        academicYear: '2024-2025'
      };

      // Check if performance already exists
      const existingPerf = performances.find(p => p.subject?._id === subjectId);
      
      let result;
      if (existingPerf) {
        result = await api.put(`/performance/${existingPerf._id}`, performanceData);
        console.log('✅ Marks UPDATED in database for subject:', subjectId, result);
      } else {
        result = await api.post('/performance', performanceData);
        console.log('✅ Marks CREATED in database for subject:', subjectId, result);
      }
      
      // Update the performances array with the new/updated data
      const updatedPerformances = existingPerf
        ? performances.map(p => p.subject?._id === subjectId ? (result.data || result) : p)
        : [...performances, (result.data || result)];
      setPerformances(updatedPerformances);
      
      // Update saved marks state to reflect what's now in the database
      const updatedSavedMarks = { ...savedMarks };
      updatedSavedMarks[subjectId] = { 
        ...markData,
        _id: (result.data || result)._id // Store the performance ID
      };
      setSavedMarks(updatedSavedMarks);
      
      // Remove from unsaved changes
      const newUnsavedChanges = new Set(unsavedChanges);
      newUnsavedChanges.delete(subjectId);
      setUnsavedChanges(newUnsavedChanges);
      
      // Refresh data
      await fetchStudentPerformances();
      await calculateSubjectAverages();
      
      // Show success message
      const subjectName = subjects.find(s => s._id === subjectId)?.name || 'Subject';
      console.log(`✅ SUCCESS: Marks saved for ${subjectName}`);
      alert(`✅ Marks saved successfully for ${subjectName}!`);
    } catch (error) {
      console.error('❌ Error saving marks:', error);
      
      let errorMessage = 'Failed to save marks';
      
      // Handle network/connection errors
      if (!error.response) {
        errorMessage = 'Cannot connect to server. Please check if the server is running.';
      } else if (error.response?.data) {
        const data = error.response.data;
        errorMessage = data.message || errorMessage;
        if (data.error) {
          errorMessage += '\nDetails: ' + data.error;
        }
        if (data.details && Array.isArray(data.details)) {
          errorMessage += '\nValidation errors:\n' + data.details.map(d => `- ${d.field}: ${d.message}`).join('\n');
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert('❌ ' + errorMessage);
    } finally {
      setSavingSubject(null);
    }
  };

  const handleSaveAllMarks = async () => {
    if (!isTeacher) {
      alert('Only teachers can modify marks.');
      return;
    }
    
    if (!selectedStudent) {
      alert('Please select a student first');
      return;
    }

    if (unsavedChanges.size === 0) {
      alert('No unsaved changes to save');
      return;
    }

    const confirmation = confirm(`Save marks for ${unsavedChanges.size} subject(s)?`);
    if (!confirmation) return;

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const subjectId of unsavedChanges) {
      try {
        const markData = marks[subjectId];
        const performanceData = {
          student: selectedStudent,
          subject: subjectId,
          marks: {
            internal: markData.internal || 0,
            finals: markData.finals || 0,
            total: (markData.internal || 0) + (markData.finals || 0)
          },
          attendance: {
            percentage: markData.attendance || 0,
            present: 0,
            total: 0
          },
          semester: '1st',
          academicYear: '2024-2025'
        };

        const existingPerf = performances.find(p => p.subject?._id === subjectId);
        
        let result;
        if (existingPerf) {
          result = await api.put(`/performance/${existingPerf._id}`, performanceData);
        } else {
          result = await api.post('/performance', performanceData);
        }
        
        // Update performances array with saved data
        const updatedPerf = existingPerf
          ? performances.map(p => p.subject?._id === subjectId ? (result.data || result) : p)
          : [...performances, (result.data || result)];
        setPerformances(updatedPerf);
        
        successCount++;
      } catch (error) {
        errorCount++;
        const subjectName = subjects.find(s => s._id === subjectId)?.name || subjectId;
        errors.push(subjectName);
      }
    }

    // Clear unsaved changes for successful saves
    setUnsavedChanges(new Set());
    
    // Update saved marks to match current marks
    const updatedSavedMarks = JSON.parse(JSON.stringify(marks));
    setSavedMarks(updatedSavedMarks);
    
    console.log(`💾 Saved All: ${successCount} subjects saved successfully`);
    
    // Refresh data
    await fetchStudentPerformances();
    await calculateSubjectAverages();
    setLoading(false);

    // Show summary
    let message = `✅ Successfully saved ${successCount} subject(s)`;
    if (errorCount > 0) {
      message += `\n❌ Failed to save ${errorCount} subject(s): ${errors.join(', ')}`;
    }
    alert(message);
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
                  {performances.map(performance => (
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

  // Teacher view - can manage student marks
  return (
    <div className="subjects-container">
      <div className="subjects-header">
        <h1>Performance Management</h1>
        <div className="teacher-info">
          <p><strong>Teacher:</strong> {user.name}</p>
        </div>
      </div>

      <div className="marks-management">
        <div className="marks-management-header">
          <h2>Student Marks Management</h2>
          <div className="header-actions">
            <div className="server-status">
              <span className="status-indicator" title="Server connection status">
                🔗 Server: <span id="connection-status">Checking...</span>
              </span>
            </div>
          </div>
        </div>

        
        <div className="student-selector">
          <label>Select Student to View/Edit Their Marks:</label>
          <select
            value={selectedStudent}
            onChange={(e) => {
              const newStudentId = e.target.value;
              console.log(`👤 SWITCHING to student: ${newStudentId || 'None'}`);
              
              // Immediately clear all data to prevent mixing
              setMarks({});
              setSavedMarks({});
              setUnsavedChanges(new Set());
              setPerformances([]);
              setPieChartData([]);
              setZScore(0);
              
              // Then set the new student
              setSelectedStudent(newStudentId);
            }}
            className="student-dropdown"
          >
            <option value="">-- Choose a student --</option>
            {students.map(student => (
              <option key={student._id} value={student._id}>
                {student.name} ({student.studentId}) - {student.email}
              </option>
            ))}
          </select>
          {selectedStudent && (
            <div className="selected-student-indicator">
              ✓ Currently viewing: <strong>{students.find(s => s._id === selectedStudent)?.name}</strong>
            </div>
          )}
        </div>

        {loadingStudent && (
          <div className="loading-student-data">
            <div className="spinner"></div>
            <p>Loading student marks...</p>
          </div>
        )}

        {selectedStudent && subjects.length > 0 && !loadingStudent && (
          <>
            <div className="student-marks-header">
              <div className="selected-student-info">
                <h3>📊 Marks Entry for: {students.find(s => s._id === selectedStudent)?.name}</h3>
                <div className="student-details">
                  <span className="student-detail-item">
                    <strong>Student ID:</strong> {students.find(s => s._id === selectedStudent)?.studentId}
                  </span>
                  <span className="student-detail-item">
                    <strong>Email:</strong> {students.find(s => s._id === selectedStudent)?.email}
                  </span>
                  <span className="student-detail-item">
                    <strong>Semester:</strong> {students.find(s => s._id === selectedStudent)?.semester || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="marks-actions">
              <div className="unsaved-indicator">
                {unsavedChanges.size > 0 && (
                  <span className="unsaved-badge">
                    ⚠️ {unsavedChanges.size} unsaved change{unsavedChanges.size !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
            <div className="marks-table">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Subject</th>
                  <th>Subject Code</th>
                  <th>Internal Marks (0-50)</th>
                  <th>Final Marks (0-50)</th>
                  <th>Total (0-100)</th>
                  <th>Attendance %</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(subject => { // Show all subjects
                  const subjectMarks = marks[subject._id] || { internal: 0, finals: 0, attendance: 0 };
                  const total = subjectMarks.internal + subjectMarks.finals;
                  const hasExistingData = performances.some(p => p.subject?._id === subject._id);
                  const isModified = unsavedChanges.has(subject._id);
                  
                  return (
                    <tr key={subject._id} className={`${isModified ? 'row-modified' : ''} ${hasExistingData ? 'row-has-data' : 'row-no-data'}`}>
                      <td className="status-cell">
                        {hasExistingData ? (
                          <span className="status-badge status-saved" title="Marks previously saved">💾</span>
                        ) : (
                          <span className="status-badge status-new" title="No marks entered yet">➕</span>
                        )}
                      </td>
                      <td><strong>{subject.name}</strong></td>
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
                        {(() => {
                          const percentage = total > 0 ? (total / 100) * 100 : 0;
                          let grade = 'I';
                          if (percentage >= 90) grade = 'A+';
                          else if (percentage >= 80) grade = 'A';
                          else if (percentage >= 70) grade = 'B+';
                          else if (percentage >= 60) grade = 'B';
                          else if (percentage >= 50) grade = 'C+';
                          else if (percentage >= 40) grade = 'C';
                          else if (percentage >= 33) grade = 'D';
                          else if (total > 0) grade = 'F';
                          
                          return <span className={`grade-display grade-${grade.toLowerCase().replace('+', 'plus')}`}>{grade}</span>;
                        })()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </>
        )}

        {!selectedStudent && (
          <div className="no-student-selected">
            <div className="empty-state-icon">👤</div>
            <h3>No Student Selected</h3>
            <p>Please select a student from the dropdown above to view and manage their marks.</p>
          </div>
        )}

        {/* Subject Averages Bar Chart */}
        {subjectAverages.length > 0 && (
          <div className="subject-averages-section">
            <h3>Average Marks by Subject (Across All Students)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={subjectAverages} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  interval={0}
                />
                <YAxis 
                  label={{ value: 'Average Marks (out of 100)', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'average') return [`${value}/100`, 'Average Marks'];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Subject: ${label}`}
                />
                <Legend />
                <Bar dataKey="average" fill="#8884d8" name="Average Marks" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="averages-summary">
              <h4>Summary:</h4>
              <div className="averages-list">
                {subjectAverages.map((subject, index) => (
                  <div key={index} className="average-item">
                    <span className="subject-name">{subject.name}</span>
                    <span className="average-value">{subject.average}/100</span>
                    <span className="student-count">({subject.students} students)</span>
                  </div>
                ))}
              </div>
            </div>
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

export default Performance;
