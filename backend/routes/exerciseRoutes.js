const express = require("express");
const mongoose = require("mongoose");

const Exercise = require("../models/Exercise");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/*
  GET ALL EXERCISES
  GET /api/exercises
*/
router.get("/", protect, async (req, res) => {
  try {
    const exercises = await Exercise.find()
      .sort({
        createdAt: 1,
      })
      .lean();

    res.status(200).json({
      exercises,
    });
  } catch (error) {
    console.error(
      "GET EXERCISES ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load exercises.",
    });
  }
});

/*
  GET SINGLE EXERCISE
  GET /api/exercises/:id
*/
router.get(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Validate MongoDB ObjectId
      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          message:
            "Invalid exercise ID.",
        });
      }

      const exercise =
        await Exercise.findById(id).lean();

      if (!exercise) {
        return res.status(404).json({
          message:
            "Exercise not found.",
        });
      }

      res.status(200).json({
        exercise,
      });
    } catch (error) {
      console.error(
        "GET EXERCISE ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load exercise.",
      });
    }
  }
);

module.exports = router;