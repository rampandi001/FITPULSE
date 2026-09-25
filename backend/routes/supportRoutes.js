const express = require("express");
const crypto = require("crypto");

const SupportTicket = require("../models/SupportTicket");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const MAX_SUBJECT_LENGTH = 150;
const MAX_MESSAGE_LENGTH = 1000;

/*
  CREATE SUPPORT TICKET
  POST /api/support
*/
router.post("/", protect, async (req, res) => {
  try {
    const userId =
      req.user.id || req.user._id;

    const { subject, message } = req.body;

    // SUBJECT VALIDATION
    if (
      typeof subject !== "string" ||
      !subject.trim()
    ) {
      return res.status(400).json({
        message:
          "Subject is required.",
      });
    }

    const cleanSubject =
      subject.trim();

    if (
      cleanSubject.length >
      MAX_SUBJECT_LENGTH
    ) {
      return res.status(400).json({
        message:
          `Subject cannot exceed ${MAX_SUBJECT_LENGTH} characters.`,
      });
    }

    // MESSAGE VALIDATION
    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        message:
          "Message is required.",
      });
    }

    const cleanMessage =
      message.trim();

    if (
      cleanMessage.length >
      MAX_MESSAGE_LENGTH
    ) {
      return res.status(400).json({
        message:
          `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`,
      });
    }

    // GENERATE UNIQUE TICKET ID
    const ticketId =
      `FP-${crypto
        .randomBytes(6)
        .toString("hex")
        .toUpperCase()}`;

    const ticket =
      await SupportTicket.create({
        user: userId,
        subject: cleanSubject,
        message: cleanMessage,
        ticketId,
        status: "OPEN",
      });

    res.status(201).json({
      message:
        "Support ticket created successfully.",
      ticket: {
        id: ticket._id,
        ticketId: ticket.ticketId,
        subject: ticket.subject,
        message: ticket.message,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "CREATE SUPPORT TICKET ERROR:",
      error
    );

    // Handle duplicate ticket ID
    if (error.code === 11000) {
      return res.status(500).json({
        message:
          "Failed to generate a unique ticket ID. Please try again.",
      });
    }

    res.status(500).json({
      message:
        "Failed to create support ticket.",
    });
  }
});

/*
  GET MY SUPPORT TICKETS
  GET /api/support
*/
router.get("/", protect, async (req, res) => {
  try {
    const userId =
      req.user.id || req.user._id;

    const tickets =
      await SupportTicket.find({
        user: userId,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    res.status(200).json({
      tickets,
    });
  } catch (error) {
    console.error(
      "GET SUPPORT TICKETS ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load support tickets.",
    });
  }
});

module.exports = router;