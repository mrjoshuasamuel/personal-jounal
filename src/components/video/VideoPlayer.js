import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Download, Share2, Brain, Clock, Heart, Target } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatRelativeTime, formatDuration } from '../../utils/helpers';

const VideoPlayer = ({ video, onClose }) => {
  const [summary, setSummary] = useState(video.summary);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [error, setError] = useState('');
  const [videoMetadata, setVideoMetadata] = useState({
    duration: 0,
    currentTime: 0
  });

  useEffect(() => {
    if (!summary) {
      generateSummary();
    }
  }, []);

  // Handle video metadata
  const handleVideoLoadedMetadata = (e) => {
    setVideoMetadata(prev => ({
      ...prev,
      duration: e.target.duration
    }));
  };

  const handleVideoTimeUpdate = (e) => {
    setVideoMetadata(prev => ({
      ...prev,
      currentTime: e.target.currentTime
    }));
  };

  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    setError('');
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      // Generate mock summary based on video type and date
      const mockSummary = generateMockSummary(video);
      
      setSummary(mockSummary);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
      console.error('Summary generation error:', err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const generateMockSummary = (videoData) => {
    const summaryTemplates = [
      {
        mainThoughts: [
          "Reflected on today's achievements and challenges",
          "Expressed gratitude for positive moments throughout the day",
          "Identified areas for personal growth and improvement",
          "Shared feelings about recent life changes"
        ],
        mood: "Reflective",
        keyInsights: "Focus on personal growth and maintaining work-life balance. Recognition of the importance of daily reflection.",
        actionItems: [
          "Continue daily meditation practice",
          "Schedule catch-up with old friends",
          "Plan weekend outdoor activities",
          "Start reading that book on mindfulness"
        ],
        topics: ["personal growth", "gratitude", "work-life balance", "relationships"],
        sentiment: 0.7
      },
      {
        mainThoughts: [
          "Discussed exciting new project opportunities",
          "Celebrated recent accomplishments and milestones",
          "Explored ideas for creative endeavors",
          "Expressed optimism about future plans"
        ],
        mood: "Optimistic",
        keyInsights: "Strong focus on future opportunities and creative expression. High energy and enthusiasm for upcoming challenges.",
        actionItems: [
          "Research new project requirements",
          "Connect with potential collaborators",
          "Set up dedicated creative workspace",
          "Block time for deep work sessions"
        ],
        topics: ["career growth", "creativity", "projects", "planning"],
        sentiment: 0.9
      },
      {
        mainThoughts: [
          "Processed challenging emotions and experiences",
          "Acknowledged difficult situations with honesty",
          "Explored coping strategies and support systems",
          "Recognized patterns in thinking and behavior"
        ],
        mood: "Contemplative",
        keyInsights: "Working through complex emotions with self-awareness. Demonstrating resilience and commitment to personal development.",
        actionItems: [
          "Schedule session with therapist",
          "Practice new coping techniques",
          "Reach out to support network",
          "Continue journaling practice"
        ],
        topics: ["emotional processing", "self-care", "resilience", "mental health"],
        sentiment: 0.4
      }
    ];

    // Select template based on video date/time
    const templateIndex = Math.floor(Math.random() * summaryTemplates.length);
    return summaryTemplates[templateIndex];
  };

  const handleRegenerateSummary = () => {
    setSummary(null);
    generateSummary();
  };

  const handleDownloadSummary = () => {
    if (!summary) return;
    
    const summaryText = `
Journal Entry Summary - ${new Date(video.date).toLocaleDateString()}

MAIN THOUGHTS:
${summary.mainThoughts.map(thought => `• ${thought}`).join('\n')}

MOOD: ${summary.mood}

KEY INSIGHTS:
${summary.keyInsights}

ACTION ITEMS:
${summary.actionItems.map(item => `• ${item}`).join('\n')}

TOPICS: ${summary.topics?.join(', ') || 'N/A'}

Generated on ${new Date().toLocaleDateString()}
    `.trim();
    
    const blob = new Blob([summaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-summary-${new Date(video.date).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getMoodColor = (mood) => {
    const moodColors = {
      'Optimistic': 'bg-green-100 text-green-800',
      'Reflective': 'bg-blue-100 text-blue-800',
      'Contemplative': 'bg-purple-100 text-purple-800',
      'Energetic': 'bg-orange-100 text-orange-800',
      'Peaceful': 'bg-emerald-100 text-emerald-800',
      'Challenging': 'bg-yellow-100 text-yellow-800'
    };
    return moodColors[mood] || 'bg-gray-100 text-gray-800';
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment >= 0.7) return <Heart className="w-4 h-4 text-red-500" />;
    if (sentiment >= 0.4) return <Brain className="w-4 h-4 text-blue-500" />;
    return <Target className="w-4 h-4 text-yellow-500" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Journal Entry
              </h2>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <Clock className="w-4 h-4 mr-1" />
                <span>{formatRelativeTime(video.date)}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{video.type} Entry</span>
                {videoMetadata.duration > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{formatDuration(videoMetadata.duration)}</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Player */}
            <div>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <video
                  src={video.url}
                  controls
                  className="w-full"
                  style={{ maxHeight: '400px' }}
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  onTimeUpdate={handleVideoTimeUpdate}
                  onError={() => setError('Failed to load video')}
                />
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                {video.type === 'uploaded' && video.fileName && (
                  <p><strong>File:</strong> {video.fileName}</p>
                )}
                {video.fileSize && (
                  <p><strong>Size:</strong> {(video.fileSize / 1024 / 1024).toFixed(1)} MB</p>
                )}
                <p><strong>Date:</strong> {new Date(video.date).toLocaleString()}</p>
              </div>
            </div>
            
            {/* Summary Panel */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-indigo-600" />
                  AI Summary
                </h3>
                
                {summary && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleRegenerateSummary}
                      className="text-indigo-600 hover:text-indigo-700 p-1"
                      title="Regenerate Summary"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleDownloadSummary}
                      className="text-indigo-600 hover:text-indigo-700 p-1"
                      title="Download Summary"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Error State */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <p className="text-red-600 text-sm">{error}</p>
                  <button
                    onClick={generateSummary}
                    className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}
              
              {/* Loading State */}
              {isGeneratingSummary && (
                <div className="text-center py-8">
                  <LoadingSpinner size="large" color="indigo" />
                  <p className="mt-4 text-gray-600">Analyzing your journal entry...</p>
                  <p className="mt-2 text-sm text-gray-500">
                    This may take a few moments while our AI processes your content
                  </p>
                </div>
              )}
              
              {/* Summary Content */}
              {summary && !isGeneratingSummary && (
                <div className="space-y-6">
                  {/* Mood & Sentiment */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Mood</h4>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(summary.mood)}`}>
                        {summary.mood}
                      </span>
                    </div>
                    {summary.sentiment !== undefined && (
                      <div className="flex items-center">
                        {getSentimentIcon(summary.sentiment)}
                        <span className="ml-2 text-sm text-gray-600">
                          {Math.round(summary.sentiment * 100)}% positive
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Main Thoughts */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Main Thoughts</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {summary.mainThoughts.map((thought, index) => (
                        <li key={index}>{thought}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Key Insights */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Key Insights</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{summary.keyInsights}</p>
                  </div>
                  
                  {/* Action Items */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Action Items</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {summary.actionItems.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Topics */}
                  {summary.topics && summary.topics.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Topics</h4>
                      <div className="flex flex-wrap gap-2">
                        {summary.topics.map((topic, index) => (
                          <span
                            key={index}
                            className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Generate Summary Button */}
              {!summary && !isGeneratingSummary && !error && (
                <div className="text-center py-8">
                  <button
                    onClick={generateSummary}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center mx-auto"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Generate AI Summary
                  </button>
                  <p className="mt-2 text-sm text-gray-500">
                    Our AI will analyze your entry and provide insights
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;