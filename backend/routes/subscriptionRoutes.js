const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");

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

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

// CREATE RAZORPAY ORDER
router.post(
  "/create-order",
  protect,
  async (req, res) => {
    try {
      const {
        plan,
        paymentMethod,
      } = req.body;

      if (
        typeof plan !== "string" ||
        !ALLOWED_PLANS.includes(plan)
      ) {
        return res.status(400).json({
          message:
            "Invalid subscription plan.",
        });
      }

      if (plan === "CORE") {
        return res.status(400).json({
          message:
            "CORE plan does not require payment.",
        });
      }

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

      const amount =
        PLAN_PRICES[plan];

      /*
        Razorpay expects amount
        in paise.

        ₹499 = 49900 paise
        ₹999 = 99900 paise
      */
      const options = {
        amount: Math.round(
          amount * 100
        ),
        currency: "INR",
        receipt: `FP_${Date.now()}`,
        notes: {
          plan,
          paymentMethod,
        },
      };

      const order =
        await razorpay.orders.create(
          options
        );

      res.status(201).json({
        message:
          "Razorpay order created successfully.",
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
        },
        plan,
        amount,
        keyId:
          process.env.RAZORPAY_KEY_ID,
      });
    } catch (error) {
      console.error(
        "CREATE RAZORPAY ORDER ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to create payment order.",
      });
    }
  }
);

// VERIFY RAZORPAY PAYMENT
router.post(
  "/verify-payment",
  protect,
  async (req, res) => {
    try {
      const userId =
        req.user.id || req.user._id;

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        plan,
        paymentMethod,
      } = req.body;

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !plan
      ) {
        return res.status(400).json({
          message:
            "Payment verification details are incomplete.",
        });
      }

      if (
        !ALLOWED_PLANS.includes(plan) ||
        plan === "CORE"
      ) {
        return res.status(400).json({
          message:
            "Invalid paid subscription plan.",
        });
      }

      if (
        !ALLOWED_PAID_METHODS.includes(
          paymentMethod
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid payment method.",
        });
      }

      const body =
        `${razorpay_order_id}|${razorpay_payment_id}`;

      const expectedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_KEY_SECRET
          )
          .update(body)
          .digest("hex");

      const isSignatureValid =
        expectedSignature ===
        razorpay_signature;

      if (!isSignatureValid) {
        return res.status(400).json({
          message:
            "Payment verification failed.",
        });
      }

      const finalAmount =
        PLAN_PRICES[plan];

      const startDate =
        new Date();

      const endDate =
        new Date(
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
            transactionId:
              razorpay_payment_id,
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
          "Payment verified and subscription activated successfully.",
        subscription,
        transactionId:
          razorpay_payment_id,
      });
    } catch (error) {
      console.error(
        "VERIFY RAZORPAY PAYMENT ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to verify payment.",
      });
    }
  }
);

// CREATE / UPDATE FREE SUBSCRIPTION
router.post(
  "/",
  protect,
  async (req, res) => {
    try {
      const userId =
        req.user.id || req.user._id;

      const {
        plan,
      } = req.body;

      if (
        typeof plan !== "string" ||
        !ALLOWED_PLANS.includes(plan)
      ) {
        return res.status(400).json({
          message:
            "Invalid subscription plan.",
        });
      }

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

      /*
        PAID PLANS MUST USE
        /create-order + /verify-payment.
      */
      return res.status(400).json({
        message:
          "Paid plans require Razorpay payment.",
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
  }
);

module.exports = router;