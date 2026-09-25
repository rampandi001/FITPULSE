const express = require("express");
const mongoose = require("mongoose");

const CommunityPost = require("../models/CommunityPost");
const CommunityComment = require("../models/CommunityComment");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const MAX_POST_LENGTH = 500;
const MAX_COMMENT_LENGTH = 500;
const MAX_WORKOUT_LENGTH = 100;

/*
  GET COMMUNITY POSTS
  GET /api/community
*/
router.get("/", protect, async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate("user", "name profilePicture")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error(
      "GET COMMUNITY POSTS ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load community posts.",
    });
  }
});

/*
  CREATE COMMUNITY POST
  POST /api/community
*/
router.post("/", protect, async (req, res) => {
  try {
    const userId =
      req.user.id || req.user._id;

    const { content, workout } = req.body;

    if (
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        message:
          "Post content is required.",
      });
    }

    const cleanContent =
      content.trim();

    if (
      cleanContent.length >
      MAX_POST_LENGTH
    ) {
      return res.status(400).json({
        message:
          `Post content cannot exceed ${MAX_POST_LENGTH} characters.`,
      });
    }

    let cleanWorkout =
      "Workout Session";

    if (workout !== undefined) {
      if (
        typeof workout !== "string"
      ) {
        return res.status(400).json({
          message:
            "Invalid workout value.",
        });
      }

      cleanWorkout =
        workout.trim() ||
        "Workout Session";

      if (
        cleanWorkout.length >
        MAX_WORKOUT_LENGTH
      ) {
        return res.status(400).json({
          message:
            `Workout name cannot exceed ${MAX_WORKOUT_LENGTH} characters.`,
        });
      }
    }

    const post =
      await CommunityPost.create({
        user: userId,
        content: cleanContent,
        workout: cleanWorkout,
      });

    const populatedPost =
      await CommunityPost.findById(
        post._id
      )
        .populate(
          "user",
          "name profilePicture"
        )
        .lean();

    res.status(201).json({
      message:
        "Community post created successfully.",
      post: populatedPost,
    });
  } catch (error) {
    console.error(
      "CREATE COMMUNITY POST ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create community post.",
    });
  }
});

/*
  LIKE / UNLIKE COMMUNITY POST
  POST /api/community/:id/like
*/
router.post(
  "/:id/like",
  protect,
  async (req, res) => {
    try {
      const userId =
        req.user.id || req.user._id;

      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid community post ID.",
        });
      }

      const post =
        await CommunityPost.findById(id);

      if (!post) {
        return res.status(404).json({
          message:
            "Community post not found.",
        });
      }

      const alreadyLiked =
        post.likedBy.some(
          (likedUserId) =>
            likedUserId.toString() ===
            userId.toString()
        );

      if (alreadyLiked) {
        post.likedBy =
          post.likedBy.filter(
            (likedUserId) =>
              likedUserId.toString() !==
              userId.toString()
          );

        post.likes = Math.max(
          0,
          post.likes - 1
        );
      } else {
        post.likedBy.push(userId);

        post.likes =
          Math.max(0, post.likes) + 1;
      }

      await post.save();

      res.status(200).json({
        message: alreadyLiked
          ? "Post unliked."
          : "Post liked.",
        likes: post.likes,
        liked: !alreadyLiked,
      });
    } catch (error) {
      console.error(
        "LIKE COMMUNITY POST ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update like.",
      });
    }
  }
);

/*
  GET COMMENTS FOR A POST
  GET /api/community/:id/comments
*/
router.get(
  "/:id/comments",
  protect,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid community post ID.",
        });
      }

      const post =
        await CommunityPost.exists({
          _id: id,
        });

      if (!post) {
        return res.status(404).json({
          message:
            "Community post not found.",
        });
      }

      const comments =
        await CommunityComment.find({
          post: id,
        })
          .populate(
            "user",
            "name profilePicture"
          )
          .sort({ createdAt: 1 })
          .lean();

      res.status(200).json({
        comments,
      });
    } catch (error) {
      console.error(
        "GET COMMUNITY COMMENTS ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load comments.",
      });
    }
  }
);

/*
  CREATE COMMENT
  POST /api/community/:id/comment
*/
router.post(
  "/:id/comment",
  protect,
  async (req, res) => {
    try {
      const userId =
        req.user.id || req.user._id;

      const { id } = req.params;
      const { content } = req.body;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid community post ID.",
        });
      }

      if (
        typeof content !== "string" ||
        !content.trim()
      ) {
        return res.status(400).json({
          message:
            "Comment content is required.",
        });
      }

      const cleanContent =
        content.trim();

      if (
        cleanContent.length >
        MAX_COMMENT_LENGTH
      ) {
        return res.status(400).json({
          message:
            `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`,
        });
      }

      const post =
        await CommunityPost.findById(id);

      if (!post) {
        return res.status(404).json({
          message:
            "Community post not found.",
        });
      }

      const comment =
        await CommunityComment.create({
          post: post._id,
          user: userId,
          content: cleanContent,
        });

      post.comments =
        Math.max(
          0,
          Number(post.comments) || 0
        ) + 1;

      await post.save();

      const populatedComment =
        await CommunityComment.findById(
          comment._id
        )
          .populate(
            "user",
            "name profilePicture"
          )
          .lean();

      res.status(201).json({
        message:
          "Comment added successfully.",
        comment: populatedComment,
        comments: post.comments,
      });
    } catch (error) {
      console.error(
        "CREATE COMMUNITY COMMENT ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to create comment.",
      });
    }
  }
);

module.exports = router;