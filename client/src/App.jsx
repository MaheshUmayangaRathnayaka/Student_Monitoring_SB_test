import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import Subjects from './pages/Subjects';
import Performance from './pages/Performance';
import TechnicalDrawingArticle from './pages/TechnicalDrawingArticle';
import EnvironmentalEngineeringArticle from './pages/EnvironmentalEngineeringArticle';
import FluidMechanicsArticle from './pages/FluidMechanicsArticle';
import SimpleMathematicsArticle from './pages/SimpleMathematicsArticle';
import FundamentalsOfElectronicsArticle from './pages/FundamentalsOfElectronicsArticle';
import EngineeringEthicsArticle from './pages/EngineeringEthicsArticle';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <div className="app">
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute>
                    <StudentList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subjects"
                element={
                  <ProtectedRoute>
                    <Subjects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/performance"
                element={
                  <ProtectedRoute>
                    <Performance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subjects/technical-drawing"
                element={
                  <ProtectedRoute>
                    <TechnicalDrawingArticle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subjects/environmental-engineering"
                element={
                  <ProtectedRoute>
                    <EnvironmentalEngineeringArticle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subjects/fluid-mechanics"
                element={
                  <ProtectedRoute>
                    <FluidMechanicsArticle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subjects/simple-mathematics"
                element={
                  <ProtectedRoute>
                    <SimpleMathematicsArticle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subjects/fundamentals-of-electronics"
                element={
                  <ProtectedRoute>
                    <FundamentalsOfElectronicsArticle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subjects/engineering-ethics"
                element={
                  <ProtectedRoute>
                    <EngineeringEthicsArticle />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

