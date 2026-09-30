const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  createStaff,
  getAllUsers,
  updateUserStatus
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

// Create Staff (only admin can create staff)
router.post(
  "/staff",
  protect,
  authorizeRoles("admin"),
  createStaff
);

// Get All Users (only admin can get all users)
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);

// Update User Status (only admin can update user status)
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateUserStatus
);

module.exports = router;