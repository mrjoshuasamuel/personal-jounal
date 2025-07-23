import React, { useState, useEffect } from 'react';
import { LogOut, Calendar, BookOpen, User, Video, Upload, Play, Settings, TrendingUp } from 'lucide-react';
import VideoRecorder from '../video/VideoRecorder';
import VideoUploader from '../video/VideoUploader';
import VideoPlayer from '../video/VideoPlayer';
import { formatRelativeTime } from '../../utils/helpers';
import { storage } from '../../utils/helpers';

const Dashboard = ({ user, onLogout }) => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('record');
  const [stats, setStats] = useState({
    totalEntries: 0,
    thisWeek: 0,
    longestStreak: 0,
    avgMood: 'Positive'
  });

  // Load videos from localStorage on component mount
  useEffect(() => {
    const savedVideos = storage.get(`videos_${user.id}`) || [];
    setVideos(savedVideos);
    updateStats(savedVideos);
  }, [user.id]);

  // Save videos to localStorage whenever videos change
  useEffect(() => {
    if (videos.length > 0) {
      storage.set(`videos_${user.id}`, videos);
      updateStats(videos);
    }
  }, [videos, user.id]);

  const updateStats = (videoList) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const thisWeekEntries = videoList.filter(video => 
      new Date(video.date) >= oneWeekAgo
    ).length;

    setStats({
      totalEntries: videoList.length,
      thisWeek: thisWeekEntries,
      longestStreak: calculateStreak(videoList),
      avgMood: calculateAvgMood(videoList)
    });
  };

  const calculateStreak = (videoList) => {
    if (videoList.length === 0) return 0;
    
    // Sort videos by date (newest first)
    const sortedVideos = [...videoList].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let currentStreak = 0;
    let maxStreak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedVideos.length; i++) {
      const videoDate = new Date(sortedVideos[i].date);
      videoDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate - videoDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === currentStreak) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else if (daysDiff === currentStreak + 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        break;
      }
    }
    
    return maxStreak;
  };

  const calculateAvgMood = (videoList) => {
    const videosWithSummary = videoList.filter(video => video.summary && video.summary.sentiment);
    
    if (videosWithSummary.length === 0) return 'Neutral';
    
    const avgSentiment = videosWithSummary.reduce((sum, video) => 
      sum + video.summary.sentiment, 0
    ) / videosWithSummary.length;
    
    if (avgSentiment >= 0.7) return 'Very Positive';
    if (avgSentiment >= 0.4) return 'Positive';
    if (avgSentiment >= 0.2) return 'Neutral';
    return 'Reflective';
  };

  const handleVideoSaved = (videoData) => {
    setVideos(prev => [videoData, ...prev]);
    
    // Auto-switch to entries tab to show the new video
    setTimeout(() => {
      setActiveTab('entries');
    }, 1000);
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleDeleteVideo = (videoId) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      setVideos(prev => {
        const updatedVideos = prev.filter(video => video.id !== videoId);
        
        // Clean up object URL
        const videoToDelete = prev.find(video => video.id === videoId);
        if (videoToDelete && videoToDelete.url) {
          URL.revokeObjectURL(videoToDelete.url);
        }
        
        return updatedVideos;
      });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getTabCount = (tab) => {
    switch (tab) {
      case 'entries':
        return videos.length;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Daily Journal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="hidden sm:block">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:block ml-1">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user.name}!
          </h2>
          <p className="text-gray-600">
            Record your thoughts, reflect on your day, and track your personal growth journey.
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEntries}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Best Streak</p>
                <p className="text-2xl font-bold text-gray-900">{stats.longestStreak}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <User className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Mood</p>
                <p className="text-lg font-bold text-gray-900">{stats.avgMood}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'record', label: 'Record Entry', icon: Video },
                { id: 'upload', label: 'Upload Video', icon: Upload },
                { id: 'entries', label: 'My Entries', icon: Calendar }
              ].map(tab => {
                const count = getTabCount(tab.id);
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                    {count !== null && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.id 
                          ? 'bg-indigo-100 text-indigo-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'record' && (
            <VideoRecorder onVideoSaved={handleVideoSaved} />
          )}
          
          {activeTab === 'upload' && (
            <VideoUploader onVideoSaved={handleVideoSaved} />
          )}
          
          {activeTab === 'entries' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                  Your Journal Entries
                </h3>
                
                {videos.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {videos.length} {videos.length === 1 ? 'entry' : 'entries'}
                  </div>
                )}
              </div>
              
              {videos.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No journal entries yet</p>
                  <p className="mb-6">Start by recording or uploading your first entry!</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setActiveTab('record')}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Record Entry
                    </button>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Video
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                      {/* Video Thumbnail */}
                      <div 
                        className="aspect-video bg-gray-200 flex items-center justify-center cursor-pointer relative overflow-hidden"
                        onClick={() => handleVideoClick(video)}
                      >
                        <Play className="w-12 h-12 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-colors"></div>
                      </div>
                      
                      {/* Video Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {new Date(video.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600 capitalize mb-2">
                              {video.type} Entry
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatRelativeTime(video.date)}
                            </p>
                            
                            {/* Summary Preview */}
                            {video.summary && (
                              <div className="mt-2">
                                <span className={`inline-block px-2 py-1 rounded text-xs ${
                                  video.summary.mood === 'Optimistic' ? 'bg-green-100 text-green-800' :
                                  video.summary.mood === 'Reflective' ? 'bg-blue-100 text-blue-800' :
                                  video.summary.mood === 'Contemplative' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {video.summary.mood}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVideoClick(video);
                              }}
                              className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                              title="Play Video"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteVideo(video.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete Entry"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Motivation Section */}
        {videos.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Keep up the great work!</h3>
            <p className="text-indigo-100">
              You've been consistently journaling and reflecting on your experiences. 
              This practice helps build self-awareness and supports your personal growth journey.
            </p>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;