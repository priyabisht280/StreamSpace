import React, { useState } from 'react';
import '../styles/VideoList.css';

/**
 * VideoList Component
 *
 * Displays a grid of video thumbnails that users can click to play.
 * Properly handles videoId extraction from thumbnail data.
 */
export default function VideoList({ videos, selectedVideo, onSelectVideo, loading }) {
  const [hoveredVideo, setHoveredVideo] = useState(null);

  if (loading) {
    return (
      <div className="video-list-container">
        <div className="loading-spinner">Loading videos...</div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="video-list-container">
        <div className="no-videos">No videos found. Try searching for something!</div>
      </div>
    );
  }

  return (
    <div className="video-list-container">
      <div className="videos-grid">
        {videos.map(video => (
          <div
            key={video.id}
            className={`video-card ${selectedVideo?.id === video.id ? 'active' : ''}`}
            onClick={() => onSelectVideo(video)}
            onMouseEnter={() => setHoveredVideo(video.id)}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            <div className="thumbnail-wrapper">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="thumbnail"
                loading="lazy"
              />
              {hoveredVideo === video.id && (
                <div className="play-overlay">
                  <div className="play-button">▶</div>
                </div>
              )}
            </div>

            <div className="video-info">
              <h3 className="video-title">{video.title}</h3>
              <p className="channel-name">{video.channelTitle}</p>
              <p className="published-date">
                {new Date(video.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
