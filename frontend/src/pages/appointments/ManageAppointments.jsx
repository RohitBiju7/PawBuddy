import React, { useEffect, useState } from "react";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";

import {
  getAllAppointments,
  updateAppointmentStatus,
  completeAppointment,
  deleteAppointment,
} from "../../services/appointmentService";

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllAppointments();

      setAppointments(data.appointments || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load appointments.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (status) => {
    if (status === "approved") {
      return "success";
    }

    if (status === "rejected") {
      return "error";
    }

    if (status === "completed") {
      return "info";
    }

    if (status === "cancelled") {
      return "default";
    }

    return "warning";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleStatusUpdate = async (
    appointmentId,
    status,
  ) => {
    const action =
      status === "approved" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this appointment?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(appointmentId);
      setError("");
      setSuccess("");

      const data = await updateAppointmentStatus(
        appointmentId,
        status,
      );

      await fetchAppointments();

      setSuccess(
        data.message ||
          `Appointment ${status} successfully.`,
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update appointment.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleComplete = async (
    appointmentId,
    petName,
  ) => {
    const confirmed = window.confirm(
      `Has the appointment for ${petName} been completed?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(appointmentId);
      setError("");
      setSuccess("");

      const data = await completeAppointment(
        appointmentId,
      );

      await fetchAppointments();

      setSuccess(
        data.message ||
          "Appointment completed successfully.",
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to complete appointment.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteAppointment = async (
    appointmentId,
    petName,
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the completed appointment for ${petName}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(appointmentId);
      setError("");
      setSuccess("");

      const data = await deleteAppointment(
        appointmentId,
      );

      setAppointments((currentAppointments) =>
        currentAppointments.filter(
          (appointment) =>
            appointment._id !== appointmentId,
        ),
      );

      setSuccess(
        data.message ||
          "Appointment deleted successfully.",
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete appointment.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 70px)",
        backgroundColor: "background.default",
        py: {
          xs: 3,
          sm: 5,
        },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              mb: 1,
            }}
          >
            Manage Appointments
          </Typography>

          <Typography color="text.secondary">
            Review and manage adoption and site visit appointments.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {loading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              minHeight: 300,
            }}
          >
            <CircularProgress />
          </Stack>
        ) : (
          <Grid container spacing={3}>
            {appointments.map((appointment) => {
              const pet = appointment.pet;
              const adopter = appointment.adopter;

              return (
                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                  key={appointment._id}
                >
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      overflow: "hidden",
                    }}
                  >
                    {pet?.image ? (
                      <Box
                        component="img"
                        src={`http://localhost:5000/uploads/${pet.image}`}
                        alt={pet.name}
                        sx={{
                          width: "100%",
                          height: 240,
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 240,
                          backgroundColor: "#EAF4F1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography color="text.secondary">
                          No Image Available
                        </Typography>
                      </Box>
                    )}

                    <CardContent>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={2}
                        sx={{ mb: 2 }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: "primary.main",
                            fontWeight: 700,
                          }}
                        >
                          {pet?.name || "Pet unavailable"}
                        </Typography>

                        <Chip
                          label={appointment.status}
                          color={getStatusColor(
                            appointment.status,
                          )}
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: 600,
                          }}
                        />
                      </Stack>

                      <Stack spacing={1}>
                        <Typography color="text.secondary">
                          <strong>Visit Type:</strong>{" "}
                          {appointment.visitType}
                        </Typography>

                        <Typography color="text.secondary">
                          <strong>Date:</strong>{" "}
                          {formatDate(
                            appointment.appointmentDate,
                          )}
                        </Typography>

                        <Typography color="text.secondary">
                          <strong>Time:</strong>{" "}
                          {appointment.appointmentTime}
                        </Typography>

                        {appointment.notes && (
                          <Typography color="text.secondary">
                            <strong>Notes:</strong>{" "}
                            {appointment.notes}
                          </Typography>
                        )}

                        {appointment.approvedBy && (
                          <Typography color="text.secondary">
                            <strong>Approved By:</strong>{" "}
                            {appointment.approvedBy.name}
                          </Typography>
                        )}
                      </Stack>

                      <Divider sx={{ my: 2 }} />

                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        Adopter Details
                      </Typography>

                      <Stack spacing={0.8}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          <strong>Name:</strong>{" "}
                          {adopter?.name || "Unavailable"}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          <strong>Email:</strong>{" "}
                          {adopter?.email || "Unavailable"}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          <strong>Phone:</strong>{" "}
                          {adopter?.phone || "Unavailable"}
                        </Typography>
                      </Stack>

                      {appointment.status === "pending" && (
                        <Stack
                          direction={{
                            xs: "column",
                            sm: "row",
                          }}
                          spacing={1.5}
                          sx={{ mt: 3 }}
                        >
                          <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            disabled={
                              updatingId === appointment._id
                            }
                            onClick={() =>
                              handleStatusUpdate(
                                appointment._id,
                                "approved",
                              )
                            }
                            sx={{
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            {updatingId === appointment._id
                              ? "Updating..."
                              : "Approve"}
                          </Button>

                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            disabled={
                              updatingId === appointment._id
                            }
                            onClick={() =>
                              handleStatusUpdate(
                                appointment._id,
                                "rejected",
                              )
                            }
                            sx={{
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            {updatingId === appointment._id
                              ? "Updating..."
                              : "Reject"}
                          </Button>
                        </Stack>
                      )}

                      {appointment.status === "approved" && (
                        <Box sx={{ mt: 3 }}>
                          <Alert
                            severity="success"
                            sx={{ mb: 2 }}
                          >
                            This appointment has been approved.
                          </Alert>

                          <Button
                            variant="contained"
                            fullWidth
                            disabled={
                              updatingId === appointment._id
                            }
                            onClick={() =>
                              handleComplete(
                                appointment._id,
                                pet?.name || "this pet",
                              )
                            }
                            sx={{
                              textTransform: "none",
                              fontWeight: 700,
                            }}
                          >
                            {updatingId === appointment._id
                              ? "Updating..."
                              : "Mark as Completed"}
                          </Button>
                        </Box>
                      )}

                      {appointment.status === "rejected" && (
                        <Alert
                          severity="error"
                          sx={{ mt: 3 }}
                        >
                          This appointment request has been rejected.
                        </Alert>
                      )}

                      {appointment.status === "completed" && (
                        <Box sx={{ mt: 3 }}>
                          <Alert
                            severity="info"
                            sx={{ mb: 2 }}
                          >
                            This appointment has been completed.
                          </Alert>

                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            disabled={
                              updatingId === appointment._id
                            }
                            onClick={() =>
                              handleDeleteAppointment(
                                appointment._id,
                                pet?.name || "this pet",
                              )
                            }
                            sx={{
                              textTransform: "none",
                              fontWeight: 700,
                            }}
                          >
                            {updatingId === appointment._id
                              ? "Deleting..."
                              : "Delete Appointment"}
                          </Button>
                        </Box>
                      )}

                      {appointment.status === "cancelled" && (
                        <Alert
                          severity="info"
                          sx={{ mt: 3 }}
                        >
                          This appointment was cancelled by the adopter.
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}

            {appointments.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    py: 8,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    No appointments
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Appointment requests will appear here.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ManageAppointments;