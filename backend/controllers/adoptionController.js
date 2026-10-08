const Adoption = require("../models/adoptionModel");
const Pet = require("../models/petModel");

const applyForAdoption = async (req, res) => {
  try {
    const { petId, message } = req.body;

    if (!petId) {
      return res.status(400).json({
        message: "Pet ID is required",
      });
    }

    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found",
      });
    }

    // Applications can only be submitted for available pets.
    if (pet.status !== "available") {
      return res.status(400).json({
        message: "This pet is not currently available for adoption",
      });
    }

    // Prevent the same adopter from having another active application
    // for the same pet.
    const existingApplication = await Adoption.findOne({
      pet: petId,
      adopter: req.user._id,
      status: {
        $in: ["pending", "approved"],
      },
    });

    if (existingApplication) {
      return res.status(400).json({
        message:
          existingApplication.status === "approved"
            ? "Your adoption application for this pet has already been approved"
            : "You already have a pending application for this pet",
      });
    }

    const adoption = await Adoption.create({
      pet: petId,
      adopter: req.user._id,
      message,
    });

    res.status(201).json({
      message: "Adoption application submitted successfully",
      adoption,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Adoption.find({
      adopter: req.user._id,
    })
      .populate("pet")
      .sort({ createdAt: -1 });

    res.status(200).json({
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await Adoption.find()
      .populate("pet")
      .populate("adopter", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be approved or rejected",
      });
    }

    const adoption = await Adoption.findById(req.params.id);

    if (!adoption) {
      return res.status(404).json({
        message: "Adoption application not found",
      });
    }

    // Once an application has been processed, it cannot be processed again.
    if (adoption.status !== "pending") {
      return res.status(400).json({
        message: "Only pending adoption applications can be updated",
      });
    }

    /*
      Rejection does not change the pet status.
      The pet remains available so other adopters can still apply.
    */
    if (status === "rejected") {
      adoption.status = "rejected";
      await adoption.save();

      return res.status(200).json({
        message: "Application rejected successfully",
        adoption,
      });
    }

    /*
      From this point onward, status must be "approved".
    */

    const pet = await Pet.findById(adoption.pet);

    if (!pet) {
      return res.status(404).json({
        message: "The pet linked to this application no longer exists",
      });
    }

    /*
      An application can only be approved while the pet is still available.

      This prevents cases such as:
      - approving an application for an already adopted pet
      - approving another application after one has already been approved
      - turning a pending pet back into another adoption process
    */
    if (pet.status !== "available") {
      return res.status(400).json({
        message:
          "This pet is no longer available, so this application cannot be approved",
      });
    }

    /*
      Extra consistency check.

      Normally this should never happen because an approved application
      changes the pet to pending. This also protects against old or
      inconsistent database records.
    */
    const existingApprovedApplication = await Adoption.findOne({
      pet: adoption.pet,
      status: "approved",
      _id: {
        $ne: adoption._id,
      },
    });

    if (existingApprovedApplication) {
      return res.status(400).json({
        message: "This pet already has an approved adoption application",
      });
    }

    // Approve the selected application.
    adoption.status = "approved";
    await adoption.save();

    // The pet is now reserved for the approved adopter.
    pet.status = "pending";
    await pet.save();

    /*
      Automatically reject every other pending application
      for the same pet.
    */
    await Adoption.updateMany(
      {
        pet: adoption.pet,
        _id: {
          $ne: adoption._id,
        },
        status: "pending",
      },
      {
        $set: {
          status: "rejected",
        },
      },
    );

    res.status(200).json({
      message: "Application approved successfully",
      adoption,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const cancelApplication = async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id);

    if (!adoption) {
      return res.status(404).json({
        message: "Adoption application not found",
      });
    }

    if (adoption.adopter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to cancel this application",
      });
    }

    // Approved/rejected applications cannot be cancelled.
    if (adoption.status !== "pending") {
      return res.status(400).json({
        message: "Only pending applications can be cancelled",
      });
    }

    await adoption.deleteOne();

    res.status(200).json({
      message: "Adoption application cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  applyForAdoption,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  cancelApplication,
};