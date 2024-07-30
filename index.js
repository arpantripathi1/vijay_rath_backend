require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');

const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const orderRoutes = require('./src/routes/orderRoutes'); 
const dataRoutes = require('./src/routes/dataRoutes');


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

    // use payment routes
    app.use('/orders', orderRoutes); // New

    //fetch mails and contacts
    app.use('/contacts', dataRoutes); // Prefix API endpoints with '/api'

    // In your Express app
    app.get('/config/razorpay', (req, res) => {
      console.log("/config/razorpay is hit to send razorpay api key");
      console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID); // Debugging line
      res.send({ key: process.env.RAZORPAY_KEY_ID });
    });

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
})();
