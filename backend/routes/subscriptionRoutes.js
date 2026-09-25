const express = require("express");
const crypto = require("crypto");

const Subscription = require("../models/Subscription");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const PLAN_PRICES = {
  CORE: 0,
  PRO: 499,
  ELITE: 999,
};

const ALLOWED_PLANS = Object.keys(
  PLAN_PRICES
);

const ALLOWED_PAID_METHODS = [
  "UPI",
  "CARD",
];

// GET CURRENT USER'S SUBSCRIPTION
router.get("/", protect, async (req, res) => {
  try {
    const userId =
      req.user.id || req.user._id;

    let subscription =
      await Subscription.findOne({
        user: userId,
      });

    // Create FREE subscription if none exists
    if (!subscription) {
      subscription =
        await Subscription.create({
          user: userId,
          plan: "CORE",
          amount: 0,
          paymentMethod: "FREE",
          transactionId: "",
          status: "ACTIVE",
        });
    }

    res.status(200).json({
      subscription,
    });
  } catch (error) {
    console.error(
      "GET SUBSCRIPTION ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load subscription.",
    });
  }
});

// CREATE / UPDATE SUBSCRIPTION
router.post("/", protect, async (req, res) => {
  try {
    const userId =
      req.user.id || req.user._id;

    const {
      plan,
      amount,
      paymentMethod,
    } = req.body;

    // PLAN VALIDATION
    if (
      typeof plan !== "string" ||
      !ALLOWED_PLANS.includes(plan)
    ) {
      return res.status(400).json({
        message:
          "Invalid subscription plan.",
      });
    }

    const finalAmount =
      PLAN_PRICES[plan];

    // CORE / FREE PLAN
    if (plan === "CORE") {
      const subscription =
        await Subscription.findOneAndUpdate(
          { user: userId },
          {
            user: userId,
            plan: "CORE",
            amount: 0,
            paymentMethod: "FREE",
            transactionId: "",
            status: "ACTIVE",
            startDate: new Date(),
            endDate: null,
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
          }
        );

      return res.status(200).json({
        message:
          "Subscription updated successfully.",
        subscription,
        transactionId: "",
      });
    }

    // PAID PLAN PAYMENT METHOD VALIDATION
    if (
      !ALLOWED_PAID_METHODS.includes(
        paymentMethod
      )
    ) {
      return res.status(400).json({
        message:
          "Please select a valid payment method.",
      });
    }

    /*
      IMPORTANT:
      Real payment gateway verification is
      intentionally not implemented yet.
      This transaction ID is only an internal
      placeholder until Razorpay integration.
    */
    const transactionId =
      `FP-${crypto
        .randomBytes(6)
        .toString("hex")
        .toUpperCase()}`;

    const startDate = new Date();

    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate()
    );

    const subscription =
      await Subscription.findOneAndUpdate(
        { user: userId },
        {
          user: userId,
          plan,
          amount: finalAmount,
          paymentMethod,
          transactionId,
          status: "ACTIVE",
          startDate,
          endDate,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      message:
        "Subscription updated successfully.",
      subscription,
      transactionId,
    });
  } catch (error) {
    console.error(
      "CREATE SUBSCRIPTION ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update subscription.",
    });
  }
});

module.exports = router;