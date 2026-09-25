const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const communityRoutes = require("./routes/communityRoutes");
const supportRoutes = require("./routes/supportRoutes");

const protect = require("./middleware/authMiddleware");

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;

const isProduction =
  process.env.NODE_ENV === "production";

/*
  CORS
  Development:
  - localhost:5173 allowed

  Production:
  - Set FRONTEND_URL in .env
*/
const allowedOrigins = isProduction
  ? [process.env.FRONTEND_URL].filter(Boolean)
  : [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as Postman/server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(
          "CORS origin not allowed."
        )
      );
    },
  })
);

/*
  JSON BODY LIMIT

  Prevent unnecessarily large JSON requests.
  Profile pictures are currently stored as
  base64 strings, so keep this at 2mb.
*/
app.use(
  express.json({
    limit: "2mb",
  })
);

/*
  BASIC SECURITY HEADERS
*/
app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader(
    "X-Content-Type-Options",
    "nosniff"
  );

  res.setHeader(
    "X-Frame-Options",
    "DENY"
  );

  res.setHeader(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );

  next();
});

/*
  HEALTH CHECK
*/
app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "FITPULSE Backend is running successfully 🚀",
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

/*
  AUTH CHECK
*/
app.get(
  "/api/auth/me",
  protect,
  async (req, res) => {
    try {
      res.status(200).json({
        message:
          "Authenticated user",
        user: req.user,
      });
    } catch (error) {
      console.error(
        "AUTH ME ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Server error.",
      });
    }
  }
);

/*
  UNKNOWN API ROUTE
*/
app.use(
  "/api",
  (req, res) => {
    res.status(404).json({
      message:
        "API endpoint not found.",
    });
  }
);

/*
  GLOBAL ERROR HANDLER
*/
app.use(
  (error, req, res, next) => {
    console.error(
      "GLOBAL SERVER ERROR:",
      error.message
    );

    // CORS error
    if (
      error.message ===
      "CORS origin not allowed."
    ) {
      return res.status(403).json({
        message:
          "Request origin is not allowed.",
      });
    }

    // JSON body too large
    if (
      error.type ===
      "entity.too.large"
    ) {
      return res.status(413).json({
        message:
          "Request payload is too large.",
      });
    }

    // Invalid JSON
    if (
      error instanceof SyntaxError &&
      error.status === 400 &&
      error.type === "entity.parse.failed"
    ) {
      return res.status(400).json({
        message:
          "Invalid JSON request.",
      });
    }

    res.status(500).json({
      message:
        "Internal server error.",
    });
  }
);

/*
  DATABASE CONNECTION
*/
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully ✅"
    );

    app.listen(PORT, () => {
      console.log(
        `FITPULSE Backend running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed ❌"
    );

    if (isProduction) {
      console.error(
        "Database connection failed."
      );
    } else {
      console.error(
        error.message
      );
    }

    process.exit(1);
  });