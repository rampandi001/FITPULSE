const express = require("express");

const Notification = require("../models/Notification");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET all notifications for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });

    res.status(200).json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);

    res.status(500).json({
      message: "Failed to load notifications.",
    });
  }
});

// MARK ONE notification as read
router.put("/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    notification.read = true;

    await notification.save();

    res.status(200).json({
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    console.error("MARK NOTIFICATION READ ERROR:", error);

    res.status(500).json({
      message: "Failed to update notification.",
    });
  }
});

// MARK ALL notifications as read
router.put("/read-all", protect, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        read: false,
      },
      {
        $set: {
          read: true,
        },
      }
    );

    res.status(200).json({
      message: "All notifications marked as read.",
    });
  } catch (error) {
    console.error("MARK ALL NOTIFICATIONS ERROR:", error);

    res.status(500).json({
      message: "Failed to update notifications.",
    });
  }
});

// DELETE one notification
router.delete("/:id", protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    res.status(200).json({
      message: "Notification deleted.",
    });
  } catch (error) {
    console.error("DELETE NOTIFICATION ERROR:", error);

    res.status(500).json({
      message: "Failed to delete notification.",
    });
  }
});

module.exports = router;