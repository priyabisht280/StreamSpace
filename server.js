const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Route: Search videos on YouTube
app.get('/api/videos/search', async (req, res) => {
  try {
    const { query, maxResults = 20 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    if (!YOUTUBE_API_KEY) {
      return res.status(500).json({ error: 'YouTube API key not configured' });
    }

    // Call YouTube API v3
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: maxResults,
        key: YOUTUBE_API_KEY,
        regionCode: 'US',
        order: 'relevance'
      }
    });

    // Transform API response to extract videoId properly
    const videos = response.data.items.map(item => ({
      id: item.id.videoId, // CRITICAL: Extract videoId from nested object
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url, // Use medium size for better quality
      channelTitle: item.snippet.channelName,
      publishedAt: item.snippet.publishedAt
    }));

    res.json({
      success: true,
      videos: videos,
      total: response.data.pageInfo.totalResults
    });

  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch videos',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

// Route: Get video details (optional - for enhanced player info)
app.get('/api/videos/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return res.status(400).json({ error: 'Invalid video ID format' });
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoId,
        key: YOUTUBE_API_KEY
      }
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const video = response.data.items[0];
    res.json({
      success: true,
      video: {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.high.url,
        channelTitle: video.snippet.channelTitle,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        duration: video.contentDetails.duration,
        publishedAt: video.snippet.publishedAt
      }
    });

  } catch (error) {
    console.error('Video Details Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch video details' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`YouTube API Key configured: ${YOUTUBE_API_KEY ? 'Yes' : 'No'}`);
});
