const Appointment = require("../models/appointmentModel");
const Adoption = require("../models/adoptionModel");
const Pet = require("../models/petModel");
const sendEmail = require("../utils/sendEmail");

const requestAppointment = async (req, res) => {
  try {
    const {
      adoptionId,
      visitType,
      appointmentDate,
      appointmentTime,
      notes,
    } = req.body;

    if (
      !adoptionId ||
      !visitType ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return res.status(400).json({
        message: "Please provide all required appointment details",
      });
    }

    if (!["adoption", "site visit"].includes(visitType)) {
      return res.status(400).json({
        message: "Invalid visit type",
      });
    }

    const adoption = await Adoption.findById(adoptionId).populate(
      "pet",
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
          "You are not allowed to schedule an appointment for this adoption",
      });
    }

    if (adoption.status !== "approved") {
      return res.status(400).json({
        message:
          "Appointments can only be scheduled for approved adoption applications",
      });
    }

    if (!adoption.pet) {
      return res.status(404).json({
        message: "The pet linked to this adoption no longer exists",
      });
    }

    const selectedDate = new Date(appointmentDate);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid appointment date",
      });
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        message: "Appointment date cannot be in the past",
      });
    }

    const existingAppointment = await Appointment.findOne({
      adoption: adoption._id,
      status: {
        $in: ["pending", "approved"],
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message:
          "You already have an active appointment for this adoption",
      });
    }

    const appointment = await Appointment.create({
      adoption: adoption._id,
      pet: adoption.pet._id,
      adopter: req.user._id,
      visitType,
      appointmentDate,
      appointmentTime,
      notes,
    });

    const populatedAppointment =
      await Appointment.findById(appointment._id)
        .populate("pet", "name")
        .populate("adopter", "name email")
        .populate("adoption");

    res.status(201).json({
      message: "Appointment request submitted successfully",
      appointment: populatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      adopter: req.user._id,
    })
      .populate("pet", "name image status")
      .populate("adoption")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("pet", "name image status adoptionFee")
      .populate("adopter", "name email phone")
      .populate("adoption")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be approved or rejected",
      });
    }

    const appointment = await Appointment.findById(
      req.params.id,
    )
      .populate("pet", "name")
      .populate("adopter", "name email");

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "pending") {
      return res.status(400).json({
        message: "Only pending appointments can be updated",
      });
    }

    appointment.status = status;

    if (status === "approved") {
      appointment.approvedBy = req.user._id;
    }

    await appointment.save();

    let emailSent = false;

    const formattedDate = new Date(
      appointment.appointmentDate,
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    /*
      APPROVED EMAIL
    */
    if (
      status === "approved" &&
      appointment.adopter?.email
    ) {
      try {
        await sendEmail({
          to: appointment.adopter.email,

          subject: `Your PawBuddy appointment for ${appointment.pet.name} has been approved`,

          text:
            `Hello ${appointment.adopter.name},\n\n` +
            `Your ${appointment.visitType} appointment for ${appointment.pet.name} has been approved.\n\n` +
            `Date: ${formattedDate}\n` +
            `Time: ${appointment.appointmentTime}\n\n` +
            `Please arrive at the scheduled time.\n\n` +
            `PawBuddy`,

          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #2F7D6D;">
                Appointment Approved 🐾
              </h2>

              <p>Hello ${appointment.adopter.name},</p>

              <p>
                Your <strong>${appointment.visitType}</strong>
                appointment for
                <strong>${appointment.pet.name}</strong>
                has been approved.
              </p>

              <p>
                <strong>Date:</strong> ${formattedDate}<br />
                <strong>Time:</strong> ${appointment.appointmentTime}
              </p>

              <p>
                Please arrive at the scheduled time.
              </p>

              <p style="color: #2F7D6D; font-weight: bold;">
                PawBuddy
              </p>
            </div>
          `,
        });

        emailSent = true;
      } catch (emailError) {
        console.error(
          "Failed to send appointment approval email:",
          emailError.message,
        );
      }
    }

    /*
      REJECTED EMAIL
    */
    if (
      status === "rejected" &&
      appointment.adopter?.email
    ) {
      try {
        await sendEmail({
          to: appointment.adopter.email,

          subject: `Update regarding your PawBuddy appointment for ${appointment.pet.name}`,

          text:
            `Hello ${appointment.adopter.name},\n\n` +
            `Your ${appointment.visitType} appointment request for ${appointment.pet.name} has been rejected.\n\n` +
            `Requested Date: ${formattedDate}\n` +
            `Requested Time: ${appointment.appointmentTime}\n\n` +
            `You may submit another appointment request if your adoption application is still approved.\n\n` +
            `PawBuddy`,

          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #F28C7A;">
                Appointment Request Update
              </h2>

              <p>Hello ${appointment.adopter.name},</p>

              <p>
                Your <strong>${appointment.visitType}</strong>
                appointment request for
                <strong>${appointment.pet.name}</strong>
                has been rejected.
              </p>

              <p>
                <strong>Requested Date:</strong> ${formattedDate}<br />
                <strong>Requested Time:</strong> ${appointment.appointmentTime}
              </p>

              <p>
                You may submit another appointment request if your
                adoption application is still approved.
              </p>

              <p style="color: #2F7D6D; font-weight: bold;">
                PawBuddy
              </p>
            </div>
          `,
        });

        emailSent = true;
      } catch (emailError) {
        console.error(
          "Failed to send appointment rejection email:",
          emailError.message,
        );
      }
    }

    res.status(200).json({
      message:
        status === "approved"
          ? "Appointment approved successfully"
          : "Appointment rejected successfully",
      appointment,
      emailSent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(
      req.params.id,
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "approved") {
      return res.status(400).json({
        message:
          "Only approved appointments can be marked as completed",
      });
    }

    appointment.status = "completed";

    await appointment.save();

    res.status(200).json({
      message: "Appointment completed successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteCompletedAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(
      req.params.id,
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    /*
      Admin/staff should complete the appointment first.

      This prevents active or pending appointments from being
      accidentally removed from the management system.
    */
    if (appointment.status !== "completed") {
      return res.status(400).json({
        message:
          "Only completed appointments can be deleted",
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      message: "Completed appointment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(
      req.params.id,
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (
      appointment.adopter.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to cancel this appointment",
      });
    }

    if (appointment.status !== "pending") {
      return res.status(400).json({
        message:
          "Only pending appointments can be cancelled",
      });
    }

    appointment.status = "cancelled";

    await appointment.save();

    res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  requestAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  completeAppointment,
  deleteCompletedAppointment,
  cancelAppointment,
};