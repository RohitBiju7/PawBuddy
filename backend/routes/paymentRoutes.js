const express = require("express");

const {
  createAdoptionFeeOrder,
  verifyAdoptionFeePayment,
  getAdoptionPaymentStatus,
  getAdoptionPaymentStatusForStaff,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Razorpay order for adoption fee
router.post(
  "/adoption/create-order",
  protect,
  authorizeRoles("adopter"),
  createAdoptionFeeOrder,
);

// Verify Razorpay payment after checkout
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

module.exports = router;