require('dotenv').config();
const express = require('express');

const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/users');
const authRoutes = require('./src/routes/auth');

const app = express();

console.log('Email User:', process.env.EMAIL); // Debugging line
console.log('Email Pass:', process.env.EMAIL_PASS); // Debugging line

app.use(helmet()); // Adds secure headers
app.use(express.json());
 // Ensure this matches your frontend origin
app.use(cors({ origin: process.env.CLIENT_URL }));

(async () => {
  try {
    await connectDB();
    console.log("MongoDB connected successfully!");


    // Use the entire router for auth routes
    app.use('/', authRoutes);

    // Use user routes
    app.use('/users', userRoutes);

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
})();
