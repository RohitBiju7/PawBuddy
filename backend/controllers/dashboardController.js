const User = require("../models/userModel");
const Pet = require("../models/petModel");
const Adoption = require("../models/adoptionModel");
const Appointment = require("../models/appointmentModel");
const Payment = require("../models/paymentModel");

// Get Admin Dashboard statistics
const getAdminDashboardStats = async (req, res) => {
  try {
    /*
      Start of today.

      Upcoming appointments should only include active
      appointments scheduled for today or later.
    */
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    /*
      Run independent queries in parallel.

      Current operational data:
      - users
      - available/reserved pets
      - pending/approved/rejected applications
      - upcoming appointments

      Historical data:
      - completed adoptions
      - verified adoption fee payments
    */
    const [
      totalAdopters,
      totalStaff,

      availablePets,
      reservedPets,

      pendingApplications,
      approvedApplications,
      rejectedApplications,
      completedApplications,

      upcomingAppointments,

      paymentTotals,
    ] = await Promise.all([
      // Users
      User.countDocuments({
        role: "adopter",
      }),

      User.countDocuments({
        role: "staff",
      }),

      // Current pet inventory
      Pet.countDocuments({
        status: "available",
      }),

      Pet.countDocuments({
        status: "pending",
      }),

      // Adoption applications
      Adoption.countDocuments({
        status: "pending",
      }),

      Adoption.countDocuments({
        status: "approved",
      }),

      Adoption.countDocuments({
        status: "rejected",
      }),

      /*
        Completed adoption records are preserved even
        after the corresponding pet is deleted.

        Therefore this is our historical successful
        adoption count.
      */
      Adoption.countDocuments({
        status: "completed",
      }),

      // Upcoming active appointments
      Appointment.countDocuments({
        status: {
          $in: ["pending", "approved"],
        },

        appointmentDate: {
          $gte: today,
        },
      }),

      /*
        Historical verified adoption-fee payments.

        Paid Payment records are preserved even when
        the corresponding pet is later deleted.
      */
      Payment.aggregate([
        {
          $match: {
            paymentType: "adoption_fee",
            status: "paid",
          },
        },

        {
          $group: {
            _id: null,

            totalAmount: {
              $sum: "$amount",
            },

            totalPayments: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    const adoptionFeesCollected =
      paymentTotals.length > 0
        ? paymentTotals[0].totalAmount
        : 0;

    const successfulPayments =
      paymentTotals.length > 0
        ? paymentTotals[0].totalPayments
        : 0;

    /*
      Current pets currently stored in inventory.

      This intentionally does NOT include deleted
      adopted pets.
    */
    const currentPetCount =
      availablePets + reservedPets;

    /*
      Current retained application records.

      Completed records are historical and preserved.
      Other records may be removed when a pet is
      permanently deleted.
    */
    const totalApplicationRecords =
      pendingApplications +
      approvedApplications +
      rejectedApplications +
      completedApplications;

    res.status(200).json({
      stats: {
        users: {
          adopters: totalAdopters,
          staff: totalStaff,
        },

        /*
          Current inventory.
        */
        pets: {
          available: availablePets,
          reserved: reservedPets,
          currentTotal: currentPetCount,
        },

        /*
          Application status information for the
          dashboard bar chart.
        */
        applications: {
          pending: pendingApplications,
          approved: approvedApplications,
          rejected: rejectedApplications,
          completed: completedApplications,
          totalRecords: totalApplicationRecords,
        },

        appointments: {
          upcoming: upcomingAppointments,
        },

        /*
          Historical successful adoptions.

          This is intentionally based on completed
          Adoption records instead of Pet documents.
        */
        adoptions: {
          successful: completedApplications,
        },

        /*
          Historical financial totals.
        */
        payments: {
          adoptionFeesCollected,
          successfulPayments,
          currency: "INR",
        },
      },
    });
  } catch (error) {
    console.error(
      "Admin dashboard statistics error:",
      error,
    );

    res.status(500).json({
      message:
        "Failed to retrieve dashboard statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminDashboardStats,
};