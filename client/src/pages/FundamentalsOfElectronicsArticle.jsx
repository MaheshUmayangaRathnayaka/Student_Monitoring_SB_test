import { Link } from 'react-router-dom';
import './ArticlePages.css';

const FundamentalsOfElectronicsArticle = () => {
  return (
    <div className="article-page">
      <div className="article-header">
        <Link to="/subjects" className="back-link">← Back to Subjects</Link>
        <h1>⚡ Fundamentals of Electronics</h1>
        <div className="subject-tag">Electrical Engineering</div>
      </div>

      <div className="article-content">
        <div className="overview-section">
          <p><strong>Overview:</strong> Fundamentals of Electronics introduces the basic principles of electronic devices and circuits, forming the foundation for understanding modern electronic systems and digital technology.</p>
        </div>

        <div className="content-section">
          <h2>Key Topics Covered</h2>
          <div className="topics-grid">
            <div className="topic-card">
              <h3>🔌 Basic Circuit Theory</h3>
              <p>Ohm's law, Kirchhoff's laws, and fundamental circuit analysis techniques. Understanding voltage, current, and resistance relationships.</p>
            </div>
            <div className="topic-card">
              <h3>🔋 Semiconductor Devices</h3>
              <p>Diodes, transistors (BJT, FET), and their characteristics. Learn how these fundamental components control current and voltage.</p>
            </div>
            <div className="topic-card">
              <h3>📡 Amplifiers & Filters</h3>
              <p>Operational amplifiers, frequency response, and filter circuits. Design and analysis of signal processing circuits.</p>
            </div>
            <div className="topic-card">
              <h3>💻 Digital Electronics</h3>
              <p>Logic gates, Boolean algebra, and combinational circuits. Foundation for digital system design and computer architecture.</p>
            </div>
            <div className="topic-card">
              <h3>📊 AC & DC Analysis</h3>
              <p>Time-domain and frequency-domain analysis of electronic circuits. Understanding impedance, reactance, and phasor representation.</p>
            </div>
          </div>
        </div>

        <div className="practical-applications">
          <h2>🔧 Practical Applications</h2>
          <p>Students build and test electronic circuits using breadboards and simulation software. Laboratory work includes oscilloscope usage, circuit troubleshooting, and component testing.</p>
          <div className="applications-list">
            <div className="application-item">
              <strong>Circuit Assembly:</strong> Building circuits on breadboards and PCBs for hands-on learning
            </div>
            <div className="application-item">
              <strong>Measurement Techniques:</strong> Using multimeters, oscilloscopes, and function generators
            </div>
            <div className="application-item">
              <strong>Circuit Simulation:</strong> SPICE simulation for circuit design and analysis
            </div>
          </div>
        </div>

        <div className="career-relevance">
          <h2>💼 Career Relevance</h2>
          <p>Essential for electrical engineers, electronics technicians, embedded systems developers, and anyone working with modern technology. Foundation for advanced topics in power electronics, communication systems, and control systems.</p>
          <div className="career-paths">
            <div className="career-item">⚡ Electronics Engineer</div>
            <div className="career-item">🔧 Electronics Technician</div>
            <div className="career-item">💻 Embedded Systems Developer</div>
            <div className="career-item">📡 Communication Engineer</div>
            <div className="career-item">🏭 Automation Engineer</div>
          </div>
        </div>

        <div className="study-tips">
          <h2>💡 Study Tips</h2>
          <div className="tips-list">
            <div className="tip-item">
              <strong>Hands-on Practice:</strong> Build circuits physically to understand component behavior
            </div>
            <div className="tip-item">
              <strong>Use Simulation Tools:</strong> Practice with SPICE and other circuit simulation software
            </div>
            <div className="tip-item">
              <strong>Master Basics:</strong> Ensure solid understanding of basic laws before advancing to complex circuits
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundamentalsOfElectronicsArticle;