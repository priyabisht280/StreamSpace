// API service for YouTube video fetching
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const searchVideos = async (query, maxResults = 20) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/videos/search?query=${encodeURIComponent(query)}&maxResults=${maxResults}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch videos');
    }

    const data = await response.json();
    return data.videos;
  } catch (error) {
    console.error('Search videos error:', error);
    throw error;
  }
};

export const getVideoDetails = async (videoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }

    const data = await response.json();
    return data.video;
  } catch (error) {
    console.error('Get video details error:', error);
    throw error;
  }
};
