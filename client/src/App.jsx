import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import VideoList from './components/VideoList';
import YouTubePlayer from './components/YouTubePlayer';
import { searchVideos } from './api/youtubeApi';
import './styles/App.css';

export default function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDefaultVideos();
  }, []);

  const loadDefaultVideos = async () => {
    await handleSearch('popular music');
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const results = await searchVideos(query, 20);
      setVideos(results);
      setSearchQuery(query);

      if (results.length > 0) {
        setSelectedVideo(results[0]);
      }
    } catch (err) {
      setError(`Search failed: ${err.message}`);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    const playerElement = document.getElementById('player-section');
    if (playerElement) {
      playerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">YouTube Clone</h1>
        <p className="app-subtitle">Powered by YouTube Data API v3</p>
      </header>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && <div className="error-banner">{error}</div>}

      <div className="main-content">
        <section id="player-section" className="player-section">
          {selectedVideo ? (
            <YouTubePlayer
              videoId={selectedVideo.id}
              onVideoLoad={(details) => console.log('Video loaded:', details)}
            />
          ) : (
            <div className="no-selection">
              Search for videos and select one to play
            </div>
          )}
        </section>

        <section className="playlist-section">
          <h2>Search Results {searchQuery && `for "${searchQuery}"`}</h2>
          <VideoList
            videos={videos}
            selectedVideo={selectedVideo}
            onSelectVideo={handleSelectVideo}
            loading={loading}
          />
        </section>
      </div>
    </div>
  );
}
