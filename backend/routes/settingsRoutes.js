const express = require("express");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET SETTINGS
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      darkMode: user.darkMode,
      notifications: user.notifications,
      privateActivity: user.privateActivity,
      language: user.language,
    });
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);

    res.status(500).json({
      message: "Failed to load settings.",
    });
  }
});

// UPDATE SETTINGS
router.put("/", protect, async (req, res) => {
  try {
    const {
      darkMode,
      notifications,
      privateActivity,
      language,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (darkMode !== undefined) {
      user.darkMode = darkMode;
    }

    if (notifications !== undefined) {
      user.notifications = notifications;
    }

    if (privateActivity !== undefined) {
      user.privateActivity = privateActivity;
    }

    if (language !== undefined) {
      user.language = language;
    }

    await user.save();

    res.json({
      message: "Settings updated successfully.",
      settings: {
        darkMode: user.darkMode,
        notifications: user.notifications,
        privateActivity: user.privateActivity,
        language: user.language,
      },
    });
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR:", error);

    res.status(500).json({
      message: "Failed to update settings.",
    });
  }
});

module.exports = router;