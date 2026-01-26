import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const signin = async (usernameOrEmail, password) => {
    try {
      const userData = await authService.signin(usernameOrEmail, password);
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (username, email, password) => {
    return await authService.signup(username, email, password);
  };

  const signout = () => {
    authService.signout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    signin,
    signup,
    signout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}