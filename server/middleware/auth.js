import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// Middleware to protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from Bearer token
    token = req.headers.authorization.split(' ')[1];
  }
  
  // Make sure token exists
  if (!token) {
    res.status(401);
    throw new Error('Not authorized to access this route');
  }
  
  try {
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables'.red);
      res.status(500);
      throw new Error('Server configuration error');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Try to get user from database with timeout handling
    try {
      const userQuery = User.findById(decoded.id).select('-password');
      
      // Set a shorter timeout for this operation
      const user = await Promise.race([
        userQuery.exec(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 5000)
        )
      ]);
      
      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }
      
      req.user = user;
      console.log(`\u2705 User authenticated: ${user.email}`.green);
    } catch (dbError) {
      console.error('Database error in auth middleware:'.yellow, dbError.message);
      
      // If database is unavailable, create a minimal user object from token
      if (dbError.message.includes('timeout') || dbError.message.includes('buffering')) {
        console.warn('\u26a0\ufe0f Database unavailable, using token-only authentication'.yellow);
        
        // Create minimal user object from JWT payload
        req.user = {
          _id: decoded.id,
          id: decoded.id,
          role: decoded.role || 'student', // Default role if not in token
          email: decoded.email || 'unknown@example.com',
          name: decoded.name || 'Unknown User'
        };
        
        console.log(`\u26a0\ufe0f Fallback auth for user: ${req.user.email}`.yellow);
      } else {
        // Re-throw other database errors
        throw dbError;
      }
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:'.red, error.message);
    
    // Provide more specific error messages
    if (error.name === 'JsonWebTokenError') {
      res.status(401);
      throw new Error('Invalid token - please log in again');
    } else if (error.name === 'TokenExpiredError') {
      res.status(401);
      throw new Error('Token expired - please log in again');
    }
    
    res.status(401);
    throw new Error('Not authorized to access this route');
  }
});

// Generate JWT Token
export const generateToken = (payload) => {
  // Ensure payload has required fields for fallback authentication
  const tokenPayload = {
    id: payload.id || payload._id,
    email: payload.email,
    role: payload.role,
    name: payload.name,
    ...payload
  };
  
  return jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Middleware to authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('User not authenticated');
    }
    
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`User role '${req.user.role}' is not authorized to access this route`);
    }
    next();
  };
};
