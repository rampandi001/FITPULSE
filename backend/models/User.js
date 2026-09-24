const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Profile information
    profilePicture: {
      type: String,
      default: "",
    },

    height: {
      type: Number,
      default: 180,
    },

    targetWeight: {
      type: Number,
      default: 82,
    },

    trainingFocus: {
      type: String,
      default: "Hypertrophy & Stamina",
    },

    frequencyPreference: {
      type: String,
      default: "5 Days / Week",
    },

    fitnessGoal: {
      type: String,
      default: "Build Performance",
    },

    // App settings
    darkMode: {
      type: Boolean,
      default: true,
    },

    notifications: {
      type: Boolean,
      default: true,
    },

    privateActivity: {
      type: Boolean,
      default: false,
    },

    language: {
      type: String,
      default: "English",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);