const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    adoption: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adoption",
      default: null,
    },

    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      default: null,
    },

    adopter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentType: {
      type: String,
      enum: [
        "adoption_fee",
        "donation",
      ],
      required: true,
    },

    razorpayOrderId: {
      type: String,
      required: true,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "created",
        "paid",
        "failed",
      ],
      default: "created",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "Payment",
  paymentSchema,
);