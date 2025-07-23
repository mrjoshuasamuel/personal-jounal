import React, { useState, useRef } from 'react';
import { Upload, Video, X, CheckCircle, AlertCircle } from 'lucide-react';
import { formatFileSize, isValidVideoFile } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';

const VideoUploader = ({ onVideoSaved }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // idle, processing, success, error
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const fileInputRef = useRef(null);
  const maxFileSize = 100 * 1024 * 1024; // 100MB

  const validateFile = (file) => {
    if (!file) {
      throw new Error('No file selected');
    }

    if (!isValidVideoFile(file)) {
      throw new Error('Please select a valid video file (MP4, WebM, AVI, MOV, etc.)');
    }

    if (file.size > maxFileSize) {
      throw new Error(`File size exceeds ${formatFileSize(maxFileSize)} limit`);
    }

    if (file.size === 0) {
      throw new Error('Selected file appears to be empty');
    }

    return true;
  };

  const processFile = async (file) => {
    try {
      setUploadState('processing');
      setError('');
      
      validateFile(file);
      
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedFile(file);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadState('success');
    } catch (err) {
      setError(err.message);
      setUploadState('error');
      
      // Clean up on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (file) => {
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const saveVideo = () => {
    if (selectedFile && previewUrl) {
      const videoData = {
        id: Date.now(),
        url: previewUrl,
        date: new Date().toISOString(),
        type: 'uploaded',
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        summary: null
      };
      
      onVideoSaved(videoData);
      
      // Reset state
      resetUploader();
    }
  };

  const resetUploader = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setPreviewUrl(null);
    setSelectedFile(null);
    setUploadState('idle');
    setError('');
    setDragOver(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const retryUpload = () => {
    resetUploader();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Upload className="w-5 h-5 mr-2 text-indigo-600" />
        Upload Journal Video
      </h3>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={retryUpload}
                className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload States */}
      {uploadState === 'idle' && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-300 hover:border-indigo-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">
            Drag and drop your video file here, or click to browse
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supports MP4, WebM, AVI, MOV and other video formats
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Maximum file size: {formatFileSize(maxFileSize)}
          </p>
          
          <button
            onClick={openFileDialog}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Choose File
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>
      )}

      {/* Processing State */}
      {uploadState === 'processing' && (
        <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center bg-indigo-50">
          <LoadingSpinner size="large" color="indigo" />
          <p className="text-indigo-600 mt-4">Processing your video...</p>
          <p className="text-sm text-indigo-500 mt-2">
            This may take a moment depending on file size
          </p>
        </div>
      )}

      {/* Success State with Preview */}
      {uploadState === 'success' && selectedFile && previewUrl && (
        <div className="space-y-4">
          {/* File Info */}
          <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">{selectedFile.name}</p>
              <p className="text-green-600 text-sm">
                {formatFileSize(selectedFile.size)} • Ready to upload
              </p>
            </div>
            <button
              onClick={resetUploader}
              className="text-green-600 hover:text-green-700 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Preview */}
          <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center overflow-hidden">
            <video
              src={previewUrl}
              controls
              className="w-full h-full object-cover rounded-lg"
              preload="metadata"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={saveVideo}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Save Entry
            </button>
            <button
              onClick={resetUploader}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Choose Different File
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Preview your video above and save when ready.</p>
          </div>
        </div>
      )}

      {/* Tips Section */}
      {uploadState === 'idle' && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Tips for better uploads:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Keep video files under {formatFileSize(maxFileSize)} for faster processing</li>
            <li>• MP4 format is recommended for best compatibility</li>
            <li>• Ensure good lighting and clear audio for better AI analysis</li>
            <li>• Consider compressing large files before uploading</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;