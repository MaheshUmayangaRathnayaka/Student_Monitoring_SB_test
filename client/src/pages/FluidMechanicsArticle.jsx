import { Link } from 'react-router-dom';
import './ArticlePages.css';

const FluidMechanicsArticle = () => {
  return (
    <div className="article-page">
      <div className="article-header">
        <Link to="/subjects" className="back-link">← Back to Subjects</Link>
        <h1>💧 Fluid Mechanics</h1>
        <div className="subject-tag">Mechanical Engineering</div>
      </div>

      <div className="article-content">
        <div className="overview-section">
          <p><strong>Overview:</strong> Fluid mechanics is the study of fluid behavior - both liquids and gases - and their interaction with solid boundaries. It's fundamental to many engineering applications.</p>
        </div>

        <div className="content-section">
          <h2>Key Topics Covered</h2>
          <div className="topics-grid">
            <div className="topic-card">
              <h3>🌊 Fluid Properties</h3>
              <p>Density, viscosity, compressibility, and surface tension. Understanding the fundamental characteristics that define fluid behavior.</p>
            </div>
            <div className="topic-card">
              <h3>⚖️ Fluid Statics</h3>
              <p>Pressure distribution, buoyancy, and hydrostatic forces. Study of fluids at rest and pressure variations in static systems.</p>
            </div>
            <div className="topic-card">
              <h3>🌪️ Flow Analysis</h3>
              <p>Continuity equation, Bernoulli's principle, and momentum equations. Mathematical analysis of fluid motion and energy conservation.</p>
            </div>
            <div className="topic-card">
              <h3>🚿 Pipe Flow</h3>
              <p>Friction losses, pump systems, and flow measurement. Design and analysis of pressurized flow systems in pipes and ducts.</p>
            </div>
            <div className="topic-card">
              <h3>🏞️ Open Channel Flow</h3>
              <p>River flow, spillway design, and hydraulic jumps. Analysis of gravity-driven flow in natural and artificial channels.</p>
            </div>
          </div>
        </div>

        <div className="practical-applications">
          <h2>⚙️ Practical Applications</h2>
          <p>Students work with flow measurement equipment, analyze pump performance, and design piping systems. Laboratory experiments include flow visualization and pressure measurement.</p>
          <div className="applications-list">
            <div className="application-item">
              <strong>Flow Measurement:</strong> Using flowmeters and measurement techniques in laboratory settings
            </div>
            <div className="application-item">
              <strong>Pump Analysis:</strong> Testing pump performance curves and efficiency calculations
            </div>
            <div className="application-item">
              <strong>System Design:</strong> Designing piping networks and hydraulic systems
            </div>
          </div>
        </div>

        <div className="career-relevance">
          <h2>💼 Career Relevance</h2>
          <p>Essential for aerospace engineers, HVAC designers, hydraulic engineers, and naval architects. Applications range from aircraft design to water distribution systems.</p>
          <div className="career-paths">
            <div className="career-item">✈️ Aerospace Engineer</div>
            <div className="career-item">🌡️ HVAC Designer</div>
            <div className="career-item">💧 Hydraulic Engineer</div>
            <div className="career-item">🚢 Naval Architect</div>
            <div className="career-item">⚡ Power Plant Engineer</div>
          </div>
        </div>

        <div className="study-tips">
          <h2>💡 Study Tips</h2>
          <div className="tips-list">
            <div className="tip-item">
              <strong>Understand Physics:</strong> Grasp the physical meaning behind mathematical equations
            </div>
            <div className="tip-item">
              <strong>Practice Problems:</strong> Work through many numerical problems for better understanding
            </div>
            <div className="tip-item">
              <strong>Visualize Flow:</strong> Observe real-world fluid flow patterns and applications
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FluidMechanicsArticle;