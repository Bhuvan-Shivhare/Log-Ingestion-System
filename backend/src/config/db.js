const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGO_URL;

  if (!uri) {
    throw new Error('MONGO_URI (or MONGO_URL) is not defined in .env');
  }

  // Hide password in logs
  const logUri = uri.includes('@') ? `mongodb+srv://*****@${uri.split('@')[1]}` : uri;
  console.log('Connecting to MongoDB with URI:', logUri);

  const options = {
    serverSelectionTimeoutMS: 5000,
  };

  const maxRetries = 3;
  let retries = maxRetries;

  while (retries > 0) {
    try {
      await mongoose.connect(uri, options);
      console.log('MongoDB connected');
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt failed (${maxRetries - retries + 1}/${maxRetries}):`, err.message);
      retries -= 1;
      if (retries === 0) {
        console.error('All connection attempts failed. Exiting.');
        throw err;
      }
      // Wait 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

module.exports = connectDB;
