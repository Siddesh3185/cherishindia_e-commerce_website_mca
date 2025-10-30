
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Loading...', 
  variant = 'default',
  overlay = false 
}) => {
  if (overlay) {
    return (
      <div className="loading-overlay">
        <div className={`spinner spinner-${size}`}></div>
        {text && <p className="loading-text">{text}</p>}
      </div>
    );
  }

  if (variant === 'progress') {
    return (
      <div className="loading-container">
        <div className="progress-spinner"></div>
        {text && <p className="loading-text">{text}</p>}
      </div>
    );
  }

  if (variant === 'mini') {
    return (
      <div className="loading-container mini">
        <div className={`spinner spinner-${size}`}></div>
        {text && <p className="loading-text">{text}</p>}
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className={`spinner spinner-${size}`}></div>
      {text && (
        <p className="loading-text">
          {text}
          <span className="loading-dots"></span>
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
