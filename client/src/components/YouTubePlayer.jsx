import React, { useState, useEffect } from 'react';
import { getVideoDetails } from '../api/youtubeApi';
import '../styles/YouTubePlayer.css';

/**
 * YouTubePlayer Component
 *
 * Displays YouTube video in an embedded iframe with proper autoplay and controls.
 * This is the correct way to embed YouTube videos in React.
 *
 * Key points:
 * 1. Uses YouTube's embed URL format: https://www.youtube.com/embed/{videoId}
 * 2. VideoId must be correctly extracted from API response
 * 3. Uses query parameters for autoplay, controls, and responsiveness
 */
export default function YouTubePlayer({ videoId, onVideoLoad }) {
  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!videoId) return;

    setLoading(true);
    setError(null);

    // Fetch detailed video information
    getVideoDetails(videoId)
      .then(video => {
        setVideoDetails(video);
        if (onVideoLoad) onVideoLoad(video);
      })
      .catch(err => {
        console.error('Error loading video details:', err);
        setError('Failed to load video details');
      })
      .finally(() => setLoading(false));
  }, [videoId, onVideoLoad]);

  if (error) {
    return <div className="player-error">{error}</div>;
  }

  return (
    <div className="youtube-player-container">
      {/* YouTube Iframe - CORRECT WAY TO EMBED */}
      <div className="player-wrapper">
        <iframe
          className="react-player"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
        />
      </div>

      {/* Video Details */}
      {loading && <div className="loading">Loading video details...</div>}

      {videoDetails && !loading && (
        <div className="video-details">
          <h2 className="video-title">{videoDetails.title}</h2>
          <div className="video-meta">
            <span className="channel">{videoDetails.channelTitle}</span>
            <span className="views">
              {parseInt(videoDetails.viewCount).toLocaleString()} views
            </span>
            {videoDetails.likeCount && (
              <span className="likes">
                {parseInt(videoDetails.likeCount).toLocaleString()} likes
              </span>
            )}
          </div>
          <p className="video-description">{videoDetails.description}</p>
        </div>
      )}
    </div>
  );
}
