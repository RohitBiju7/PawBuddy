const Pet = require("../models/petModel");
const Adoption = require("../models/adoptionModel");
const Appointment = require("../models/appointmentModel");
const sendEmail = require("../utils/sendEmail");

const fs = require("fs");
const path = require("path");

const removeUploadedFile = (file) => {
  if (!file) {
    return;
  }

  const filePath = path.join(
    __dirname,
    "..",
    "uploads",
    file.filename,
  );

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const addPet = async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      gender,
      description,
      healthStatus,
      vaccinationStatus,
      adoptionFee,
    } = req.body;

    if (
      !name ||
      !species ||
      !breed ||
      age === undefined ||
      !gender ||
      !description ||
      !healthStatus ||
      adoptionFee === undefined
    ) {
      removeUploadedFile(req.file);

      return res.status(400).json({
        message:
          "Please provide all required pet details",
      });
    }

    const pet = await Pet.create({
      name,
      species,
      breed,
      age,
      gender,
      description,
      healthStatus,
      vaccinationStatus,
      adoptionFee,
      image: req.file ? req.file.filename : null,
      createdBy: req.user._id,
      status: "available",
    });

    res.status(201).json({
      message: "Pet added successfully",
      pet,
    });
  } catch (error) {
    removeUploadedFile(req.file);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all pets with optional filters and search
const getAllPets = async (req, res) => {
  try {
    const {
      species,
      gender,
      status,
      search,
    } = req.query;

    const filter = {};

    if (species) {
      filter.species = species;
    }

    if (gender) {
      filter.gender = gender;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          breed: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const pets = await Pet.find(filter);

    res.status(200).json({
      pets,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get a single pet by ID
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(
      req.params.id,
    );

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found",
      });
    }

    res.status(200).json({
      pet,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update a pet by ID
const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(
      req.params.id,
    );

    if (!pet) {
      removeUploadedFile(req.file);

      return res.status(404).json({
        message: "Pet not found",
      });
    }

    /*
      Once a pet enters the adoption process,
      its details should no longer be editable.

      available = editable
      pending   = locked
      adopted   = locked
    */
    if (pet.status !== "available") {
      removeUploadedFile(req.file);

      return res.status(400).json({
        message:
          "This pet cannot be edited because its adoption process has already started.",
      });
    }

    /*
      Pet adoption status cannot be manually
      changed through the normal update endpoint.
    */
    if (
      req.body.status !== undefined &&
      req.body.status !== pet.status
    ) {
      removeUploadedFile(req.file);

      return res.status(400).json({
        message:
          "Pet adoption status cannot be changed manually. It is controlled by the adoption process.",
      });
    }

    const allowedFields = [
      "name",
      "species",
      "breed",
      "age",
      "gender",
      "description",
      "healthStatus",
      "vaccinationStatus",
      "adoptionFee",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        pet[field] = req.body[field];
      }
    });

    if (req.file) {
      const newImageFilename =
        req.file.filename;

      if (pet.image) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          pet.image,
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      pet.image = newImageFilename;
    }

    await pet.save();

    res.status(200).json({
      message: "Pet updated successfully",
      pet,
    });
  } catch (error) {
    removeUploadedFile(req.file);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete a pet by ID
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(
      req.params.id,
    );

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found",
      });
    }

    /*
      Find adoption applications before deletion
      so affected adopters can be notified.

      Completed adoption records are historical
      records and must NOT be deleted.
    */
    const relatedApplications =
      await Adoption.find({
        pet: pet._id,
      }).populate(
        "adopter",
        "name email",
      );

    const applicationsToNotify =
      relatedApplications.filter(
        (application) =>
          ["pending", "approved"].includes(
            application.status,
          ),
      );

    const completedAdoptions =
      relatedApplications.filter(
        (application) =>
          application.status === "completed",
      );

    /*
      Find appointments linked to the pet before deletion.

      Pending and approved appointments are active,
      so those adopters should be informed.
    */
    const relatedAppointments =
      await Appointment.find({
        pet: pet._id,
      }).populate(
        "adopter",
        "name email",
      );

    const appointmentsToNotify =
      relatedAppointments.filter(
        (appointment) =>
          ["pending", "approved"].includes(
            appointment.status,
          ),
      );

    let adoptionEmailsSent = 0;
    let appointmentEmailsSent = 0;

    /*
      Send adoption-related deletion emails.
    */
    for (const application of applicationsToNotify) {
      if (!application.adopter?.email) {
        continue;
      }

      const isApproved =
        application.status === "approved";

      const subject = isApproved
        ? `Important update about your adoption of ${pet.name}`
        : `Update about your adoption application for ${pet.name}`;

      const text = isApproved
        ? `Hello ${application.adopter.name},\n\n` +
          `We are sorry to inform you that ${pet.name}, who had been reserved for you, is no longer available through PawBuddy.\n\n` +
          `Your approved adoption process has therefore been cancelled.\n\n` +
          `Please contact the shelter if you need any further information.\n\n` +
          `PawBuddy`
        : `Hello ${application.adopter.name},\n\n` +
          `We are sorry to inform you that ${pet.name}, the pet you applied to adopt, is no longer available through PawBuddy.\n\n` +
          `Your adoption application will therefore be removed.\n\n` +
          `Thank you for your understanding.\n\n` +
          `PawBuddy`;

      const html = isApproved
        ? `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #2F7D6D;">
              Important Adoption Update
            </h2>

            <p>Hello ${application.adopter.name},</p>

            <p>
              We are sorry to inform you that
              <strong>${pet.name}</strong>, who had been reserved for you,
              is no longer available through PawBuddy.
            </p>

            <p>
              Your approved adoption process has therefore been cancelled.
            </p>

            <p>
              Please contact the shelter if you need any further information.
            </p>

            <p style="color: #2F7D6D; font-weight: bold;">
              PawBuddy
            </p>
          </div>
        `
        : `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #2F7D6D;">
              Adoption Application Update
            </h2>

            <p>Hello ${application.adopter.name},</p>

            <p>
              We are sorry to inform you that
              <strong>${pet.name}</strong>, the pet you applied to adopt,
              is no longer available through PawBuddy.
            </p>

            <p>
              Your adoption application will therefore be removed.
            </p>

            <p>
              Thank you for your understanding.
            </p>

            <p style="color: #2F7D6D; font-weight: bold;">
              PawBuddy
            </p>
          </div>
        `;

      try {
        await sendEmail({
          to: application.adopter.email,
          subject,
          text,
          html,
        });

        adoptionEmailsSent += 1;
      } catch (emailError) {
        console.error(
          `Failed to send adoption deletion email to ${application.adopter.email}:`,
          emailError.message,
        );
      }
    }

    /*
      Send appointment cancellation emails caused
      by pet deletion.
    */
    for (const appointment of appointmentsToNotify) {
      if (!appointment.adopter?.email) {
        continue;
      }

      const formattedDate = new Date(
        appointment.appointmentDate,
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      try {
        await sendEmail({
          to: appointment.adopter.email,

          subject: `Your PawBuddy appointment for ${pet.name} has been cancelled`,

          text:
            `Hello ${appointment.adopter.name},\n\n` +
            `We are sorry to inform you that your ${appointment.visitType} appointment for ${pet.name} can no longer take place because this pet has been removed from PawBuddy.\n\n` +
            `Appointment Date: ${formattedDate}\n` +
            `Appointment Time: ${appointment.appointmentTime}\n\n` +
            `The appointment has therefore been cancelled and removed from the system.\n\n` +
            `Please contact the shelter if you need any further information.\n\n` +
            `PawBuddy`,

          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #F28C7A;">
                Appointment Cancelled
              </h2>

              <p>Hello ${appointment.adopter.name},</p>

              <p>
                We are sorry to inform you that your
                <strong>${appointment.visitType}</strong>
                appointment for
                <strong>${pet.name}</strong>
                can no longer take place because this pet has been removed
                from PawBuddy.
              </p>

              <p>
                <strong>Appointment Date:</strong> ${formattedDate}<br />
                <strong>Appointment Time:</strong> ${appointment.appointmentTime}
              </p>

              <p>
                The appointment has therefore been cancelled and removed
                from the system.
              </p>

              <p>
                Please contact the shelter if you need any further information.
              </p>

              <p style="color: #2F7D6D; font-weight: bold;">
                PawBuddy
              </p>
            </div>
          `,
        });

        appointmentEmailsSent += 1;
      } catch (emailError) {
        console.error(
          `Failed to send appointment deletion email to ${appointment.adopter.email}:`,
          emailError.message,
        );
      }
    }

    /*
      Appointments are operational records.

      Since the pet itself is being permanently removed,
      remove its appointments after notifying anyone with
      an active appointment.
    */
    await Appointment.deleteMany({
      pet: pet._id,
    });

    /*
      IMPORTANT:
      Preserve completed adoption records because they
      represent historical successful adoptions.

      Delete only non-completed adoption records:
      - pending
      - approved
      - rejected

      This means deleting an adopted pet will NOT reduce
      the Successful Adoptions statistic later.
    */
    const deletedApplications =
      await Adoption.deleteMany({
        pet: pet._id,
        status: {
          $ne: "completed",
        },
      });

    /*
      Payment records are intentionally NOT deleted here.

      A successful payment is financial history and must
      remain recorded even if the pet is later removed.
    */

    // Delete the pet image from uploads.
    if (pet.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        pet.image,
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Permanently delete the pet document.
    await pet.deleteOne();

    res.status(200).json({
      message: "Pet deleted successfully",

      affectedApplications:
        relatedApplications.length,

      deletedApplications:
        deletedApplications.deletedCount,

      preservedCompletedAdoptions:
        completedAdoptions.length,

      affectedAppointments:
        relatedAppointments.length,

      notifiedApplications:
        applicationsToNotify.length,

      notifiedAppointments:
        appointmentsToNotify.length,

      adoptionEmailsSent,
      appointmentEmailsSent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  addPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,
};