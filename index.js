require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/users');
const authRoutes = require('./src/routes/auth');

const app = express();

(async () => {
  try {
    await connectDB();
    console.log("MongoDB connected successfully!");

    app.use(cors({ origin: "http://localhost:3000" })); // Ensure this matches your frontend origin
    app.use(express.json());

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
