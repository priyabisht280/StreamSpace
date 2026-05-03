const express = require("express");
const router = express.Router();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

// POST /youtube/search - Search YouTube videos
router.post("/youtube/search", async (req, res) => {
  try {
    if (!YOUTUBE_API_KEY) {
      console.error("❌ YouTube API key is not set in environment variables");
      return res.status(500).json({
        error: "YouTube API key not configured on server",
      });
    }

    console.log("✅ YouTube API key loaded:", YOUTUBE_API_KEY.substring(0, 10) + "...");

    const query = req.body.query || req.body.searchQuery;
    const pageToken = req.body.pageToken || req.body.page_token || "";

    if (!query || !query.trim()) {
      return res.status(400).json({
        error: "Search query is required",
      });
    }

    console.log(`🔍 Searching YouTube for: "${query}"`);

    const params = new URLSearchParams({
      part: "snippet",
      q: query.trim(),
      type: "video",
      maxResults: "12",
      key: YOUTUBE_API_KEY,
    });

    if (pageToken) {
      params.append("pageToken", pageToken);
    }

    const url = `${YOUTUBE_API_BASE_URL}/search?${params}`;
    console.log("📡 Requesting:", url.substring(0, 50) + "...");

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error?.message || "YouTube API error";
      console.error("❌ YouTube API Error:", errorMessage);
      return res.status(response.status).json({ error: errorMessage });
    }

    // Filter out results without videoId
    const items = Array.isArray(data.items)
      ? data.items.filter((item) => item?.id?.videoId)
      : [];

    console.log(`✅ Found ${items.length} videos`);

    res.json({
      items,
      nextPageToken: data.nextPageToken || null,
      prevPageToken: data.prevPageToken || null,
    });
  } catch (error) {
    console.error("❌ YouTube Search Error:", error);
    res.status(500).json({
      error: error.message || "Failed to search YouTube videos",
    });
  }
});

module.exports = router;
