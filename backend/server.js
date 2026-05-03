require("dotenv").config();
const express = require("express");
const connectDB = require("./Database/database");
const router = require("./Router/router");

const app = express();

// Connect to database
connectDB();

// Use the router
app.use("/", router);

// For Vercel deployment
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on port ${PORT}`);
  });
}