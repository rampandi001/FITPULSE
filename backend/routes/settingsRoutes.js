const express = require("express");

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const allowedLanguages = ["English"];

// GET SETTINGS
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.status(200).json({
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

    // DARK MODE
    if (darkMode !== undefined) {
      if (typeof darkMode !== "boolean") {
        return res.status(400).json({
          message: "darkMode must be a boolean.",
        });
      }

      user.darkMode = darkMode;
    }

    // NOTIFICATIONS
    if (notifications !== undefined) {
      if (typeof notifications !== "boolean") {
        return res.status(400).json({
          message:
            "notifications must be a boolean.",
        });
      }

      user.notifications = notifications;
    }

    // PRIVATE ACTIVITY
    if (privateActivity !== undefined) {
      if (
        typeof privateActivity !== "boolean"
      ) {
        return res.status(400).json({
          message:
            "privateActivity must be a boolean.",
        });
      }

      user.privateActivity =
        privateActivity;
    }

    // LANGUAGE
    if (language !== undefined) {
      if (
        typeof language !== "string" ||
        !allowedLanguages.includes(language)
      ) {
        return res.status(400).json({
          message: "Unsupported language.",
        });
      }

      user.language = language;
    }

    await user.save();

    res.status(200).json({
      message:
        "Settings updated successfully.",
      settings: {
        darkMode: user.darkMode,
        notifications: user.notifications,
        privateActivity:
          user.privateActivity,
        language: user.language,
      },
    });
  } catch (error) {
    console.error(
      "UPDATE SETTINGS ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to update settings.",
    });
  }
});

module.exports = router;