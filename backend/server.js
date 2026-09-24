const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const workoutRoutes = require("./routes/workoutRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "FITPULSE Backend is running successfully 🚀",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/workouts", workoutRoutes);

// Protected test route
const protect = require("./middleware/authMiddleware");

app.get("/api/auth/me", protect, async (req, res) => {
  try {
    res.json({
      message: "Authenticated user",
      user: req.user,
    });
  } catch (error) {
    console.error("AUTH ME ERROR:", error);

    res.status(500).json({
      message: "Server error.",
    });
  }
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `FITPULSE Backend running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });