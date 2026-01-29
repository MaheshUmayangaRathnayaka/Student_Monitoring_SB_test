import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import colors from 'colors';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Import routes
import studentRoutes from './routes/studentRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (for development)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`.yellow);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Student Performance Monitoring System API',
    version: '2.0.0',
    phase: 'Phase 4 - RBAC & Advanced Analytics',
    endpoints: {
      auth: '/api/auth',
      students: '/api/students',
      subjects: '/api/subjects',
      performance: '/api/performance',
      alerts: '/api/alerts',
      analytics: '/api/analytics'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server function
const startServer = async () => {
  try {
    // Try to connect to MongoDB first
    await connectDB();
  } catch (error) {
    console.error(`Database connection failed, but continuing in development mode: ${error.message}`.yellow);
  }
  
  // Start server regardless of database connection status
  const PORT = process.env.PORT || 5000;
  
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`.green.bold);
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
};

// Start the server
startServer();

export default app;
