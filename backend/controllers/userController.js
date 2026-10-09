const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10,
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "adopter",
    });

    res.status(201).json({
      message: "Registration successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message:
          "Your account has been deactivated",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      message: "Login successful",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update own profile - Adopter and Staff only
const updateProfile = async (req, res) => {
  try {
    /*
      Admin profile editing is intentionally disabled.

      Only adopter and staff accounts can edit
      their own profile through this endpoint.
    */
    if (
      !["adopter", "staff"].includes(req.user.role)
    ) {
      return res.status(403).json({
        message:
          "Profile editing is only available for adopters and shelter staff",
      });
    }

    const {
      name,
      email,
      phone,
    } = req.body;

    /*
      Require the main profile fields.

      Phone remains optional because it was already
      optional during registration/staff creation.
    */
    if (
      !name ||
      !name.trim() ||
      !email ||
      !email.trim()
    ) {
      return res.status(400).json({
        message:
          "Name and email are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message:
          "Please enter a valid email address",
      });
    }

    /*
      Check whether another user already owns
      the requested email address.

      $ne excludes the currently logged-in user.
    */
    const existingUser =
      await User.findOne({
        email: normalizedEmail,

        _id: {
          $ne: req.user._id,
        },
      });

    if (existingUser) {
      return res.status(400).json({
        message:
          "Another user is already using this email address",
      });
    }

    const user = await User.findById(
      req.user._id,
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    /*
      Only these fields can be changed.

      We deliberately do NOT read role, isActive
      or password from req.body.
    */
    user.name = name.trim();
    user.email = normalizedEmail;
    user.phone =
      phone !== undefined
        ? String(phone).trim()
        : user.phone;

    await user.save();

    res.status(200).json({
      message:
        "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Create Shelter Staff
const createStaff = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email and password are required",
      });
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message:
          "Please enter a valid email address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return res.status(400).json({
        message:
          "User with this email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10,
      );

    const staff = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "staff",
    });

    res.status(201).json({
      message:
        "Shelter staff account created successfully",

      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
        isActive: staff.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "-password",
    );

    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update User Status
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message:
          "isActive must be true or false",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      user._id.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        message:
          "You cannot change your own account status",
      });
    }

    user.isActive = isActive;

    await user.save();

    res.status(200).json({
      message: `User ${
        isActive
          ? "activated"
          : "deactivated"
      } successfully`,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  createStaff,
  getAllUsers,
  updateUserStatus,
};