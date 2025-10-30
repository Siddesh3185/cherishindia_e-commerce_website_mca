
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { getCartItemsCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <div className="logo-icon">🛍️</div>
            <span className="logo-text">BIGSHOP</span>
          </Link>
          
          <div className="nav-menu">
            <Link 
              to="/" 
              className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className={`nav-link ${isActiveLink('/shop') ? 'active' : ''}`}
            >
              Shop
            </Link>
            
            {user ? (
              <div className="user-menu">
                <span className="nav-user">👋 {user.name}</span>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className={`nav-link ${isActiveLink('/admin') ? 'active' : ''}`}
                  >
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-menu">
                <Link 
                  to="/login" 
                  className={`nav-link ${isActiveLink('/login') ? 'active' : ''}`}
                >
                  Login
                </Link>
                <Link to="/register" className="nav-link register-btn">
                  Sign Up
                </Link>
              </div>
            )}
            
            <Link to="/cart" className="cart-link">
              <div className="cart-icon">
                🛒
                {getCartItemsCount() > 0 && (
                  <span className="cart-badge">{getCartItemsCount()}</span>
                )}
              </div>
            </Link>
          </div>

          <button 
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/shop" className="nav-link">Shop</Link>
        
        {user ? (
          <>
            <span className="nav-user">Welcome, {user.name}</span>
            {user.role === 'admin' && (
              <Link to="/admin" className="nav-link">Admin</Link>
            )}
            <button onClick={handleLogout} className="nav-link logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link register-btn">
              Sign Up
            </Link>
          </>
        )}
        
        <Link to="/cart" className="nav-link">
          Cart {getCartItemsCount() > 0 && `(${getCartItemsCount()})`}
        </Link>
      </div>
    </>
  );
};

export default Navbar;
