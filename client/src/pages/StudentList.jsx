import { useState, useEffect } from 'react';
import { studentService } from '../services';
import StudentModal from '../components/StudentModal';
import './StudentList.css';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    // Filter students based on search term
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentService.getAll();
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      await studentService.delete(id);
      showNotification('Student deleted successfully', 'success');
      fetchStudents();
    } catch (err) {
      showNotification(err.message || 'Failed to delete student', 'error');
    }
  };

  const handleSave = async (studentData) => {
    try {
      if (selectedStudent) {
        // Update existing student
        await studentService.update(selectedStudent._id, studentData);
        showNotification('Student updated successfully', 'success');
      } else {
        // Create new student
        await studentService.create(studentData);
        showNotification('Student created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (err) {
      showNotification(err.message || 'Failed to save student', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return (
      <div className="student-list-container">
        <div className="loading">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="student-list-container">
      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="list-header">
        <div>
          <h1>Student Management</h1>
          <p>Manage student records and information</p>
        </div>
        <button onClick={handleCreate} className="btn btn-primary">
          + Add Student
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, ID, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={fetchStudents} className="btn btn-secondary">
            Retry
          </button>
        </div>
      )}

      {/* Students Count */}
      <div className="results-info">
        Showing {filteredStudents.length} of {students.length} students
      </div>

      {/* Students Table */}
      <div className="table-container">
        {filteredStudents.length === 0 ? (
          <div className="empty-state">
            <p>No students found</p>
            {searchTerm && <button onClick={() => setSearchTerm('')} className="btn btn-secondary">Clear Search</button>}
          </div>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Grade</th>
                <th>Semester</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.studentId}</td>
                  <td className="student-name">{student.name}</td>
                  <td>{student.email}</td>
                  <td>
                    <span className="badge badge-grade">{student.grade}</span>
                  </td>
                  <td>{student.semester}</td>
                  <td>{student.phone || 'N/A'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(student)}
                        className="btn-icon btn-edit"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="btn-icon btn-delete"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <StudentModal
          student={selectedStudent}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default StudentList;
