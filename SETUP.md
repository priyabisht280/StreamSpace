# YouTube Clone - Setup Guide

## Overview
This is a complete YouTube clone built with MERN stack that fetches videos from YouTube Data API v3 and plays them using embedded iframes.

## What's Fixed

### Why Videos Weren't Playing Before:
1. **Incorrect videoId extraction** - Many implementations fail to properly extract `id.videoId` from the nested API response
2. **Wrong embedding URL** - Using `youtube.com/watch?v=ID` instead of `youtube.com/embed/ID`
3. **Missing iframe parameters** - Not including autoplay, controls, and security attributes
4. **CORS issues** - Calling API directly from frontend without backend proxy
5. **Improper iframe setup** - Not using proper aspect ratio or responsive sizing

### How It's Fixed:
- Backend properly extracts `item.id.videoId` from API response
- React uses correct embed URL: `https://www.youtube.com/embed/{videoId}`
- Iframe includes all necessary attributes for streaming
- Backend proxy handles CORS automatically
- Responsive 16:9 aspect ratio maintained

## Installation

### Prerequisites
- Node.js v16+ 
- YouTube Data API key (get it free from Google Cloud Console)

### 1. Get YouTube API Key
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable "YouTube Data API v3"
4. Create an API key in Credentials
5. Copy the key

### 2. Setup Backend

```bash
# Set your API key
echo "YOUTUBE_API_KEY=YOUR_KEY_HERE" > .env

# Install dependencies
npm install

# Run backend server
node server.js
```

Backend runs on http://localhost:5000

### 3. Setup Frontend

```bash
cd client

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend runs on http://localhost:5173

## Architecture

### Backend (Node.js + Express)
- `/api/videos/search` - Search videos by query
  - Parameters: `query`, `maxResults`
  - Returns: array of videos with **correctly extracted videoId**
  
- `/api/videos/:videoId` - Get detailed video info
  - Validates videoId format (11 chars, alphanumeric)
  - Returns: title, description, view count, likes, etc.

### Frontend (React + Vite)
- **SearchBar** - Takes search input
- **VideoList** - Grid of clickable thumbnails
- **YouTubePlayer** - Embeds iframe with proper settings

## Key Code Snippets

### Correct VideoId Extraction (Backend)
```javascript
const videos = response.data.items.map(item => ({
  id: item.id.videoId,  // ← THIS IS CRITICAL
  title: item.snippet.title,
  // ...
}));
```

### Correct Iframe Embedding (Frontend)
```jsx
<iframe
  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`}
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
/>
```

### Responsive Container (CSS)
```css
.player-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.player-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Videos not fetching | Missing API key | Add valid key to `.env` |
| Blank player | Wrong videoId format | Check API response in browser DevTools |
| CORS errors | Calling API from frontend | Use backend proxy (vite.config.js) |
| Video not playing | Wrong iframe URL | Use `youtube.com/embed/ID` not `watch?v=ID` |
| Iframe not loading | Missing security headers | Add `allow` attribute with all required permissions |
| No autoplay | Missing query params | Include `?autoplay=1&controls=1` |

## Testing

1. Search for a video
2. Click a thumbnail
3. Video should load and play in iframe with controls
4. Scroll to see video details (title, views, likes)
5. Click another video to switch

## Environment Variables

### Backend (.env)
```
YOUTUBE_API_KEY=YOUR_KEY_HERE
PORT=5000
NODE_ENV=development
```

### Frontend (Automatically proxied)
```
VITE_API_URL=http://localhost:5000/api
```

## Files & Structure

```
project/
├── server.js                 # Express backend with API routes
├── .env                      # Backend config
├── package.json              # Backend dependencies
└── client/
    ├── vite.config.js        # Frontend config with proxy
    ├── .env.example          # Frontend env template
    └── src/
        ├── App.jsx           # Main app component
        ├── api/
        │   └── youtubeApi.js  # API calls
        ├── components/
        │   ├── SearchBar.jsx  # Search input
        │   ├── VideoList.jsx  # Video grid
        │   └── YouTubePlayer.jsx  # Player with iframe
        └── styles/
            ├── App.css
            ├── SearchBar.css
            ├── VideoList.css
            └── YouTubePlayer.css
```

## Why This Works

1. **Proper API handling** - Backend extracts videoId from nested object
2. **Correct embedding** - Uses YouTube's embed protocol with iframe
3. **No CORS issues** - Backend proxy handles all API calls
4. **Responsive design** - Maintains aspect ratio across all devices
5. **Clean architecture** - Separation of concerns (search, list, player)
