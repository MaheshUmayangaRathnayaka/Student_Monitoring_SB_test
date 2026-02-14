import { Link } from 'react-router-dom';
import './ArticlePages.css';

const EnvironmentalEngineeringArticle = () => {
  return (
    <div className="article-page">
      <div className="article-header">
        <Link to="/subjects" className="back-link">← Back to Subjects</Link>
        <h1>🌱 Evironmental Engineering</h1>
        <div className="subject-tag">Sustainability & Environment</div>
      </div>

      <div className="article-content">
        <div className="overview-section">
          <p><strong>Overview:</strong> Environmental engineering focuses on protecting human health and the environment through the application of engineering principles to environmental problems.</p>
        </div>

        <div className="content-section">
          <h2>Key Topics Covered</h2>
          <div className="topics-grid">
            <div className="topic-card">
              <h3>💧 Water Treatment Systems</h3>
              <p>Design of filtration, purification, and wastewater treatment plants. Learn about biological, chemical, and physical treatment processes.</p>
            </div>
            <div className="topic-card">
              <h3>🌬️ Air Pollution Control</h3>
              <p>Emission monitoring, control technologies, and air quality management. Study atmospheric chemistry and pollution dispersion models.</p>
            </div>
            <div className="topic-card">
              <h3>♻️ Waste Management</h3>
              <p>Solid waste disposal, recycling systems, and hazardous waste handling. Focus on sustainable waste reduction strategies.</p>
            </div>
            <div className="topic-card">
              <h3>📊 Environmental Impact Assessment</h3>
              <p>Evaluating project effects on ecosystems. Learn to assess and mitigate environmental risks in development projects.</p>
            </div>
            <div className="topic-card">
              <h3>🏗️ Sustainable Design</h3>
              <p>Green building practices and renewable energy integration. Design environmentally responsible infrastructure systems.</p>
            </div>
          </div>
        </div>

        <div className="practical-applications">
          <h2>🔬 Practical Applications</h2>
          <p>Students engage in water quality testing, air pollution monitoring, and designing treatment systems. Laboratory work includes chemical analysis and environmental sampling techniques.</p>
          <div className="applications-list">
            <div className="application-item">
              <strong>Water Quality Testing:</strong> Laboratory analysis of chemical and biological parameters
            </div>
            <div className="application-item">
              <strong>Air Monitoring:</strong> Measuring pollutant concentrations and atmospheric conditions
            </div>
            <div className="application-item">
              <strong>Treatment Design:</strong> Engineering systems for water and air purification
            </div>
          </div>
        </div>

        <div className="career-relevance">
          <h2>💼 Career Relevance</h2>
          <p>Critical for environmental consultants, water treatment engineers, pollution control specialists, and sustainability managers. Growing field due to increasing environmental awareness.</p>
          <div className="career-paths">
            <div className="career-item">🌍 Environmental Consultant</div>
            <div className="career-item">💧 Water Treatment Engineer</div>
            <div className="career-item">🏭 Pollution Control Specialist</div>
            <div className="career-item">♻️ Sustainability Manager</div>
            <div className="career-item">🔬 Environmental Scientist</div>
          </div>
        </div>

        <div className="study-tips">
          <h2>💡 Study Tips</h2>
          <div className="tips-list">
            <div className="tip-item">
              <strong>Stay Current:</strong> Keep updated with environmental regulations and policies
            </div>
            <div className="tip-item">
              <strong>Connect Theory:</strong> Link theoretical concepts with current environmental issues
            </div>
            <div className="tip-item">
              <strong>Field Experience:</strong> Participate in environmental projects and field studies
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalEngineeringArticle;