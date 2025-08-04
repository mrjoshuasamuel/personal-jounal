import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import './index.css';
import './styles/globals.css';

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render app with error boundary
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Hot Module Replacement for development
if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <NextApp />
        </ErrorBoundary>
      </React.StrictMode>
    );
  });
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Sentry
    // Sentry.captureException(event.error);
  }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Sentry
    // Sentry.captureException(event.reason);
  }
});

// Check for updates (PWA)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Notify user about update
    const updateBanner = document.createElement('div');
    updateBanner.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #4f46e5;
        color: white;
        text-align: center;
        padding: 10px;
        z-index: 10000;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        A new version is available. 
        <button onclick="window.location.reload()" style="
          background: white;
          color: #4f46e5;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          margin-left: 10px;
          cursor: pointer;
        ">
          Refresh
        </button>
      </div>
    `;
    document.body.appendChild(updateBanner);
  });
}