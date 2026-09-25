const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "CHEST",
        "BACK",
        "LEGS",
        "SHOULDERS",
        "ARMS",
      ],
    },

    level: {
      type: String,
      required: true,
      enum: [
        "BEGINNER",
        "INTERMEDIATE",
        "ADVANCED",
      ],
    },

    equipment: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Exercise",
  exerciseSchema
);