import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        user: action.payload, 
        error: null,
        isAuthenticated: true 
      };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false };
    case 'LOGOUT':
      return { 
        user: null, 
        loading: false, 
        error: null, 
        isAuthenticated: false 
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for stored user data on app start - with proper error handling
    const initializeAuth = () => {
      try {
        const userData = localStorage.getItem('bigshop_user');
        const token = localStorage.getItem('bigshop_token');
        
        if (userData && token) {
          // Validate that userData is valid JSON
          const parsedUser = JSON.parse(userData);
          if (parsedUser && typeof parsedUser === 'object') {
            dispatch({ type: 'LOGIN_SUCCESS', payload: parsedUser });
          } else {
            // Invalid data, clear it
            localStorage.removeItem('bigshop_user');
            localStorage.removeItem('bigshop_token');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('bigshop_user');
        localStorage.removeItem('bigshop_token');
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.login(email, password);
      const user = response.data;
      
      // Store user data and token
      localStorage.setItem('bigshop_user', JSON.stringify(user));
      localStorage.setItem('bigshop_token', user.token);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.register(name, email, password);
      const user = response.data;
      
      localStorage.setItem('bigshop_user', JSON.stringify(user));
      localStorage.setItem('bigshop_token', user.token);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('bigshop_user');
    localStorage.removeItem('bigshop_token');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{
      user: state.user,
      loading: state.loading,
      error: state.error,
      isAuthenticated: state.isAuthenticated,
      login,
      register,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};