const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURL = process.env.MONGODB_URL || "mongodb://localhost:27017/vijay_rath";
    console.log("url is " + mongoURL);
    // Return a Promise that resolves when connected
    await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Usage (assuming you call connectDB in your app)
module.exports = connectDB;
