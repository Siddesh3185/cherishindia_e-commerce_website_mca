
import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      errorInfo: errorInfo
    });
    console.error('Error caught by boundary:', error, errorInfo);
    
    // You can also log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">🚨</div>
            <h1 className="error-title">Oops! Something went wrong</h1>
            <p className="error-description">
              We're sorry, but something unexpected happened. Our team has been notified and we're working to fix it.
            </p>
            
            <div className="error-actions">
              <button 
                onClick={this.handleReload} 
                className="btn btn-primary error-btn"
              >
                🔄 Refresh Page
              </button>
              <button 
                onClick={this.handleGoHome} 
                className="btn btn-outline error-btn"
              >
                🏠 Go Home
              </button>
            </div>

            {this.props.showDetails && (
              <details className="error-details">
                <summary className="error-summary">
                  Technical Details
                </summary>
                <div className="error-content">
                  <h4>Error:</h4>
                  <pre className="error-pre">{this.state.error?.toString()}</pre>
                  
                  {this.state.errorInfo && (
                    <>
                      <h4>Component Stack:</h4>
                      <pre className="error-pre">{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}

            <div className="error-support">
              <p>If the problem persists, please contact our support team.</p>
              <button className="btn btn-secondary">
                📞 Contact Support
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
