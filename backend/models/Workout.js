const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    planId: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "Workout Session",
    },

    planName: {
      type: String,
      default: "Workout Session",
    },

    type: {
      type: String,
      default: "STRENGTH",
    },

    category: {
      type: String,
      default: "STRENGTH",
    },

    durationMinutes: {
      type: Number,
      default: 0,
    },

    calories: {
      type: Number,
      default: 0,
    },

    score: {
      type: String,
      default: "8.5",
    },

    rpe: {
      type: String,
      default: "8.5",
    },

    completedExercises: {
      type: Number,
      default: 0,
    },

    totalExercises: {
      type: Number,
      default: 0,
    },

    completedSets: {
      type: Number,
      default: 0,
    },

    totalSets: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["COMPLETED", "IN_PROGRESS", "CANCELLED"],
      default: "COMPLETED",
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Workout", workoutSchema);