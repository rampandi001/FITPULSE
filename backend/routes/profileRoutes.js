const express = require("express");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to load profile.",
    });
  }
});

router.put("/", protect, async (req, res) => {
  try {
    const {
      name,
      profilePicture,
      height,
      targetWeight,
      trainingFocus,
      frequencyPreference,
      fitnessGoal,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (name !== undefined) user.name = name;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (height !== undefined) user.height = height;
    if (targetWeight !== undefined) user.targetWeight = targetWeight;
    if (trainingFocus !== undefined) {
      user.trainingFocus = trainingFocus;
    }
    if (frequencyPreference !== undefined) {
      user.frequencyPreference = frequencyPreference;
    }
    if (fitnessGoal !== undefined) {
      user.fitnessGoal = fitnessGoal;
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully.",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        height: updatedUser.height,
        targetWeight: updatedUser.targetWeight,
        trainingFocus: updatedUser.trainingFocus,
        frequencyPreference: updatedUser.frequencyPreference,
        fitnessGoal: updatedUser.fitnessGoal,
      },
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to update profile.",
    });
  }
});

module.exports = router;