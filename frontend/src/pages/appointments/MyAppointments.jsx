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
  Divider,
} from "@mui/material";

import {
  requestAppointment,
  getMyAppointments,
  cancelAppointment,
} from "../../services/appointmentService";

import { getMyApplications } from "../../services/adoptionService";

import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import StickyNote2RoundedIcon from "@mui/icons-material/StickyNote2Rounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

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

  const summary = [
    {
      label: "Pending",
      count: appointments.filter((item) => item.status === "pending").length,
      icon: <HourglassTopRoundedIcon />,
      background: "#FFF2E1",
      color: "#A8742B",
    },
    {
      label: "Approved",
      count: appointments.filter((item) => item.status === "approved").length,
      icon: <CheckCircleRoundedIcon />,
      background: "#E2F3E9",
      color: "#2F7D6D",
    },
    {
      label: "Completed",
      count: appointments.filter((item) => item.status === "completed").length,
      icon: <FavoriteRoundedIcon />,
      background: "#E4F1F6",
      color: "#4085A3",
    },
    {
      label: "Cancelled / Rejected",
      count: appointments.filter((item) =>
        ["cancelled", "rejected"].includes(item.status),
      ).length,
      icon: <CancelRoundedIcon />,
      background: "#FCEAE7",
      color: "#C66A5C",
    },
  ];

  const statusMessage = {
    pending: "Your appointment request is waiting for approval from PawBuddy staff.",
    approved: "Your appointment has been approved. Please attend at the scheduled date and time.",
    rejected: "This appointment request was rejected.",
    completed: "This appointment has been completed.",
    cancelled: "This appointment was cancelled.",
  };

  const statusIcon = {
    pending: <HourglassTopRoundedIcon />,
    approved: <CheckCircleRoundedIcon />,
    rejected: <CancelRoundedIcon />,
    completed: <FavoriteRoundedIcon />,
    cancelled: <CancelRoundedIcon />,
  };

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
            mb: 4,
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: { xs: "22px", md: "28px" },
            background:
              "linear-gradient(120deg, #E8F5EE 0%, #F7FBF8 57%, #FFF4EB 100%)",
            border: "1px solid #DFEBE3",
          }}
        >
          <CalendarMonthRoundedIcon
            aria-hidden="true"
            sx={{
              position: "absolute",
              right: { xs: -35, md: 35 },
              top: -50,
              fontSize: { xs: 165, md: 220 },
              transform: "rotate(-15deg)",
              color: "rgba(47,125,109,0.06)",
              pointerEvents: "none",
            }}
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
            spacing={3}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box sx={{ maxWidth: 620 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <PetsRoundedIcon sx={{ color: "primary.main", fontSize: 19 }} />
                <Typography
                  variant="overline"
                  sx={{ color: "primary.main", fontWeight: 800, letterSpacing: "0.12em" }}
                >
                  YOUR ADOPTION JOURNEY
                </Typography>
              </Stack>

              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: "2.1rem", sm: "2.7rem", md: "3.1rem" },
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.15,
                  mb: 2,
                }}
              >
                My <Box component="span" sx={{ color: "primary.main" }}>Appointments</Box>
              </Typography>

              <Typography color="text.secondary" sx={{ maxWidth: 530, lineHeight: 1.8 }}>
                Plan your shelter visits, track appointment approvals, and stay
                connected throughout your pet adoption journey.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={handleOpen}
              disabled={approvedApplications.length === 0}
              sx={{
                py: 1.4,
                px: 2.5,
                flexShrink: 0,
                alignSelf: { xs: "stretch", sm: "center" },
                borderRadius: "12px",
              }}
            >
              Request Appointment
            </Button>
          </Stack>
        </Box>

        {!loading && approvedApplications.length === 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You need an approved adoption application before you can request an appointment.
          </Alert>
        )}

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        {loading ? (
          <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ minHeight: 320 }}>
            <CircularProgress />
            <Typography color="text.secondary" variant="body2">
              Loading your appointments...
            </Typography>
          </Stack>
        ) : (
          <>
            {/* Appointment status overview */}
            <Grid container spacing={2} sx={{ mb: 5 }}>
              {summary.map((item) => (
                <Grid key={item.label} size={{ xs: 6, md: 3 }}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "18px",
                      border: "1px solid #E3EBE7",
                      boxShadow: "0 5px 18px rgba(39,81,62,0.04)",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 }, "&:last-child": { pb: { xs: 2, sm: 2.5 } } }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5, fontWeight: 600, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                          >
                            {item.label}
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 800 }}>
                            {item.count}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: { xs: 38, sm: 46 },
                            height: { xs: 38, sm: 46 },
                            borderRadius: "14px",
                            flexShrink: 0,
                            backgroundColor: item.background,
                            color: item.color,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {item.icon}
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Appointment list heading */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Scheduled Visits
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View the status and details of your appointment requests.
                </Typography>
              </Box>
              <Chip
                label={`${appointments.length} ${appointments.length === 1 ? "appointment" : "appointments"}`}
                sx={{ backgroundColor: "#E5F3EC", color: "#2F7D6D", fontWeight: 750 }}
              />
            </Stack>

            <Grid container spacing={3}>
              {appointments.map((appointment) => (
                <Grid size={{ xs: 12, md: 6 }} key={appointment._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "22px",
                      overflow: "hidden",
                      border: "1px solid #E2ECE6",
                      boxShadow: "0 7px 24px rgba(39,81,62,0.05)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 13px 30px rgba(39,81,62,0.10)",
                      },
                    }}
                  >
                    {/* Pet header */}
                    <Box
                      sx={{
                        p: { xs: 2.5, sm: 3 },
                        background: "linear-gradient(115deg, #EEF8F2 0%, #FFF8F1 100%)",
                        borderBottom: "1px solid #E4EEE7",
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                          <Box
                            sx={{
                              width: 52,
                              height: 52,
                              flexShrink: 0,
                              borderRadius: "16px",
                              backgroundColor: "#DBEFE4",
                              color: "primary.main",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <PetsRoundedIcon sx={{ fontSize: 28 }} />
                          </Box>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="h6" noWrap sx={{ fontWeight: 800, color: "text.primary" }}>
                              {appointment.pet?.name || "Pet unavailable"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {appointment.visitType === "site visit" ? "Site Visit" : "Adoption Visit"}
                            </Typography>
                          </Box>
                        </Stack>
                        <Chip
                          label={appointment.status}
                          icon={statusIcon[appointment.status]}
                          color={getStatusColor(appointment.status)}
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: 750,
                            height: 30,
                            flexShrink: 0,
                            "& .MuiChip-icon": { fontSize: 17 },
                          }}
                        />
                      </Stack>
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
                      {/* Date and time */}
                      <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                        <Grid size={{ xs: 6 }}>
                          <Box sx={{ height: "100%", p: 2, border: "1px solid #E6EFE9", backgroundColor: "#F7FAF9", borderRadius: "14px" }}>
                            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
                              <CalendarMonthRoundedIcon sx={{ fontSize: 17, color: "primary.main" }} />
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 650 }}>
                                Visit Date
                              </Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ fontWeight: 800, overflowWrap: "anywhere" }}>
                              {formatDate(appointment.appointmentDate)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Box sx={{ height: "100%", p: 2, border: "1px solid #E6EFE9", backgroundColor: "#F7FAF9", borderRadius: "14px" }}>
                            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
                              <AccessTimeRoundedIcon sx={{ fontSize: 17, color: "primary.main" }} />
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 650 }}>
                                Visit Time
                              </Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>
                              {appointment.appointmentTime}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {appointment.notes && (
                        <Box
                          sx={{
                            p: 2,
                            mb: 2.5,
                            borderRadius: "14px",
                            backgroundColor: "#F6F9F7",
                            border: "1px solid #E7EFEA",
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.8 }}>
                            <StickyNote2RoundedIcon sx={{ fontSize: 19, color: "primary.main" }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                              Your Notes
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                            {appointment.notes}
                          </Typography>
                        </Box>
                      )}

                      {appointment.approvedBy && (
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
                          <PersonOutlineRoundedIcon sx={{ fontSize: 18, color: "#739487" }} />
                          <Typography variant="body2" color="text.secondary">
                            Approved by <Box component="span" sx={{ fontWeight: 750, color: "text.primary" }}>{appointment.approvedBy.name}</Box>
                          </Typography>
                        </Stack>
                      )}

                      <Box sx={{ mt: "auto" }}>
                        <Alert
                          severity={
                            appointment.status === "approved"
                              ? "success"
                              : appointment.status === "rejected"
                                ? "error"
                                : appointment.status === "pending"
                                  ? "warning"
                                  : "info"
                          }
                          sx={{ borderRadius: "13px", mb: appointment.status === "pending" ? 2 : 0 }}
                        >
                          {statusMessage[appointment.status] || "Track your appointment status here."}
                        </Alert>

                        {appointment.status === "pending" && (
                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={() => handleCancel(appointment._id)}
                            sx={{ py: 1.2, borderRadius: "11px", fontWeight: 750 }}
                          >
                            Cancel Appointment
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              {appointments.length === 0 && (
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      textAlign: "center",
                      backgroundColor: "#FFFFFF",
                      border: "1px dashed #C7DCD1",
                      borderRadius: "22px",
                      px: 3,
                      py: { xs: 7, md: 9 },
                    }}
                  >
                    <Box
                      sx={{
                        width: 82,
                        height: 82,
                        borderRadius: "24px",
                        backgroundColor: "#E4F3EB",
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2.5,
                      }}
                    >
                      <EventAvailableRoundedIcon sx={{ fontSize: 43 }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                      No appointments yet
                    </Typography>
                    <Typography color="text.secondary" sx={{ maxWidth: 410, mx: "auto", lineHeight: 1.8, mb: 3 }}>
                      Your visit requests will appear here once you schedule an appointment for an approved adoption.
                    </Typography>
                    {approvedApplications.length > 0 && (
                      <Button variant="contained" onClick={handleOpen} endIcon={<ArrowForwardRoundedIcon />} sx={{ px: 3, py: 1.2 }}>
                        Request Your First Appointment
                      </Button>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          </>
        )}

        {/* Request appointment dialog: preserve existing form fields and values */}
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
          slotProps={{ paper: { sx: { borderRadius: "22px", overflow: "hidden" } } }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Box
              sx={{
                background: "linear-gradient(115deg, #E8F5EE 0%, #FFF4EC 100%)",
                p: { xs: 3, sm: 4 },
                pb: 3,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ width: 48, height: 48, borderRadius: "15px", backgroundColor: "#DDEFE5", color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CalendarMonthRoundedIcon sx={{ fontSize: 26 }} />
                </Box>
                <Box>
                  <DialogTitle sx={{ p: 0, fontWeight: 800, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                    Request Appointment
                  </DialogTitle>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Plan a visit for an approved adoption
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <DialogContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack spacing={2.5} sx={{ mt: 0.5 }}>
                <TextField
                  select
                  label="Approved Adoption"
                  name="adoptionId"
                  value={formData.adoptionId}
                  onChange={handleChange}
                  required
                  fullWidth
                >
                  {approvedApplications.map((application) => (
                    <MenuItem key={application._id} value={application._id}>
                      {application.pet?.name || "Unknown Pet"}
                    </MenuItem>
                  ))}
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
                  <MenuItem value="adoption">Adoption Visit</MenuItem>
                  <MenuItem value="site visit">Site Visit</MenuItem>
                </TextField>

                <Box>
                  <Typography variant="body2" sx={{ mb: 0.8, fontWeight: 700, color: "text.secondary" }}>
                    Appointment Date *
                  </Typography>
                  <TextField
                    name="appointmentDate"
                    type="date"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    inputProps={{ min: getTodayDate() }}
                    required
                    fullWidth
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 0.8, fontWeight: 700, color: "text.secondary" }}>
                    Appointment Time *
                  </Typography>
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        select
                        label="Hour"
                        name="appointmentHour"
                        value={formData.appointmentHour}
                        onChange={handleChange}
                        required
                        fullWidth
                      >
                        {hours.map((hour) => (
                          <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        select
                        label="Minute"
                        name="appointmentMinute"
                        value={formData.appointmentMinute}
                        onChange={handleChange}
                        required
                        fullWidth
                      >
                        {minutes.map((minute) => (
                          <MenuItem key={minute} value={minute}>{minute}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        select
                        label="AM / PM"
                        name="appointmentPeriod"
                        value={formData.appointmentPeriod}
                        onChange={handleChange}
                        required
                        fullWidth
                      >
                        <MenuItem value="AM">AM</MenuItem>
                        <MenuItem value="PM">PM</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ borderColor: "#E6EEE9" }} />

                <TextField
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  inputProps={{ maxLength: 500 }}
                  helperText={`${formData.notes.length}/500 characters`}
                  fullWidth
                />
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px: { xs: 3, sm: 4 }, pb: { xs: 3, sm: 4 }, pt: 0, gap: 1 }}>
              <Button onClick={handleClose} color="inherit" disabled={submitting} sx={{ px: 2.5 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={submitting} sx={{ py: 1.2, px: 3, borderRadius: "12px" }}>
                {submitting ? "Submitting..." : "Request Appointment"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyAppointments;
