import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
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

export default Home;
