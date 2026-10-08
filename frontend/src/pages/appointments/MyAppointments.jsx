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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

import {
  requestAppointment,
  getMyAppointments,
  cancelAppointment,
} from "../../services/appointmentService";

import { getMyApplications } from "../../services/adoptionService";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [approvedApplications, setApprovedApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const initialFormData = {
    adoptionId: "",
    visitType: "adoption",
    appointmentDate: "",
    appointmentHour: "10",
    appointmentMinute: "00",
    appointmentPeriod: "AM",
    notes: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [appointmentData, adoptionData] =
        await Promise.all([
          getMyAppointments(),
          getMyApplications(),
        ]);

      setAppointments(
        appointmentData.appointments || [],
      );

      const approved =
        adoptionData.applications?.filter(
          (application) =>
            application.status === "approved" &&
            application.pet,
        ) || [];

      setApprovedApplications(approved);
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
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpen = () => {
    setFormData(initialFormData);
    setError("");
    setSuccess("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const appointmentTime =
        `${formData.appointmentHour}:` +
        `${formData.appointmentMinute} ` +
        `${formData.appointmentPeriod}`;

      const appointmentData = {
        adoptionId: formData.adoptionId,
        visitType: formData.visitType,
        appointmentDate: formData.appointmentDate,
        appointmentTime,
        notes: formData.notes,
      };

      const data = await requestAppointment(
        appointmentData,
      );

      handleClose();

      await fetchData();

      setSuccess(
        data.message ||
          "Appointment request submitted successfully.",
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to request appointment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment request?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const data = await cancelAppointment(
        appointmentId,
      );

      await fetchData();

      setSuccess(
        data.message ||
          "Appointment cancelled successfully.",
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to cancel appointment.",
      );
    }
  };

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
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      },
    );
  };

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1,
    ).padStart(2, "0");

    const day = String(
      today.getDate(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const hours = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  const minutes = [
    "00",
    "15",
    "30",
    "45",
  ];

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                mb: 1,
              }}
            >
              My Appointments
            </Typography>

            <Typography color="text.secondary">
              View and manage your PawBuddy adoption appointments.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={handleOpen}
            disabled={
              approvedApplications.length === 0
            }
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Request Appointment
          </Button>
        </Box>

        {approvedApplications.length === 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You need an approved adoption application before
            you can request an appointment.
          </Alert>
        )}

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
            {appointments.map((appointment) => (
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
                  }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={2}
                      sx={{
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "primary.main",
                          fontWeight: 700,
                        }}
                      >
                        {appointment.pet?.name ||
                          "Pet unavailable"}
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

                    {appointment.status === "pending" && (
                      <Box sx={{ mt: 3 }}>
                        <Alert
                          severity="warning"
                          sx={{ mb: 2 }}
                        >
                          Waiting for approval from PawBuddy staff.
                        </Alert>

                        <Button
                          variant="outlined"
                          color="error"
                          fullWidth
                          onClick={() =>
                            handleCancel(
                              appointment._id,
                            )
                          }
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                        >
                          Cancel Appointment
                        </Button>
                      </Box>
                    )}

                    {appointment.status === "approved" && (
                      <Alert
                        severity="success"
                        sx={{ mt: 3 }}
                      >
                        Your appointment has been approved.
                      </Alert>
                    )}

                    {appointment.status === "rejected" && (
                      <Alert
                        severity="error"
                        sx={{ mt: 3 }}
                      >
                        This appointment request was rejected.
                      </Alert>
                    )}

                    {appointment.status === "completed" && (
                      <Alert
                        severity="info"
                        sx={{ mt: 3 }}
                      >
                        This appointment has been completed.
                      </Alert>
                    )}

                    {appointment.status === "cancelled" && (
                      <Alert
                        severity="info"
                        sx={{ mt: 3 }}
                      >
                        This appointment was cancelled.
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}

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
                    No appointments yet
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Your appointment requests will appear here.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}

        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <DialogTitle>
              Request Appointment
            </DialogTitle>

            <DialogContent>
              <Stack
                spacing={2.5}
                sx={{
                  mt: 1,
                }}
              >
                <TextField
                  select
                  label="Approved Adoption"
                  name="adoptionId"
                  value={formData.adoptionId}
                  onChange={handleChange}
                  required
                  fullWidth
                >
                  {approvedApplications.map(
                    (application) => (
                      <MenuItem
                        key={application._id}
                        value={application._id}
                      >
                        {application.pet?.name ||
                          "Unknown Pet"}
                      </MenuItem>
                    ),
                  )}
                </TextField>

                <TextField
                  select
                  label="Visit Type"
                  name="visitType"
                  value={formData.visitType}
                  onChange={handleChange}
                  required
                  fullWidth
                >
                  <MenuItem value="adoption">
                    Adoption Visit
                  </MenuItem>

                  <MenuItem value="site visit">
                    Site Visit
                  </MenuItem>
                </TextField>

                {/* Date */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 0.8,
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    Appointment Date *
                  </Typography>

                  <TextField
                    name="appointmentDate"
                    type="date"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    inputProps={{
                      min: getTodayDate(),
                    }}
                    required
                    fullWidth
                  />
                </Box>

                {/* 12-hour appointment time */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 0.8,
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    Appointment Time *
                  </Typography>

                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        select
                        label="Hour"
                        name="appointmentHour"
                        value={
                          formData.appointmentHour
                        }
                        onChange={handleChange}
                        required
                        fullWidth
                      >
                        {hours.map((hour) => (
                          <MenuItem
                            key={hour}
                            value={hour}
                          >
                            {hour}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid size={{ xs: 4 }}>
                      <TextField
                        select
                        label="Minute"
                        name="appointmentMinute"
                        value={
                          formData.appointmentMinute
                        }
                        onChange={handleChange}
                        required
                        fullWidth
                      >
                        {minutes.map((minute) => (
                          <MenuItem
                            key={minute}
                            value={minute}
                          >
                            {minute}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid size={{ xs: 4 }}>
                      <TextField
                        select
                        label="AM / PM"
                        name="appointmentPeriod"
                        value={
                          formData.appointmentPeriod
                        }
                        onChange={handleChange}
                        required
                        fullWidth
                      >
                        <MenuItem value="AM">
                          AM
                        </MenuItem>

                        <MenuItem value="PM">
                          PM
                        </MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </Box>

                <TextField
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  inputProps={{
                    maxLength: 500,
                  }}
                  fullWidth
                />
              </Stack>
            </DialogContent>

            <DialogActions
              sx={{
                p: 3,
              }}
            >
              <Button
                onClick={handleClose}
                color="inherit"
                sx={{
                  textTransform: "none",
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {submitting
                  ? "Submitting..."
                  : "Request Appointment"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyAppointments;