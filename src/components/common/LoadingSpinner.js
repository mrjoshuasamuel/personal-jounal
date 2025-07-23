import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  color = 'indigo',
  fullScreen = false,
  transparent = false 
}) => {
  // Size configurations
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  // Color configurations
  const colorClasses = {
    indigo: 'text-indigo-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    gray: 'text-gray-600',
    white: 'text-white'
  };

  // Container classes
  const containerClasses = fullScreen 
    ? `fixed inset-0 z-50 flex items-center justify-center ${transparent ? 'bg-black bg-opacity-50' : 'bg-white'}`
    : 'flex items-center justify-center p-4';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-3">
        {/* Spinning Icon */}
        <Loader2 
          className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
        />
        
        {/* Loading Message */}
        {message && (
          <p className={`text-sm font-medium ${
            fullScreen && !transparent ? 'text-gray-600' : 
            fullScreen && transparent ? 'text-white' : 
            'text-gray-600'
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

// Skeleton loader for content placeholders
export const SkeletonLoader = ({ 
  lines = 3, 
  height = 'h-4', 
  spacing = 'space-y-3',
  animated = true 
}) => {
  return (
    <div className={`${spacing}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`${height} bg-gray-200 rounded ${
            animated ? 'animate-pulse' : ''
          } ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

// Card skeleton for video entries
export const VideoCardSkeleton = () => {
  return (
    <div className="border rounded-lg p-4 animate-pulse">
      <div className="aspect-video bg-gray-200 rounded mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
};

// Inline spinner for buttons
export const ButtonSpinner = ({ size = 'small', color = 'white' }) => {
  return (
    <Loader2 
      className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
    />
  );
};

// Overlay spinner for modals
export const OverlaySpinner = ({ message = 'Processing...' }) => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
};

// Progress bar with spinner
export const ProgressSpinner = ({ progress = 0, message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center space-y-3">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      
      {/* Progress Bar */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{message}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;