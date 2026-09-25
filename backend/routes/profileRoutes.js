const express = require("express");

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const allowedTrainingFocus = [
  "Hypertrophy & Stamina",
  "Strength & Power",
  "Fat Loss",
  "Endurance",
  "General Fitness",
];

const allowedFrequency = [
  "3 Days / Week",
  "4 Days / Week",
  "5 Days / Week",
  "6 Days / Week",
  "Every Day",
];

const allowedFitnessGoals = [
  "Build Performance",
  "Build Muscle",
  "Lose Weight",
  "Improve Endurance",
  "Stay Fit",
];

// GET PROFILE
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

    res.status(200).json(user);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to load profile.",
    });
  }
});

// UPDATE PROFILE
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

    // NAME
    if (name !== undefined) {
      const cleanName = String(name).trim();

      if (cleanName.length < 2) {
        return res.status(400).json({
          message:
            "Name must contain at least 2 characters.",
        });
      }

      if (cleanName.length > 100) {
        return res.status(400).json({
          message: "Name is too long.",
        });
      }

      user.name = cleanName;
    }

    // PROFILE PICTURE
    if (profilePicture !== undefined) {
      if (
        typeof profilePicture !== "string"
      ) {
        return res.status(400).json({
          message:
            "Invalid profile picture format.",
        });
      }

      // Empty picture is allowed when removing image
      if (profilePicture === "") {
        user.profilePicture = "";
      } else {
        const isValidImage =
          /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(
            profilePicture
          );

        if (!isValidImage) {
          return res.status(400).json({
            message:
              "Only JPEG, PNG or WebP profile images are allowed.",
          });
        }

        // Prevent very large base64 images
        if (profilePicture.length > 2_000_000) {
          return res.status(400).json({
            message:
              "Profile picture is too large.",
          });
        }

        user.profilePicture = profilePicture;
      }
    }

    // HEIGHT
    if (height !== undefined) {
      const numericHeight = Number(height);

      if (
        !Number.isFinite(numericHeight) ||
        numericHeight < 50 ||
        numericHeight > 250
      ) {
        return res.status(400).json({
          message:
            "Height must be between 50 and 250 cm.",
        });
      }

      user.height = numericHeight;
    }

    // TARGET WEIGHT
    if (targetWeight !== undefined) {
      const numericWeight = Number(
        targetWeight
      );

      if (
        !Number.isFinite(numericWeight) ||
        numericWeight < 20 ||
        numericWeight > 300
      ) {
        return res.status(400).json({
          message:
            "Target weight must be between 20 and 300 kg.",
        });
      }

      user.targetWeight = numericWeight;
    }

    // TRAINING FOCUS
    if (trainingFocus !== undefined) {
      if (
        !allowedTrainingFocus.includes(
          trainingFocus
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid training focus.",
        });
      }

      user.trainingFocus = trainingFocus;
    }

    // FREQUENCY
    if (frequencyPreference !== undefined) {
      if (
        !allowedFrequency.includes(
          frequencyPreference
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid frequency preference.",
        });
      }

      user.frequencyPreference =
        frequencyPreference;
    }

    // FITNESS GOAL
    if (fitnessGoal !== undefined) {
      if (
        !allowedFitnessGoals.includes(
          fitnessGoal
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid fitness goal.",
        });
      }

      user.fitnessGoal = fitnessGoal;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message:
        "Profile updated successfully.",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture:
          updatedUser.profilePicture,
        height: updatedUser.height,
        targetWeight:
          updatedUser.targetWeight,
        trainingFocus:
          updatedUser.trainingFocus,
        frequencyPreference:
          updatedUser.frequencyPreference,
        fitnessGoal:
          updatedUser.fitnessGoal,
      },
    });
  } catch (error) {
    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to update profile.",
    });
  }
});

module.exports = router;