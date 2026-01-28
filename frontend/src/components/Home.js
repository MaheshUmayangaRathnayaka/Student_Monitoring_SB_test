import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const { currentUser, signout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signout();
    navigate('/signin');
  };

  // If user is not authenticated, show landing page
  if (!currentUser) {
    return (
      <div className="home-container">
        <div className="home-content">
          <h1>Student Performance Monitoring System</h1>
          <p className="tagline">Track, Analyze, and Improve Academic Performance</p>
          
          <div className="features">
            <div className="feature-card">
              <h3>📊 Performance Tracking</h3>
              <p>Monitor student progress and academic performance in real-time</p>
            </div>
            <div className="feature-card">
              <h3>📈 Analytics</h3>
              <p>Get detailed insights and analytics on student performance</p>
            </div>
            <div className="feature-card">
              <h3>👥 Collaboration</h3>
              <p>Connect students, teachers, and administrators seamlessly</p>
            </div>
          </div>

          <div className="cta-buttons">
            <Link to="/signin" className="btn btn-primary">Sign In</Link>
            <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated, show dashboard
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Student Performance Monitoring System</h1>
        <div className="user-info">
          <span>Welcome, {currentUser.username}!</span>
          <button onClick={handleSignOut} className="signout-btn">Sign Out</button>
        </div>
      </header>
      
      <main className="home-content">
        <div className="dashboard">
          <h2>Dashboard</h2>
          <div className="user-details">
            <p><strong>Username:</strong> {currentUser.username}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Roles:</strong> {currentUser.roles?.join(', ') || 'User'}</p>
          </div>
          
          <div className="quick-actions">
            <div className="action-card">
              <h3>View Performance</h3>
              <p>Check your academic performance and grades</p>
              <button className="action-btn">View Details</button>
            </div>
            
            <div className="action-card">
              <h3>Submit Assignment</h3>
              <p>Upload and submit your assignments</p>
              <button className="action-btn">Submit</button>
            </div>
            
            <div className="action-card">
              <h3>View Schedule</h3>
              <p>Check your class schedule and upcoming events</p>
              <button className="action-btn">View Schedule</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
