const express = require("express");

const {
  createAdoptionFeeOrder,
  verifyAdoptionFeePayment,
  getAdoptionPaymentStatus,
  getAdoptionPaymentStatusForStaff,
  createDonationOrder,
  verifyDonationPayment,
  getMyDonations,
  getAllDonations,
} = require("../controllers/paymentController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Razorpay order for adoption fee
router.post(
  "/adoption/create-order",
  protect,
  authorizeRoles("adopter"),
  createAdoptionFeeOrder,
);

// Verify Razorpay adoption fee payment
router.post(
  "/adoption/verify",
  protect,
  authorizeRoles("adopter"),
  verifyAdoptionFeePayment,
);

// Admin/Staff views payment status for an adoption
router.get(
  "/adoption/:adoptionId/staff",
  protect,
  authorizeRoles("admin", "staff"),
  getAdoptionPaymentStatusForStaff,
);

// Adopter views payment status for own adoption
router.get(
  "/adoption/:adoptionId",
  protect,
  authorizeRoles("adopter"),
  getAdoptionPaymentStatus,
);

/*
  DONATIONS
*/

// Create Razorpay donation order
router.post(
  "/donation/create-order",
  protect,
  authorizeRoles("adopter"),
  createDonationOrder,
);

// Verify donation payment
router.post(
  "/donation/verify",
  protect,
  authorizeRoles("adopter"),
  verifyDonationPayment,
);

// Adopter views own successful donations
router.get(
  "/donation/my",
  protect,
  authorizeRoles("adopter"),
  getMyDonations,
);

// Admin views all successful donations
router.get(
  "/donation",
  protect,
  authorizeRoles("admin"),
  getAllDonations,
);

module.exports = router;