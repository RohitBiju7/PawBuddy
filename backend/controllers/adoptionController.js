const Adoption = require("../models/adoptionModel");
const Pet = require("../models/petModel");
const sendEmail = require("../utils/sendEmail");

const sendAdoptionRejectionEmail = async ({
  adopter,
  petName,
}) => {
  if (!adopter?.email) {
    return false;
  }

  try {
    await sendEmail({
      to: adopter.email,

      subject: `Update regarding your adoption application for ${petName}`,

      text:
        `Hello ${adopter.name},\n\n` +
        `We are sorry to inform you that your adoption application for ${petName} has not been approved.\n\n` +
        `You can continue browsing other pets available for adoption on PawBuddy.\n\n` +
        `Thank you for your interest in adopting through PawBuddy.\n\n` +
        `PawBuddy`,

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #F28C7A;">
            Adoption Application Update
          </h2>

          <p>Hello ${adopter.name},</p>

          <p>
            We are sorry to inform you that your adoption application for
            <strong>${petName}</strong> has not been approved.
          </p>

          <p>
            You can continue browsing other pets available for adoption
            on PawBuddy.
          </p>

          <p>
            Thank you for your interest in adopting through PawBuddy.
          </p>

          <p style="color: #2F7D6D; font-weight: bold;">
            PawBuddy
          </p>
        </div>
      `,
    });

    return true;
  } catch (emailError) {
    console.error(
      `Failed to send adoption rejection email to ${adopter.email}:`,
      emailError.message,
    );

    return false;
  }
};

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

    if (pet.status !== "available") {
      return res.status(400).json({
        message:
          "This pet is not currently available for adoption",
      });
    }

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
      message:
        "Adoption application submitted successfully",
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
      .populate(
        "adopter",
        "name email phone",
      )
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

const updateApplicationStatus = async (
  req,
  res,
) => {
  try {
    const { status } = req.body;

    if (
      !["approved", "rejected"].includes(status)
    ) {
      return res.status(400).json({
        message:
          "Status must be approved or rejected",
      });
    }

    const adoption = await Adoption.findById(
      req.params.id,
    );

    if (!adoption) {
      return res.status(404).json({
        message:
          "Adoption application not found",
      });
    }

    if (adoption.status !== "pending") {
      return res.status(400).json({
        message:
          "Only pending adoption applications can be updated",
      });
    }

    /*
      Manual rejection
    */
    if (status === "rejected") {
      const pet = await Pet.findById(
        adoption.pet,
      );

      if (!pet) {
        return res.status(404).json({
          message:
            "The pet linked to this application no longer exists",
        });
      }

      await adoption.populate(
        "adopter",
        "name email",
      );

      adoption.status = "rejected";

      await adoption.save();

      const emailSent =
        await sendAdoptionRejectionEmail({
          adopter: adoption.adopter,
          petName: pet.name,
        });

      return res.status(200).json({
        message:
          "Application rejected successfully",
        adoption,
        emailSent,
      });
    }

    /*
      Approval
    */
    const pet = await Pet.findById(
      adoption.pet,
    );

    if (!pet) {
      return res.status(404).json({
        message:
          "The pet linked to this application no longer exists",
      });
    }

    if (pet.status !== "available") {
      return res.status(400).json({
        message:
          "This pet is no longer available, so this application cannot be approved",
      });
    }

    const existingApprovedApplication =
      await Adoption.findOne({
        pet: adoption.pet,
        status: "approved",
        _id: {
          $ne: adoption._id,
        },
      });

    if (existingApprovedApplication) {
      return res.status(400).json({
        message:
          "This pet already has an approved adoption application",
      });
    }

    /*
      Get the other pending applications before
      changing their status so we can notify them.
    */
    const applicationsToReject =
      await Adoption.find({
        pet: adoption.pet,
        _id: {
          $ne: adoption._id,
        },
        status: "pending",
      }).populate(
        "adopter",
        "name email",
      );

    // Approve selected application.
    adoption.status = "approved";

    await adoption.save();

    // Reserve the pet.
    pet.status = "pending";

    await pet.save();

    // Reject all other pending applications.
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

    /*
      Notify automatically rejected adopters.

      Email failures should not undo the approval.
    */
    let rejectionEmailsSent = 0;

    for (const rejectedApplication of applicationsToReject) {
      const sent =
        await sendAdoptionRejectionEmail({
          adopter:
            rejectedApplication.adopter,
          petName: pet.name,
        });

      if (sent) {
        rejectionEmailsSent += 1;
      }
    }

    /*
      Send approval email to selected adopter.
    */
    await adoption.populate(
      "adopter",
      "name email",
    );

    let emailSent = false;

    try {
      if (adoption.adopter?.email) {
        await sendEmail({
          to: adoption.adopter.email,

          subject: `Your adoption application for ${pet.name} has been approved!`,

          text:
            `Hello ${adoption.adopter.name},\n\n` +
            `Great news! Your adoption application for ${pet.name} has been approved by PawBuddy.\n\n` +
            `${pet.name} is now reserved for you.\n\n` +
            `Please book an adoption appointment through PawBuddy to continue the adoption process.\n\n` +
            `You can do this from the My Appointments section after logging into your PawBuddy account.\n\n` +
            `Thank you for choosing PawBuddy!`,

          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #2F7D6D;">
                Adoption Application Approved 🐾
              </h2>

              <p>
                Hello ${adoption.adopter.name},
              </p>

              <p>
                Great news! Your adoption
                application for
                <strong>${pet.name}</strong>
                has been approved by PawBuddy.
              </p>

              <p>
                <strong>${pet.name}</strong>
                is now reserved for you.
              </p>

              <p>
                Please book an
                <strong>
                  adoption appointment
                </strong>
                through PawBuddy to continue
                the adoption process.
              </p>

              <p>
                You can book the appointment
                from the
                <strong>
                  My Appointments
                </strong>
                section after logging into
                your PawBuddy account.
              </p>

              <p>
                Thank you for choosing
                PawBuddy!
              </p>

              <p
                style="
                  color: #2F7D6D;
                  font-weight: bold;
                "
              >
                PawBuddy
              </p>
            </div>
          `,
        });

        emailSent = true;
      }
    } catch (emailError) {
      console.error(
        "Failed to send adoption approval email:",
        emailError.message,
      );
    }

    res.status(200).json({
      message:
        "Application approved successfully",
      adoption,
      emailSent,
      rejectionEmailsSent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const completeAdoption = async (
  req,
  res,
) => {
  try {
    const adoption =
      await Adoption.findById(
        req.params.id,
      );

    if (!adoption) {
      return res.status(404).json({
        message:
          "Adoption application not found",
      });
    }

    if (adoption.status !== "approved") {
      return res.status(400).json({
        message:
          "Only an approved adoption application can be marked as completed",
      });
    }

    const pet = await Pet.findById(
      adoption.pet,
    );

    if (!pet) {
      return res.status(404).json({
        message:
          "The pet linked to this adoption no longer exists",
      });
    }

    if (pet.status !== "pending") {
      return res.status(400).json({
        message:
          "This pet is not currently reserved for an approved adoption",
      });
    }

    adoption.status = "completed";

    await adoption.save();

    pet.status = "adopted";

    await pet.save();

    res.status(200).json({
      message:
        "Adoption completed successfully",
      adoption,
      pet,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const cancelApplication = async (
  req,
  res,
) => {
  try {
    const adoption =
      await Adoption.findById(
        req.params.id,
      );

    if (!adoption) {
      return res.status(404).json({
        message:
          "Adoption application not found",
      });
    }

    if (
      adoption.adopter.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to cancel this application",
      });
    }

    if (adoption.status !== "pending") {
      return res.status(400).json({
        message:
          "Only pending applications can be cancelled",
      });
    }

    await adoption.deleteOne();

    res.status(200).json({
      message:
        "Adoption application cancelled successfully",
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
  completeAdoption,
  cancelApplication,
};