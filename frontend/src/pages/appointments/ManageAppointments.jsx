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

import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import StickyNote2RoundedIcon from "@mui/icons-material/StickyNote2Rounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import {
  getAllAppointments,
  updateAppointmentStatus,
  completeAppointment,
  deleteAppointment,
} from "../../services/appointmentService";

const statusStyles = {
  pending: {
    label: "Pending",
    color: "#99651E",
    background: "#FFF0DC",
    icon: <HourglassTopRoundedIcon />,
  },
  approved: {
    label: "Approved",
    color: "#246A52",
    background: "#E1F2E8",
    icon: <CheckCircleRoundedIcon />,
  },
  completed: {
    label: "Completed",
    color: "#367F98",
    background: "#E4F1F6",
    icon: <FavoriteRoundedIcon />,
  },
  rejected: {
    label: "Rejected",
    color: "#BE5555",
    background: "#FCE9E7",
    icon: <CancelRoundedIcon />,
  },
  cancelled: {
    label: "Cancelled",
    color: "#6E7880",
    background: "#EDF0F2",
    icon: <CancelRoundedIcon />,
  },
};

const getStatusStyle = (status) =>
  statusStyles[status] || statusStyles.pending;

const formatDate = (date) => {
  if (!date) {
    return "Not specified";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not specified";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatVisitType = (visitType) => {
  if (!visitType) {
    return "Not specified";
  }

  return visitType
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

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

  const handleStatusUpdate = async (appointmentId, status) => {
    const action = status === "approved" ? "approve" : "reject";

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
        data.message || `Appointment ${status} successfully.`,
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

  const handleComplete = async (appointmentId, petName) => {
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

      const data = await completeAppointment(appointmentId);

      await fetchAppointments();

      setSuccess(
        data.message || "Appointment completed successfully.",
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

  const handleDeleteAppointment = async (appointmentId, petName) => {
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

      const data = await deleteAppointment(appointmentId);

      setAppointments((currentAppointments) =>
        currentAppointments.filter(
          (appointment) => appointment._id !== appointmentId,
        ),
      );

      setSuccess(
        data.message || "Appointment deleted successfully.",
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

  const summary = [
    { status: "pending", count: appointments.filter((item) => item.status === "pending").length },
    { status: "approved", count: appointments.filter((item) => item.status === "approved").length },
    { status: "completed", count: appointments.filter((item) => item.status === "completed").length },
    { status: "rejected", count: appointments.filter((item) => item.status === "rejected").length },
    { status: "cancelled", count: appointments.filter((item) => item.status === "cancelled").length },
  ];

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 78px)",
        backgroundColor: "background.default",
        pb: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
        {/* Page introduction */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: { xs: "22px", md: "28px" },
            background:
              "linear-gradient(120deg, #E8F5EE 0%, #F7FBF8 57%, #FFF4EC 100%)",
            border: "1px solid #DDEBE3",
            mb: 4,
          }}
        >
          <EventAvailableRoundedIcon
            aria-hidden="true"
            sx={{
              position: "absolute",
              right: { xs: -32, md: 40 },
              top: -42,
              fontSize: { xs: 150, md: 220 },
              color: "rgba(47,125,109,0.065)",
              transform: "rotate(-12deg)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1, maxWidth: 660 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <PetsRoundedIcon sx={{ fontSize: 19, color: "primary.main" }} />
              <Typography
                variant="overline"
                sx={{
                  color: "primary.main",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                }}
              >
                SHELTER OPERATIONS
              </Typography>
            </Stack>

            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.15,
                color: "text.primary",
                fontSize: { xs: "2.1rem", sm: "2.7rem", md: "3.1rem" },
                mb: 2,
              }}
            >
              Manage{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                Appointments
              </Box>
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ maxWidth: 570, lineHeight: 1.8 }}
            >
              Review adoption and shelter visit requests, coordinate with
              adopters, and keep every appointment on track.
            </Typography>
          </Box>
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
            spacing={2}
            sx={{ minHeight: 330 }}
          >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading appointment requests...
            </Typography>
          </Stack>
        ) : (
          <>
            {/* Appointment status overview */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  sm: "repeat(3, minmax(0, 1fr))",
                  md: "repeat(5, minmax(0, 1fr))",
                },
                gap: 2,
                mb: 5,
              }}
            >
              {summary.map(({ status, count }) => {
                const style = getStatusStyle(status);

                return (
                  <Card
                    key={status}
                    sx={{
                      borderRadius: "18px",
                      border: "1px solid #E3EBE7",
                      boxShadow: "0 5px 18px rgba(39,81,62,0.04)",
                    }}
                  >
                    <CardContent
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        "&:last-child": { pb: { xs: 2, sm: 2.5 } },
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5, fontWeight: 600 }}
                          >
                            {style.label}
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{ fontWeight: 800, color: "text.primary" }}
                          >
                            {count}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: { xs: 36, sm: 42 },
                            height: { xs: 36, sm: 42 },
                            flexShrink: 0,
                            borderRadius: "13px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: style.background,
                            color: style.color,
                            "& svg": { fontSize: 22 },
                          }}
                        >
                          {style.icon}
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>

            {/* Section title */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1.5}
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Appointment Requests
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Review upcoming visits and manage their progress.
                </Typography>
              </Box>
              <Chip
                label={`${appointments.length} ${
                  appointments.length === 1 ? "appointment" : "appointments"
                }`}
                sx={{
                  backgroundColor: "#E6F3EC",
                  color: "#2F7D6D",
                  fontWeight: 750,
                }}
              />
            </Stack>

            <Grid container spacing={3} alignItems="stretch">
              {appointments.map((appointment) => {
                const pet = appointment.pet;
                const adopter = appointment.adopter;
                const style = getStatusStyle(appointment.status);
                const isUpdating = updatingId === appointment._id;

                return (
                  <Grid size={{ xs: 12, md: 6 }} key={appointment._id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "22px",
                        border: "1px solid #E2ECE6",
                        overflow: "hidden",
                        boxShadow: "0 7px 24px rgba(39,81,62,0.06)",
                        transition:
                          "transform 0.25s ease, box-shadow 0.25s ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 13px 30px rgba(39,81,62,0.10)",
                        },
                      }}
                    >
                      {/* Pet photo and status */}
                      <Box
                        sx={{
                          position: "relative",
                          height: 215,
                          overflow: "hidden",
                          backgroundColor: "#EAF4F0",
                        }}
                      >
                        {pet?.image ? (
                          <Box
                            component="img"
                            src={`/uploads/${pet.image}`}
                            alt={pet.name}
                            loading="lazy"
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Stack
                            alignItems="center"
                            justifyContent="center"
                            spacing={1}
                            sx={{ height: "100%" }}
                          >
                            <PetsRoundedIcon
                              sx={{ fontSize: 65, color: "#A3CBB9" }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              No Image Available
                            </Typography>
                          </Stack>
                        )}

                        <Chip
                          icon={style.icon}
                          label={style.label}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            height: 32,
                            px: 0.5,
                            fontWeight: 750,
                            backgroundColor: style.background,
                            color: style.color,
                            boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
                            "& .MuiChip-icon": {
                              color: "inherit",
                              fontSize: 17,
                            },
                          }}
                        />
                      </Box>

                      <CardContent
                        sx={{
                          p: { xs: 2.5, sm: 3 },
                          display: "flex",
                          flexDirection: "column",
                          flexGrow: 1,
                          "&:last-child": { pb: { xs: 2.5, sm: 3 } },
                        }}
                      >
                        <Typography
                          component="h2"
                          variant="h6"
                          sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}
                        >
                          {pet?.name || "Pet unavailable"}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2.5 }}
                        >
                          {formatVisitType(appointment.visitType)} appointment
                        </Typography>

                        {/* Date and time */}
                        <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                          <Grid size={{ xs: 6 }}>
                            <Box
                              sx={{
                                height: "100%",
                                p: 2,
                                backgroundColor: "#F7FAF9",
                                border: "1px solid #EAF0EC",
                                borderRadius: "14px",
                              }}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.7}
                                sx={{ mb: 0.8 }}
                              >
                                <CalendarMonthRoundedIcon
                                  sx={{ fontSize: 17, color: "primary.main" }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ fontWeight: 650 }}
                                >
                                  Visit Date
                                </Typography>
                              </Stack>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 800, color: "text.primary" }}
                              >
                                {formatDate(appointment.appointmentDate)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Box
                              sx={{
                                height: "100%",
                                p: 2,
                                backgroundColor: "#F7FAF9",
                                border: "1px solid #EAF0EC",
                                borderRadius: "14px",
                              }}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.7}
                                sx={{ mb: 0.8 }}
                              >
                                <AccessTimeRoundedIcon
                                  sx={{ fontSize: 17, color: "primary.main" }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ fontWeight: 650 }}
                                >
                                  Visit Time
                                </Typography>
                              </Stack>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 800, color: "text.primary" }}
                              >
                                {appointment.appointmentTime || "Not specified"}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {/* Appointment notes */}
                        {appointment.notes && (
                          <Box
                            sx={{
                              p: 2.25,
                              mb: 2.5,
                              backgroundColor: "#FFF9F4",
                              border: "1px solid #F2E7DC",
                              borderRadius: "14px",
                            }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={0.8}
                              sx={{ mb: 1 }}
                            >
                              <StickyNote2RoundedIcon
                                sx={{ fontSize: 19, color: "#CF816A" }}
                              />
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 800 }}
                              >
                                Appointment Notes
                              </Typography>
                            </Stack>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                            >
                              {appointment.notes}
                            </Typography>
                          </Box>
                        )}

                        {appointment.approvedBy && (
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 2.5, color: "text.secondary" }}
                          >
                            <CheckCircleRoundedIcon
                              sx={{ fontSize: 18, color: "primary.main" }}
                            />
                            <Typography variant="body2">
                              Approved by{" "}
                              <Box
                                component="span"
                                sx={{ fontWeight: 750, color: "text.primary" }}
                              >
                                {appointment.approvedBy.name}
                              </Box>
                            </Typography>
                          </Stack>
                        )}

                        <Divider sx={{ mb: 2.5 }} />

                        {/* Adopter details */}
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ mb: 1.8 }}
                        >
                          <Box
                            sx={{
                              width: 35,
                              height: 35,
                              borderRadius: "11px",
                              backgroundColor: "#E4F3EB",
                              color: "primary.main",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <PersonOutlineRoundedIcon sx={{ fontSize: 21 }} />
                          </Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 800, color: "text.primary" }}
                          >
                            Adopter Details
                          </Typography>
                        </Stack>

                        <Stack spacing={1.2} sx={{ mb: 2 }}>
                          <Stack direction="row" spacing={1.2} alignItems="flex-start">
                            <PersonOutlineRoundedIcon
                              sx={{ fontSize: 18, color: "#86A497", mt: 0.2 }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 650, color: "text.primary", overflowWrap: "anywhere" }}
                            >
                              {adopter?.name || "Unavailable"}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1.2} alignItems="flex-start">
                            <EmailOutlinedIcon
                              sx={{ fontSize: 18, color: "#86A497", mt: 0.2 }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ overflowWrap: "anywhere" }}
                            >
                              {adopter?.email || "Unavailable"}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1.2} alignItems="flex-start">
                            <PhoneOutlinedIcon
                              sx={{ fontSize: 18, color: "#86A497", mt: 0.2 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {adopter?.phone || "Unavailable"}
                            </Typography>
                          </Stack>
                        </Stack>

                        {/* Existing approval / rejection / completion / deletion workflow */}
                        <Box sx={{ mt: "auto", pt: 1.5 }}>
                          {appointment.status === "pending" && (
                            <Stack
                              direction={{ xs: "column", sm: "row" }}
                              spacing={1.5}
                            >
                              <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckRoundedIcon />}
                                fullWidth
                                disabled={isUpdating}
                                onClick={() =>
                                  handleStatusUpdate(appointment._id, "approved")
                                }
                                sx={{ py: 1.25, borderRadius: "11px", fontWeight: 750 }}
                              >
                                {isUpdating ? "Updating..." : "Approve"}
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<CloseRoundedIcon />}
                                fullWidth
                                disabled={isUpdating}
                                onClick={() =>
                                  handleStatusUpdate(appointment._id, "rejected")
                                }
                                sx={{ py: 1.25, borderRadius: "11px", fontWeight: 750 }}
                              >
                                {isUpdating ? "Updating..." : "Reject"}
                              </Button>
                            </Stack>
                          )}

                          {appointment.status === "approved" && (
                            <Stack spacing={1.7}>
                              <Alert
                                severity="success"
                                sx={{ border: "1px solid #D6EBDE" }}
                              >
                                This appointment has been approved.
                              </Alert>
                              <Button
                                variant="contained"
                                fullWidth
                                startIcon={<CheckCircleRoundedIcon />}
                                disabled={isUpdating}
                                onClick={() =>
                                  handleComplete(
                                    appointment._id,
                                    pet?.name || "this pet",
                                  )
                                }
                                sx={{ py: 1.25, borderRadius: "11px", fontWeight: 750 }}
                              >
                                {isUpdating ? "Updating..." : "Mark as Completed"}
                              </Button>
                            </Stack>
                          )}

                          {appointment.status === "rejected" && (
                            <Alert severity="error" sx={{ border: "1px solid #F4DAD9" }}>
                              This appointment request has been rejected.
                            </Alert>
                          )}

                          {appointment.status === "completed" && (
                            <Stack spacing={1.7}>
                              <Alert severity="info" sx={{ border: "1px solid #D5E8EF" }}>
                                This appointment has been completed.
                              </Alert>
                              <Button
                                variant="outlined"
                                color="error"
                                fullWidth
                                startIcon={<DeleteOutlineRoundedIcon />}
                                disabled={isUpdating}
                                onClick={() =>
                                  handleDeleteAppointment(
                                    appointment._id,
                                    pet?.name || "this pet",
                                  )
                                }
                                sx={{ py: 1.25, borderRadius: "11px", fontWeight: 750 }}
                              >
                                {isUpdating ? "Deleting..." : "Delete Appointment"}
                              </Button>
                            </Stack>
                          )}

                          {appointment.status === "cancelled" && (
                            <Alert severity="info" sx={{ border: "1px solid #D5E8EF" }}>
                              This appointment was cancelled by the adopter.
                            </Alert>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}

              {appointments.length === 0 && (
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      py: { xs: 7, md: 9 },
                      px: 3,
                      textAlign: "center",
                      backgroundColor: "#FFFFFF",
                      border: "1px dashed #C7DCD1",
                      borderRadius: "22px",
                    }}
                  >
                    <Box
                      sx={{
                        width: 82,
                        height: 82,
                        mx: "auto",
                        mb: 2.5,
                        borderRadius: "24px",
                        backgroundColor: "#E4F3EB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <EventAvailableRoundedIcon
                        sx={{ fontSize: 44, color: "primary.main" }}
                      />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
                      No appointments yet
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ maxWidth: 460, mx: "auto", lineHeight: 1.8 }}
                    >
                      Appointment requests from adopters will appear here when
                      they schedule adoption or shelter visits.
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default ManageAppointments;
