const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorMiddleware');

// Load environment variables FIRST
dotenv.config();

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Import routes
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const studentRoutes = require("./routes/studentRoutes");
const placementRoutes = require("./routes/placementRoutes");

// ======== MIDDLEWARES ======== //
app.use(express.json());
app.use(cookieParser());

// ======== CORS CONFIG ======== //
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8080"
    ],
    credentials: true,
  })
);

// ======== ROUTES ======== //
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/placements', placementRoutes);

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend Connected Successfully',
    status: 'running',
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  server.close(() => process.exit(1));
});
