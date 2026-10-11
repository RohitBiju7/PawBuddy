const Complaint = require("../models/complaintModel");

// Adopter submits feedback
const createComplaint = async (req, res) => {
  try {
    const { subject, category, message } = req.body;

    if (!subject || !category || !message) {
      return res.status(400).json({
        message:
          "Subject, category and message are required",
      });
    }

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedSubject || !trimmedMessage) {
      return res.status(400).json({
        message:
          "Subject and message cannot be empty",
      });
    }

    const validCategories = [
      "adoption",
      "appointment",
      "payment",
      "pet information",
      "other",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: "Invalid category",
      });
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      subject: trimmedSubject,
      category,
      message: trimmedMessage,
    });

    res.status(201).json({
      message:
        "Feedback submitted successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Adopter views own feedback
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Admin views all feedback
const getAllComplaints = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    const complaints = await Complaint.find(filter)
      .populate(
        "user",
        "name email phone",
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Adopter deletes own feedback
const deleteOwnComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(
      req.params.id,
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    if (
      complaint.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to delete this feedback",
      });
    }

    await complaint.deleteOne();

    res.status(200).json({
      message:
        "Feedback deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Admin clears feedback from the list
const deleteComplaintByAdmin = async (
  req,
  res,
) => {
  try {
    const complaint = await Complaint.findById(
      req.params.id,
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    await complaint.deleteOne();

    res.status(200).json({
      message:
        "Feedback cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  deleteOwnComplaint,
  deleteComplaintByAdmin,
};