import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    
    if (error) clearError();
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    } else if (formData.name.trim().length > 50) {
      errors.name = 'Name must be less than 50 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await register(formData.name, formData.email, formData.password);
    setIsSubmitting(false);
    
    if (result.success) {
      navigate('/');
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const labels = ['', 'Very Weak', 'Weak', 'Good', 'Strong', 'Very Strong'];
    const colors = ['', '#e53e3e', '#dd6b20', '#d69e2e', '#38a169', '#25855a'];
    
    return {
      strength: (strength / 5) * 100,
      label: labels[strength],
      color: colors[strength]
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (isAuthenticated) {
    return <LoadingSpinner text="Welcome! Redirecting..." />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Join BIGSHOP</h1>
            <p>Create your account and start shopping today</p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <strong>Registration Failed:</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
              {formErrors.name && (
                <div className="invalid-feedback">
                  ⚠️ {formErrors.name}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                placeholder="Enter your email address"
                required
                disabled={loading}
              />
              {formErrors.email && (
                <div className="invalid-feedback">
                  ⚠️ {formErrors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                  placeholder="Create a strong password"
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
              {formData.password && (
                <div className="password-strength" style={{ marginTop: '0.5rem' }}>
                  <div style={{
                    height: '4px',
                    background: '#e2e8f0',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    marginBottom: '0.25rem'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${passwordStrength.strength}%`,
                      background: passwordStrength.color,
                      transition: 'all 0.3s ease'
                    }} />
                  </div>
                  <small style={{ 
                    color: passwordStrength.color, 
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {passwordStrength.label}
                  </small>
                </div>
              )}
              {formErrors.password && (
                <div className="invalid-feedback">
                  ⚠️ {formErrors.password}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-control ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <div className="invalid-feedback">
                  ⚠️ {formErrors.confirmPassword}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary auth-btn"
              disabled={loading || isSubmitting}
            >
              {loading || isSubmitting ? (
                <LoadingSpinner size="small" text="Creating Account..." />
              ) : (
                'Create Account 🚀'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign In Here
              </Link>
            </p>
          </div>

          <div className="terms-notice">
            <p>
              By creating an account, you agree to our{' '}
              <a href="/terms" className="auth-link">Terms of Service</a> and{' '}
              <a href="/privacy" className="auth-link">Privacy Policy</a>.
              <br />
              We'll never share your information with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;