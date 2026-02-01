import { Link } from 'react-router-dom';
import './ArticlePages.css';

const EngineeringEthicsArticle = () => {
  return (
    <div className="article-page">
      <div className="article-header">
        <Link to="/subjects" className="back-link">← Back to Subjects</Link>
        <h1>⚖️ Engineering Ethics</h1>
        <div className="subject-tag">Professional Development</div>
      </div>

      <div className="article-content">
        <div className="overview-section">
          <p><strong>Overview:</strong> Engineering Ethics explores the moral and professional responsibilities of engineers, emphasizing the importance of ethical decision-making in engineering practice and the impact of technology on society.</p>
        </div>

        <div className="content-section">
          <h2>Key Topics Covered</h2>
          <div className="topics-grid">
            <div className="topic-card">
              <h3>⚖️ Professional Responsibility</h3>
              <p>Understanding the engineer's duty to public safety, health, and welfare. Learning to balance technical excellence with social responsibility.</p>
            </div>
            <div className="topic-card">
              <h3>🔒 Confidentiality & Trust</h3>
              <p>Maintaining client confidentiality, avoiding conflicts of interest, and building trust in professional relationships and business practices.</p>
            </div>
            <div className="topic-card">
              <h3>🌍 Environmental Stewardship</h3>
              <p>Sustainable engineering practices, environmental impact assessment, and responsibility for long-term environmental consequences.</p>
            </div>
            <div className="topic-card">
              <h3>🏛️ Legal & Regulatory Framework</h3>
              <p>Understanding engineering codes, standards, liability issues, and the legal context of engineering practice and decision-making.</p>
            </div>
            <div className="topic-card">
              <h3>🤝 Social Impact</h3>
              <p>Analyzing the broader social implications of engineering projects, considering equity, accessibility, and community impact in design decisions.</p>
            </div>
          </div>
        </div>

        <div className="practical-applications">
          <h2>🎯 Practical Applications</h2>
          <p>Students analyze real-world case studies of engineering failures, ethical dilemmas, and moral decision-making scenarios. Emphasis on developing critical thinking skills for ethical problem-solving.</p>
          <div className="applications-list">
            <div className="application-item">
              <strong>Case Study Analysis:</strong> Examining historical engineering failures and their ethical implications
            </div>
            <div className="application-item">
              <strong>Ethical Decision Trees:</strong> Developing frameworks for ethical decision-making in complex situations
            </div>
            <div className="application-item">
              <strong>Professional Scenarios:</strong> Role-playing exercises for workplace ethical dilemmas
            </div>
          </div>
        </div>

        <div className="career-relevance">
          <h2>💼 Career Relevance</h2>
          <p>Critical for all engineering professionals, project managers, and technical leaders. Essential for professional licensure and maintaining public trust in the engineering profession across all disciplines.</p>
          <div className="career-paths">
            <div className="career-item">👨‍💼 Project Manager</div>
            <div className="career-item">🏢 Engineering Consultant</div>
            <div className="career-item">⚖️ Technical Expert Witness</div>
            <div className="career-item">🏛️ Regulatory Affairs Specialist</div>
            <div className="career-item">🌟 Engineering Leader</div>
          </div>
        </div>

        <div className="study-tips">
          <h2>💡 Study Tips</h2>
          <div className="tips-list">
            <div className="tip-item">
              <strong>Read Case Studies:</strong> Study real engineering disasters and ethical failures to learn from history
            </div>
            <div className="tip-item">
              <strong>Professional Codes:</strong> Familiarize yourself with engineering codes of ethics from professional societies
            </div>
            <div className="tip-item">
              <strong>Current Events:</strong> Stay informed about contemporary ethical issues in technology and engineering
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineeringEthicsArticle;