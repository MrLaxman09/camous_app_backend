const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const errorHandler = require("./middlewares/errorMiddleware");
const highlightRoutes = require("./routes/highlightRoutes");
const contactRoutes = require("./routes/contactRoutes");
dotenv.config();

const app = express();
connectDB();

// ======== IMPORT ROUTES ======== //
const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const studentRoutes = require("./routes/studentRoutes");
const placementRoutes = require("./routes/placementRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const trainingRoutes = require("./routes/trainingRoutes"); // ✅ NEW

// ======== MIDDLEWARES ======== //
app.use(express.json());
app.use(cookieParser());

// ======== CORS ======== //
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8080", "http://localhost:8081"],
    credentials: true,
  }),
);

// ======== ROUTES ======== //
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/trainings", trainingRoutes);
app.use("/api/highlights", highlightRoutes);
app.use("/api/contacts", contactRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Connected Successfully",
    status: "running",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
  server.close(() => process.exit(1));
});
