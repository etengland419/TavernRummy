import React from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary Component
 * Catches and handles errors in child components
 *
 * @param {React.ReactNode} children - Child components
 * @param {string} fallbackTitle - Custom title for error UI
 */
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
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    // Reload the page to reset the game state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallbackTitle } = this.props;

      return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 text-amber-100 p-8 flex items-center justify-center">
          <div className="max-w-2xl bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-red-600 shadow-2xl">
            <div className="text-center mb-6">
              <span className="text-8xl">⚠️</span>
            </div>
            <h1 className="text-4xl font-bold text-red-400 mb-4 text-center">
              {fallbackTitle || 'Something Went Wrong'}
            </h1>
            <p className="text-amber-200 mb-6 text-center text-lg">
              The tavern keeper apologizes! An unexpected error occurred in the game.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 p-4 bg-gray-900 bg-opacity-50 rounded-lg border border-red-500">
                <summary className="cursor-pointer text-red-300 font-bold mb-2">
                  Error Details (Development Mode)
                </summary>
                <div className="text-sm text-amber-100 mt-2">
                  <p className="font-bold text-red-400 mb-2">Error:</p>
                  <pre className="whitespace-pre-wrap break-words mb-4">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <>
                      <p className="font-bold text-red-400 mb-2">Component Stack:</p>
                      <pre className="whitespace-pre-wrap break-words text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}

            <button
              onClick={this.handleReset}
              className="w-full px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-bold text-2xl border-2 border-amber-400 transition-all transform hover:scale-105"
            >
              🔄 Restart Game
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallbackTitle: PropTypes.string
};

export default ErrorBoundary;
