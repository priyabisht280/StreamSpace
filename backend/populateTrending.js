require("dotenv").config();
const connectDB = require("./Database/database");
const TrendingData = require("./Models/trending");

const sampleTrending = [
  {
    email: "sample@example.com",
    thumbnailURL: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    trendingNo: 1,
    uploader: "Sample Channel",
    videoURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    ChannelProfile: "https://via.placeholder.com/150",
    Title: "Sample Trending Video 1",
    Description: "This is a sample trending video.",
    videoid: "dQw4w9WgXcQ",
    videoLength: 180,
    views: 1000000,
  },
  {
    email: "sample@example.com",
    thumbnailURL: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
    trendingNo: 2,
    uploader: "Another Channel",
    videoURL: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    ChannelProfile: "https://via.placeholder.com/150",
    Title: "Sample Trending Video 2",
    Description: "Another sample video.",
    videoid: "jNQXAC9IVRw",
    videoLength: 240,
    views: 500000,
  },
];

const populateTrending = async () => {
  try {
    await connectDB();
    await TrendingData.deleteMany(); // Clear existing
    await TrendingData.insertMany(sampleTrending);
    console.log("Sample trending videos added");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

populateTrending();