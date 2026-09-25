const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    plan: {
      type: String,
      enum: ["CORE", "PRO", "ELITE"],
      default: "CORE",
    },

    amount: {
      type: Number,
      default: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["FREE", "UPI", "CARD"],
      default: "FREE",
    },

    transactionId: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "PENDING", "FAILED"],
      default: "ACTIVE",
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);