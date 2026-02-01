import { Link } from 'react-router-dom';
import './ArticlePages.css';

const TechnicalDrawingArticle = () => {
  return (
    <div className="article-page">
      <div className="article-header">
        <Link to="/subjects" className="back-link">← Back to Subjects</Link>
        <h1>📐 Technical Drawing & Design</h1>
        <div className="subject-tag">Engineering Graphics</div>
      </div>

      <div className="article-content">
        <div className="overview-section">
          <p><strong>Overview:</strong> Technical drawing is the universal language of engineers and designers, essential for communicating design ideas and specifications.</p>
        </div>

        <div className="content-section">
          <h2>Key Topics Covered</h2>
          <div className="topics-grid">
            <div className="topic-card">
              <h3>📏 Orthographic Projections</h3>
              <p>Multi-view drawings showing top, front, and side views. Learn to represent 3D objects in 2D format with proper proportions and relationships.</p>
            </div>
            <div className="topic-card">
              <h3>🎯 Isometric Drawing</h3>
              <p>3D representation techniques for better visualization. Master the 30-degree angle system for creating realistic technical illustrations.</p>
            </div>
            <div className="topic-card">
              <h3>✂️ Sectional Views</h3>
              <p>Cross-sections to show internal features and details. Essential for understanding complex mechanical assemblies and internal components.</p>
            </div>
            <div className="topic-card">
              <h3>📐 Dimensioning & Tolerances</h3>
              <p>Precise measurement specifications and acceptable variations. Critical for manufacturing accuracy and quality control.</p>
            </div>
            <div className="topic-card">
              <h3>💻 CAD Software</h3>
              <p>AutoCAD, SolidWorks, and Fusion 360 applications. Modern computer-aided design tools for professional drafting.</p>
            </div>
          </div>
        </div>

        <div className="practical-applications">
          <h2>🔧 Practical Applications</h2>
          <p>Students learn to create detailed engineering drawings for mechanical parts, architectural plans, and electrical schematics. This subject builds spatial visualization skills crucial for all engineering disciplines.</p>
          <div className="applications-list">
            <div className="application-item">
              <strong>Mechanical Parts:</strong> Design blueprints for gears, shafts, and machine components
            </div>
            <div className="application-item">
              <strong>Architectural Plans:</strong> Building layouts, floor plans, and construction details
            </div>
            <div className="application-item">
              <strong>Electrical Schematics:</strong> Circuit diagrams and electrical system layouts
            </div>
          </div>
        </div>

        <div className="career-relevance">
          <h2>💼 Career Relevance</h2>
          <p>Essential for mechanical engineers, architects, industrial designers, and manufacturing professionals. Modern industry relies heavily on precise technical documentation.</p>
          <div className="career-paths">
            <div className="career-item">🔧 Mechanical Engineer</div>
            <div className="career-item">🏗️ Architect</div>
            <div className="career-item">🎨 Industrial Designer</div>
            <div className="career-item">🏭 Manufacturing Specialist</div>
            <div className="career-item">📐 CAD Technician</div>
          </div>
        </div>

        <div className="study-tips">
          <h2>💡 Study Tips</h2>
          <div className="tips-list">
            <div className="tip-item">
              <strong>Daily Practice:</strong> Practice sketching daily to develop spatial visualization skills
            </div>
            <div className="tip-item">
              <strong>Master Fundamentals:</strong> Learn basic principles before moving to advanced CAD software
            </div>
            <div className="tip-item">
              <strong>Real-world Study:</strong> Study physical objects and try to draw their technical views
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDrawingArticle;