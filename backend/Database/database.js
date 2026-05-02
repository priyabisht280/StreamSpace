// or wherever your MongoDB connection file is

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // ✅ FIXED: Proper connection with error handling
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    
    // Specific error messages
    if (error.message.includes('ECONNREFUSED')) {
      console.error('Server is not running or wrong port');
    } else if (error.message.includes('authentication failed')) {
      console.error('Invalid username or password');
    } else if (error.message.includes('getaddrinfo')) {
      console.error('Invalid cluster name or network error');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;