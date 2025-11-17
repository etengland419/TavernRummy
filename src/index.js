import React from 'react';
import ReactDOM from 'react-dom/client';
import TavernRummy from './TavernRummy';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/index.css';

// Suppress Chrome extension message channel errors from browser extensions
// These errors are caused by external extensions (like React DevTools) and don't affect app functionality
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out Chrome extension message channel errors
  const errorMessage = args[0]?.toString() || '';
  if (
    errorMessage.includes('message channel closed') ||
    errorMessage.includes('runtime.lastError')
  ) {
    // Silently ignore these extension-related errors
    return;
  }
  // Pass through all other errors
  originalConsoleError.apply(console, args);
};

// Also suppress unhandled promise rejections from extensions
window.addEventListener('unhandledrejection', (event) => {
  const errorMessage = event.reason?.toString() || '';
  if (
    errorMessage.includes('message channel closed') ||
    errorMessage.includes('runtime.lastError')
  ) {
    event.preventDefault(); // Prevent default error handling
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary fallbackTitle="Tavern Rummy Error">
      <TavernRummy />
    </ErrorBoundary>
  </React.StrictMode>
);
