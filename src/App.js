import React, { useState, useEffect } from 'react';
import AuthModule from './components/auth/AuthModule';
import Dashboard from './components/dashboard/Dashboard';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useAuth } from './hooks/useAuth';
import { checkBrowserSupport } from './utils/helpers';
import './App.css';

// Main App Component
const App = () => {
  const { user, login, logout, isLoading } = useAuth();
  const [isSupported, setIsSupported] = useState(true);
  const [supportMessage, setSupportMessage] = useState('');

  useEffect(() => {
    // Check browser support on app load
    const support = checkBrowserSupport();
    
    if (!support.mediaRecorder) {
      setIsSupported(false);
      setSupportMessage('Video recording is not supported in this browser. Please use Chrome, Firefox, or Edge for the best experience.');
    } else if (!support.getUserMedia) {
      setIsSupported(false);
      setSupportMessage('Camera access is not supported in this browser. Video recording features will be limited.');
    } else if (!support.fileApi) {
      setIsSupported(false);
      setSupportMessage('File upload is not supported in this browser. Please update your browser.');
    }

    // Remove loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.remove();
        }, 300);
      }, 500);
    }
  }, []);

  // Handle login
  const handleLogin = (userData) => {
    login(userData);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  // Show loading spinner during authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Authenticating..." />
      </div>
    );
  }

  // Show browser compatibility warning
  if (!isSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Browser Compatibility</h2>
            <p className="text-gray-600 mb-4">{supportMessage}</p>
            <button
              onClick={() => setIsSupported(true)}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {!user ? (
        <AuthModule onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;