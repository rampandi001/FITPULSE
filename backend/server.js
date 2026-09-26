require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const communityRoutes = require("./routes/communityRoutes");
const supportRoutes = require("./routes/supportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

/*
  SECURITY
*/
app.use(helmet());

/*
  CORS
*/
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://fitpulse-opal.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },
    credentials: true,
  })
);

/*
  BODY PARSER
*/
app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/*
  HEALTH CHECK
*/
app.get("/", (req, res) => {
  res.status(200).json({
    message: "FITPULSE backend is running.",
    status: "OK",
  });
});

/*
  API ROUTES
*/
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/profile",
  profileRoutes
);

app.use(
  "/api/settings",
  settingsRoutes
);

app.use(
  "/api/workouts",
  workoutRoutes
);

app.use(
  "/api/subscription",
  subscriptionRoutes
);

app.use(
  "/api/exercises",
  exerciseRoutes
);

app.use(
  "/api/community",
  communityRoutes
);

app.use(
  "/api/support",
  supportRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

/*
  404 HANDLER
*/
app.use((req, res) => {
  res.status(404).json({
    message: "API route not found.",
  });
});

/*
  GLOBAL ERROR HANDLER
*/
app.use(
  (error, req, res, next) => {
    console.error(
      "GLOBAL SERVER ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Internal server error.",
    });
  }
);

/*
  MONGODB CONNECTION
*/
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing in .env"
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is missing in .env"
      );
    }

    if (!process.env.RAZORPAY_KEY_ID) {
      throw new Error(
        "RAZORPAY_KEY_ID is missing in .env"
      );
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error(
        "RAZORPAY_KEY_SECRET is missing in .env"
      );
    }

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected successfully."
    );

    app.listen(PORT, () => {
      console.log(
        `FITPULSE server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "SERVER START ERROR:",
      error.message
    );

    process.exit(1);
  }
};

startServer();