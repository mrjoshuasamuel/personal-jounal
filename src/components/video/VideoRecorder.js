import React, { useState, useRef, useEffect } from 'react';
import { Video, Mic, MicOff, Square, Play, Pause, RotateCcw } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const VideoRecorder = ({ onVideoSaved }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const chunksRef = useRef([]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Update recording time
  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const cleanup = () => {
    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Clear intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Clean up video element
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }
    
    // Clean up recorded video URL
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo);
    }
  };

  const checkBrowserSupport = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('getUserMedia is not supported in this browser');
    }
    
    if (!window.MediaRecorder) {
      throw new Error('MediaRecorder is not supported in this browser');
    }
  };

  const startRecording = async () => {
    try {
      setIsInitializing(true);
      setError('');
      
      // Check browser support
      checkBrowserSupport();
      
      // Request camera and microphone access
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      streamRef.current = mediaStream;
      setStream(mediaStream);
      
      // Display stream in video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      // Set up MediaRecorder
      const options = { mimeType: 'video/webm;codecs=vp9' };
      
      // Fallback to vp8 if vp9 is not supported
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm;codecs=vp8';
      }
      
      // Fallback to default if webm is not supported
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        delete options.mimeType;
      }
      
      const recorder = new MediaRecorder(mediaStream, options);
      chunksRef.current = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { 
          type: recorder.mimeType || 'video/webm' 
        });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
        }
      };
      
      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Recording error occurred. Please try again.');
      };
      
      setMediaRecorder(recorder);
      recorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingTime(0);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permissions and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera or microphone found. Please connect a camera and try again.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is already in use by another application.');
      } else {
        setError(err.message || 'Failed to start recording. Please check your camera and try again.');
      }
      
      cleanup();
    } finally {
      setIsInitializing(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const saveVideo = () => {
    if (recordedVideo) {
      const videoData = {
        id: Date.now(),
        url: recordedVideo,
        date: new Date().toISOString(),
        type: 'recorded',
        duration: recordingTime,
        summary: null
      };
      
      onVideoSaved(videoData);
      
      // Reset state
      setRecordedVideo(null);
      setRecordingTime(0);
      chunksRef.current = [];
    }
  };

  const discardVideo = () => {
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo);
      setRecordedVideo(null);
      setRecordingTime(0);
      chunksRef.current = [];
    }
  };

  const retryRecording = () => {
    cleanup();
    setError('');
    setRecordedVideo(null);
    setRecordingTime(0);
    setIsRecording(false);
    setMediaRecorder(null);
    chunksRef.current = [];
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Video className="w-5 h-5 mr-2 text-indigo-600" />
        Record Journal Entry
      </h3>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={retryRecording}
            className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Try Again
          </button>
        </div>
      )}
      
      <div className="space-y-4">
        {/* Video Display Area */}
        <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
          {recordedVideo ? (
            // Recorded video playback
            <video
              src={recordedVideo}
              controls
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            // Live camera feed or placeholder
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full rounded-lg object-cover ${
                  isRecording || isInitializing ? 'block' : 'hidden'
                }`}
              />
              
              {!isRecording && !isInitializing && (
                <div className="text-center text-gray-500">
                  <Video className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p>Click record to start your journal entry</p>
                </div>
              )}
              
              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium">REC {formatTime(recordingTime)}</span>
                </div>
              )}
            </>
          )}
          
          {/* Loading overlay */}
          {isInitializing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <LoadingSpinner size="large" color="white" />
                <p className="mt-2">Initializing camera...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!recordedVideo && (
            <>
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={isInitializing}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  {isInitializing ? 'Starting...' : 'Start Recording'}
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Recording
                </button>
              )}
            </>
          )}
          
          {recordedVideo && (
            <>
              <button
                onClick={saveVideo}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Save Entry
              </button>
              <button
                onClick={discardVideo}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Discard
              </button>
            </>
          )}
        </div>
        
        {/* Recording Info */}
        {isRecording && (
          <div className="text-center text-sm text-gray-600">
            <p>Recording in progress... Speak naturally and share your thoughts.</p>
            <p className="mt-1">Duration: {formatTime(recordingTime)}</p>
          </div>
        )}
        
        {recordedVideo && (
          <div className="text-center text-sm text-gray-600">
            <p>Recording complete! Review your entry and save when ready.</p>
            <p className="mt-1">Total duration: {formatTime(recordingTime)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;