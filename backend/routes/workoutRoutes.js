const express = require("express");
const mongoose = require("mongoose");

const Workout = require("../models/Workout");
const Notification = require("../models/Notification");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const allowedTypes = [
  "STRENGTH",
  "CARDIO",
  "MOBILITY",
  "RECOVERY",
  "CONDITIONING",
];

const allowedStatuses = [
  "COMPLETED",
  "IN_PROGRESS",
  "CANCELLED",
];

const getNumber = (value, fieldName, min, max) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number < min ||
    number > max
  ) {
    throw new Error(
      `${fieldName} must be between ${min} and ${max}.`
    );
  }

  return number;
};

/*
  GET ALL WORKOUT HISTORY
  GET /api/workouts/history
*/
router.get(
  "/history",
  protect,
  async (req, res) => {
    try {
      const userId =
        req.user.id || req.user._id;

      const workouts =
        await Workout.find({
          user: userId,
        }).sort({
          completedAt: -1,
          createdAt: -1,
        });

      res.status(200).json({
        workouts,
      });
    } catch (error) {
      console.error(
        "GET WORKOUT HISTORY ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load workout history.",
      });
    }
  }
);

/*
  SAVE WORKOUT
  POST /api/workouts
*/
router.post(
  "/",
  protect,
  async (req, res) => {
    try {
      const userId =
        req.user.id || req.user._id;

      const {
        planId,
        title,
        planName,
        type,
        category,
        durationMinutes,
        calories,
        score,
        rpe,
        completedExercises,
        totalExercises,
        completedSets,
        totalSets,
        status,
        completedAt,
      } = req.body;

      const finalType =
        type || "STRENGTH";

      if (
        !allowedTypes.includes(finalType)
      ) {
        return res.status(400).json({
          message:
            "Invalid workout type.",
        });
      }

      const finalStatus =
        status || "COMPLETED";

      if (
        !allowedStatuses.includes(
          finalStatus
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid workout status.",
        });
      }

      let finalDuration =
        getNumber(
          durationMinutes,
          "Duration",
          0,
          1440
        );

      let finalCalories =
        getNumber(
          calories,
          "Calories",
          0,
          10000
        );

      let finalScore =
        score !== undefined &&
        score !== ""
          ? getNumber(
              score,
              "Score",
              0,
              10
            )
          : null;

      let finalRpe =
        rpe !== undefined &&
        rpe !== ""
          ? getNumber(
              rpe,
              "RPE",
              0,
              10
            )
          : finalScore;

      let finalCompletedExercises =
        getNumber(
          completedExercises,
          "Completed exercises",
          0,
          1000
        );

      let finalTotalExercises =
        getNumber(
          totalExercises,
          "Total exercises",
          0,
          1000
        );

      let finalCompletedSets =
        getNumber(
          completedSets,
          "Completed sets",
          0,
          5000
        );

      let finalTotalSets =
        getNumber(
          totalSets,
          "Total sets",
          0,
          5000
        );

      finalDuration =
        finalDuration ?? 0;

      finalCalories =
        finalCalories ?? 0;

      finalCompletedExercises =
        finalCompletedExercises ?? 0;

      finalTotalExercises =
        finalTotalExercises ?? 0;

      finalCompletedSets =
        finalCompletedSets ?? 0;

      finalTotalSets =
        finalTotalSets ?? 0;

      if (
        finalCompletedExercises >
          finalTotalExercises &&
        finalTotalExercises > 0
      ) {
        return res.status(400).json({
          message:
            "Completed exercises cannot exceed total exercises.",
        });
      }

      if (
        finalCompletedSets >
          finalTotalSets &&
        finalTotalSets > 0
      ) {
        return res.status(400).json({
          message:
            "Completed sets cannot exceed total sets.",
        });
      }

      let finalCompletedAt =
        new Date();

      if (completedAt) {
        finalCompletedAt =
          new Date(completedAt);

        if (
          Number.isNaN(
            finalCompletedAt.getTime()
          )
        ) {
          return res.status(400).json({
            message:
              "Invalid workout completion date.",
          });
        }
      }

      const workout =
        await Workout.create({
          user: userId,

          planId:
            typeof planId === "string"
              ? planId.trim()
              : "",

          title:
            typeof title === "string" &&
            title.trim()
              ? title.trim()
              : typeof planName ===
                  "string" &&
                planName.trim()
              ? planName.trim()
              : "Workout Session",

          planName:
            typeof planName ===
                "string" &&
              planName.trim()
              ? planName.trim()
              : typeof title ===
                  "string" &&
                title.trim()
              ? title.trim()
              : "Workout Session",

          type: finalType,

          category:
            typeof category ===
                "string" &&
              category.trim()
              ? category.trim()
              : finalType,

          durationMinutes:
            finalDuration,

          calories:
            finalCalories,

          score:
            finalScore !== null
              ? String(finalScore)
              : "8.5",

          rpe:
            finalRpe !== null
              ? String(finalRpe)
              : "8.5",

          completedExercises:
            finalCompletedExercises,

          totalExercises:
            finalTotalExercises,

          completedSets:
            finalCompletedSets,

          totalSets:
            finalTotalSets,

          status: finalStatus,

          completedAt:
            finalCompletedAt,
        });

      /*
        CREATE NOTIFICATION
        Only completed workouts create
        a workout notification.
      */
      if (finalStatus === "COMPLETED") {
        try {
          await Notification.create({
            user: userId,
            title: "Workout completed",
            message: `${
              workout.title
            } completed successfully. You burned approximately ${
              finalCalories
            } calories.`,
            type: "WORKOUT",
            read: false,
          });
        } catch (notificationError) {
          /*
            Notification failure should not
            make a successfully saved workout fail.
          */
          console.error(
            "CREATE WORKOUT NOTIFICATION ERROR:",
            notificationError
          );
        }
      }

      res.status(201).json({
        message:
          "Workout saved successfully.",
        workout,
      });
    } catch (error) {
      console.error(
        "SAVE WORKOUT ERROR:",
        error
      );

      if (
        error.message &&
        (
          error.message.includes(
            "must be between"
          ) ||
          error.message.includes(
            "Completed exercises"
          ) ||
          error.message.includes(
            "Completed sets"
          )
        )
      ) {
        return res.status(400).json({
          message: error.message,
        });
      }

      res.status(500).json({
        message:
          "Failed to save workout.",
      });
    }
  }
);

/*
  DELETE WORKOUT
  DELETE /api/workouts/:id
*/
router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const userId =
        req.user.id || req.user._id;

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid workout ID.",
        });
      }

      const workout =
        await Workout.findOneAndDelete({
          _id: req.params.id,
          user: userId,
        });

      if (!workout) {
        return res.status(404).json({
          message:
            "Workout not found.",
        });
      }

      res.status(200).json({
        message:
          "Workout deleted successfully.",
      });
    } catch (error) {
      console.error(
        "DELETE WORKOUT ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete workout.",
      });
    }
  }
);

module.exports = router;