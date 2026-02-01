import { Link } from 'react-router-dom';
import './ArticlePages.css';

const SimpleMathematicsArticle = () => {
  return (
    <div className="article-page">
      <div className="article-header">
        <Link to="/subjects" className="back-link">← Back to Subjects</Link>
        <h1>🔢 Simple Mathematics</h1>
        <div className="subject-tag">Foundation Mathematics</div>
      </div>

      <div className="article-content">
        <div className="overview-section">
          <p><strong>Overview:</strong> Simple Mathematics forms the fundamental foundation for all engineering disciplines, providing essential mathematical tools and problem-solving techniques required for advanced engineering concepts.</p>
        </div>

        <div className="content-section">
          <h2>Key Topics Covered</h2>
          <div className="topics-grid">
            <div className="topic-card">
              <h3>📊 Algebra & Functions</h3>
              <p>Linear and quadratic equations, polynomial functions, and exponential relationships. Master algebraic manipulation essential for engineering calculations.</p>
            </div>
            <div className="topic-card">
              <h3>📈 Calculus Basics</h3>
              <p>Derivatives and integrals for engineering applications. Understanding rates of change, optimization, and area calculations in engineering contexts.</p>
            </div>
            <div className="topic-card">
              <h3>📐 Trigonometry</h3>
              <p>Sine, cosine, tangent functions and their applications. Essential for analyzing periodic phenomena, waves, and geometric relationships.</p>
            </div>
            <div className="topic-card">
              <h3>🔢 Complex Numbers</h3>
              <p>Operations with imaginary numbers and polar form representation. Critical for electrical engineering and signal processing applications.</p>
            </div>
            <div className="topic-card">
              <h3>🧮 Matrices & Vectors</h3>
              <p>Linear algebra fundamentals including matrix operations and vector analysis. Foundation for structural analysis and computer graphics.</p>
            </div>
          </div>
        </div>

        <div className="practical-applications">
          <h2>🛠️ Practical Applications</h2>
          <p>Students apply mathematical concepts to solve real engineering problems including circuit analysis, structural calculations, and optimization problems. Emphasis on developing logical thinking and problem-solving skills.</p>
          <div className="applications-list">
            <div className="application-item">
              <strong>Circuit Analysis:</strong> Using complex numbers and matrices for AC circuit calculations
            </div>
            <div className="application-item">
              <strong>Structural Engineering:</strong> Applying calculus for beam deflection and stress analysis
            </div>
            <div className="application-item">
              <strong>Signal Processing:</strong> Trigonometric functions for wave analysis and Fourier transforms
            </div>
          </div>
        </div>

        <div className="career-relevance">
          <h2>💼 Career Relevance</h2>
          <p>Mathematical proficiency is fundamental to all engineering disciplines. Strong mathematical foundation enables success in advanced engineering courses and professional practice in any technical field.</p>
          <div className="career-paths">
            <div className="career-item">🔬 Research Engineer</div>
            <div className="career-item">📊 Data Analyst</div>
            <div className="career-item">💻 Software Engineer</div>
            <div className="career-item">⚡ Electrical Engineer</div>
            <div className="career-item">🏗️ Structural Engineer</div>
          </div>
        </div>

        <div className="study-tips">
          <h2>💡 Study Tips</h2>
          <div className="tips-list">
            <div className="tip-item">
              <strong>Practice Regularly:</strong> Solve mathematical problems daily to maintain and improve skills
            </div>
            <div className="tip-item">
              <strong>Understand Concepts:</strong> Focus on understanding why formulas work, not just memorizing them
            </div>
            <div className="tip-item">
              <strong>Apply to Engineering:</strong> Always try to connect mathematical concepts to real engineering problems
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMathematicsArticle;