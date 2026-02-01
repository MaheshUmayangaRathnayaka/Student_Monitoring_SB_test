import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './SubjectManagement.css';

const Subjects = () => {
  const { user, role } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [loading, setLoading] = useState(false);
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
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    }
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
      alert('Subject created successfully!');
    } catch (error) {
      alert(error.message || 'Error creating subject');
    } finally {
      setLoading(false);
    }
  };

  // Student view - only show subjects list
  if (isStudent) {
    return (
      <div className="subjects-container">
        <div className="subjects-header">
          <h1>Available Subjects</h1>
          <div className="student-info">
            <p><strong>Student:</strong> {user.name}</p>
            {user.studentId && <p><strong>ID:</strong> {user.studentId}</p>}
          </div>
        </div>

        <div className="subjects-list">
          <h2>My Subjects ({subjects.length})</h2>
          {subjects.length > 0 ? (
            <div className="subjects-grid">
              {subjects.map(subject => (
                <div key={subject._id} className="subject-card student-card">
                  <h3>{subject.name}</h3>
                  <p><strong>Code:</strong> {subject.code}</p>
                  <p><strong>Teacher:</strong> {subject.teacher}</p>
                  <p><strong>Credits:</strong> {subject.credits}</p>
                  <p><strong>Semester:</strong> {subject.semester}</p>
                  {subject.description && <p><strong>Description:</strong> {subject.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No subjects available yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Teacher view - can manage subjects
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
        {subjects.length > 0 ? (
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
        ) : (
          <div className="no-data">
            <p>No subjects created yet. Click "Add Subject" to create your first subject.</p>
          </div>
        )}
      </div>

      <div className="performance-note">
        <div className="note-content">
          <h3>📊 Performance Management</h3>
          <p>To manage student marks, attendance, and view performance analytics, please visit the <strong>Performance</strong> page.</p>
          <p>The Performance page provides comprehensive tools for:</p>
          <ul>
            <li>Student marks entry and editing</li>
            <li>Attendance tracking</li>
            <li>Grade calculations and analytics</li>
            <li>Performance charts and visualizations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Subjects;