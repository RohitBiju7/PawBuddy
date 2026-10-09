const Razorpay = require("razorpay");
const crypto = require("crypto");

const Payment = require("../models/paymentModel");
const Adoption = require("../models/adoptionModel");
const Pet = require("../models/petModel");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order for an adoption fee
const createAdoptionFeeOrder = async (req, res) => {
  try {
    const { adoptionId } = req.body;

    if (!adoptionId) {
      return res.status(400).json({
        message: "Adoption ID is required",
      });
    }

    const adoption = await Adoption.findById(adoptionId);

    if (!adoption) {
      return res.status(404).json({
        message: "Adoption application not found",
      });
    }

    // Only the adopter who owns the application can pay
    if (
      adoption.adopter.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to make payment for this adoption",
      });
    }

    if (adoption.status !== "approved") {
      return res.status(400).json({
        message:
          "Adoption fee can only be paid after the application is approved",
      });
    }

    const pet = await Pet.findById(adoption.pet);

    if (!pet) {
      return res.status(404).json({
        message:
          "The pet linked to this adoption no longer exists",
      });
    }

    // Free adoption - no Razorpay order needed
    if (pet.adoptionFee === 0) {
      return res.status(200).json({
        message:
          "No payment is required for this adoption",
        paymentRequired: false,
        adoptionFee: 0,
      });
    }

    // Prevent paying twice
    const existingPaidPayment = await Payment.findOne({
      adoption: adoption._id,
      status: "paid",
    });

    if (existingPaidPayment) {
      return res.status(400).json({
        message:
          "The adoption fee has already been paid",
      });
    }

    // Reuse an existing unpaid order
    const existingPayment = await Payment.findOne({
      adoption: adoption._id,
      status: "created",
    }).sort({
      createdAt: -1,
    });

    if (existingPayment) {
      return res.status(200).json({
        message: "Payment order already created",
        paymentRequired: true,

        order: {
          id: existingPayment.razorpayOrderId,
          amount: existingPayment.amount * 100,
          currency: existingPayment.currency,
        },

        adoptionFee: existingPayment.amount,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    }

    // Razorpay expects paise
    const amountInPaise = Math.round(
      pet.adoptionFee * 100,
    );

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",

      receipt: `adoption_${adoption._id}`,

      notes: {
        adoptionId: adoption._id.toString(),
        petId: pet._id.toString(),
        adopterId: req.user._id.toString(),
        paymentType: "adoption_fee",
      },
    });

    const payment = await Payment.create({
      adoption: adoption._id,
      pet: pet._id,
      adopter: req.user._id,
      amount: pet.adoptionFee,
      currency: "INR",
      paymentType: "adoption_fee",
      razorpayOrderId: razorpayOrder.id,
      status: "created",
    });

    res.status(201).json({
      message:
        "Adoption fee payment order created successfully",

      paymentRequired: true,

      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },

      adoptionFee: pet.adoptionFee,
      keyId: process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error(
      "Create adoption payment order error:",
      error,
    );

    res.status(500).json({
      message:
        "Failed to create adoption fee payment order",
      error: error.message,
    });
  }
};

// Verify Razorpay payment after successful Checkout
const verifyAdoptionFeePayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message:
          "Payment verification details are required",
      });
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment record not found",
      });
    }

    if (
      payment.adopter.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to verify this payment",
      });
    }

    if (payment.status === "paid") {
      return res.status(200).json({
        message:
          "Payment has already been verified",
        payment,
      });
    }

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET,
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`,
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      payment.status = "failed";

      await payment.save();

      return res.status(400).json({
        message:
          "Payment verification failed",
      });
    }

    payment.razorpayPaymentId =
      razorpay_payment_id;

    payment.razorpaySignature =
      razorpay_signature;

    payment.status = "paid";
    payment.paidAt = new Date();

    await payment.save();

    res.status(200).json({
      message:
        "Adoption fee payment verified successfully",
      payment,
    });
  } catch (error) {
    console.error(
      "Verify adoption payment error:",
      error,
    );

    res.status(500).json({
      message:
        "Failed to verify adoption fee payment",
      error: error.message,
    });
  }
};

// Adopter views payment status for own adoption
const getAdoptionPaymentStatus = async (req, res) => {
  try {
    const adoption = await Adoption.findById(
      req.params.adoptionId,
    );

    if (!adoption) {
      return res.status(404).json({
        message: "Adoption application not found",
      });
    }

    if (
      adoption.adopter.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to view this payment",
      });
    }

    const pet = await Pet.findById(adoption.pet);

    if (!pet) {
      return res.status(404).json({
        message:
          "The pet linked to this adoption no longer exists",
      });
    }

    if (pet.adoptionFee === 0) {
      return res.status(200).json({
        paymentRequired: false,
        paid: true,
        adoptionFee: 0,
        message:
          "No adoption fee is required",
      });
    }

    const payment = await Payment.findOne({
      adoption: adoption._id,
      paymentType: "adoption_fee",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      paymentRequired: true,
      paid: payment?.status === "paid",
      adoptionFee: pet.adoptionFee,
      payment: payment || null,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to retrieve payment status",
      error: error.message,
    });
  }
};

// Admin/Staff views payment status for an adoption
const getAdoptionPaymentStatusForStaff = async (
  req,
  res,
) => {
  try {
    const adoption = await Adoption.findById(
      req.params.adoptionId,
    );

    if (!adoption) {
      return res.status(404).json({
        message: "Adoption application not found",
      });
    }

    const pet = await Pet.findById(adoption.pet);

    if (!pet) {
      return res.status(404).json({
        message:
          "The pet linked to this adoption no longer exists",
      });
    }

    if (pet.adoptionFee === 0) {
      return res.status(200).json({
        paymentRequired: false,
        paid: true,
        adoptionFee: 0,
        message:
          "No adoption fee is required",
      });
    }

    const payment = await Payment.findOne({
      adoption: adoption._id,
      paymentType: "adoption_fee",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      paymentRequired: true,
      paid: payment?.status === "paid",
      adoptionFee: pet.adoptionFee,
      payment: payment || null,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to retrieve adoption payment status",
      error: error.message,
    });
  }
};

module.exports = {
  createAdoptionFeeOrder,
  verifyAdoptionFeePayment,
  getAdoptionPaymentStatus,
  getAdoptionPaymentStatusForStaff,
};