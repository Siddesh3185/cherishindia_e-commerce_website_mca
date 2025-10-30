import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    clearError();
    
    // Check for saved credentials
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', formData.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleDemoLogin = async (email, password) => {
    setFormData({ email, password });
    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  if (isAuthenticated) {
    return <LoadingSpinner text="Welcome back! Redirecting..." />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back! 👋</h1>
            <p>Sign in to your BIGSHOP account to continue</p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <strong>Login Failed:</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your email address"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Remember me</span>
              </label>
              
              <Link to="/forgot-password" className="auth-link" style={{ fontSize: '0.9rem' }}>
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary auth-btn"
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner size="small" text="Signing In..." />
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Join BIGSHOP Today
              </Link>
            </p>
          </div>

          <div className="auth-divider">
            <span>Quick Access</span>
          </div>

          <div className="demo-accounts">
            <h3>🚀 Demo Accounts</h3>
            <div 
              className="demo-account"
              onClick={() => handleDemoLogin('admin@bigshop.com', 'admin123')}
              style={{ cursor: 'pointer' }}
            >
              <strong>Administrator Account:</strong> admin@bigshop.com / admin123
              <br />
              <small style={{ color: '#667eea', fontWeight: '600' }}>Full access to all features</small>
            </div>
            <div 
              className="demo-account"
              onClick={() => handleDemoLogin('user@bigshop.com', 'user123')}
              style={{ cursor: 'pointer' }}
            >
              <strong>Customer Account:</strong> user@bigshop.com / user123
              <br />
              <small style={{ color: '#667eea', fontWeight: '600' }}>Regular shopping experience</small>
            </div>
            <div style={{ 
              textAlign: 'center', 
              marginTop: '1rem',
              fontSize: '0.8rem',
              color: '#718096'
            }}>
              💡 Click on any demo account to auto-fill and login instantly
            </div>
          </div>

          <div className="terms-notice">
            <p>
              Secure login with SSL encryption 🔒
              <br />
              Your privacy and security are our top priority
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;