import React, { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";

import {
  createComplaint,
  getMyComplaints,
  deleteOwnComplaint,
} from "../../services/complaintService";

const initialFormData = {
  subject: "",
  category: "",
  message: "",
};

const categoryLabels = {
  adoption: "Adoption",
  appointment: "Appointment",
  payment: "Payment",
  "pet information": "Pet Information",
  other: "Other",
};

const formatCategory = (category) =>
  categoryLabels[category] || category || "Other";

const formatDate = (date) => {
  if (!date) {
    return "Date unavailable";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyComplaints();
      setComplaints(data.complaints || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load your feedback.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const data = await createComplaint(formData);

      setFormData({ ...initialFormData });
      await fetchComplaints();

      setSuccess(
        data.message || "Feedback submitted successfully.",
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to submit feedback.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (complaintId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this feedback?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(complaintId);
      setError("");
      setSuccess("");

      const data = await deleteOwnComplaint(complaintId);

      setComplaints((currentComplaints) =>
        currentComplaints.filter(
          (complaint) => complaint._id !== complaintId,
        ),
      );

      setSuccess(
        data.message || "Feedback deleted successfully.",
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete feedback.",
      );
    } finally {
      setDeletingId(null);
    }
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
        {/* Page Header */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: { xs: "22px", md: "28px" },
            background:
              "linear-gradient(120deg, #E8F5EE 0%, #F7FBF8 58%, #FFF4EC 100%)",
            border: "1px solid #DDEBE3",
            mb: 4,
          }}
        >
          <ForumRoundedIcon
            aria-hidden="true"
            sx={{
              position: "absolute",
              right: { xs: -35, md: 35 },
              top: { xs: -45, md: -55 },
              fontSize: { xs: 160, md: 225 },
              color: "rgba(47,125,109,0.065)",
              transform: "rotate(-15deg)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <FavoriteRoundedIcon
                sx={{ color: "secondary.main", fontSize: 19 }}
              />
              <Typography
                variant="overline"
                sx={{
                  color: "primary.main",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                }}
              >
                WE'D LOVE TO HEAR FROM YOU
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
              Your voice{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                matters.
              </Box>
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ lineHeight: 1.8, maxWidth: 550 }}
            >
              Share your experience, suggest an improvement, or report
              an issue. Your feedback helps us make PawBuddy better for
              every pet and adopter.
            </Typography>
          </Box>
        </Box>

        {/* Feedback Messages */}
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

        <Grid container spacing={3} alignItems="flex-start">
          {/* Feedback Form */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              sx={{
                borderRadius: "22px",
                border: "1px solid #E2ECE6",
                boxShadow: "0 7px 24px rgba(39,81,62,0.06)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: { xs: 2.5, sm: 3 },
                  py: 2.7,
                  background:
                    "linear-gradient(110deg, #F0F8F3 0%, #FFF8F3 100%)",
                  borderBottom: "1px solid #E6EDE7",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#DDEFE5",
                      color: "primary.main",
                      flexShrink: 0,
                    }}
                  >
                    <EditNoteRoundedIcon sx={{ fontSize: 25 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, color: "text.primary" }}
                    >
                      Submit Feedback
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tell us what you think.
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <CardContent
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  "&:last-child": { pb: { xs: 2.5, sm: 3 } },
                }}
              >
                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2.6}>
                    <TextField
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      fullWidth
                      required
                      inputProps={{ maxLength: 150 }}
                      placeholder="A short summary of your feedback"
                    />

                    <TextField
                      select
                      label="Category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      fullWidth
                      required
                    >
                      <MenuItem value="adoption">Adoption</MenuItem>
                      <MenuItem value="appointment">Appointment</MenuItem>
                      <MenuItem value="payment">Payment</MenuItem>
                      <MenuItem value="pet information">
                        Pet Information
                      </MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </TextField>

                    <TextField
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      multiline
                      minRows={5}
                      fullWidth
                      required
                      inputProps={{ maxLength: 1000 }}
                      placeholder="Share the details of your feedback or issue..."
                      helperText={`${formData.message.length}/1000 characters`}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={submitting}
                      endIcon={
                        submitting ? undefined : <SendRoundedIcon />
                      }
                      sx={{ py: 1.4, borderRadius: "12px", fontWeight: 800 }}
                    >
                      {submitting ? "Submitting..." : "Submit Feedback"}
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>

            <Box
              sx={{
                mt: 2.5,
                p: 2.5,
                borderRadius: "17px",
                backgroundColor: "#EAF5EF",
                border: "1px solid #D9EADF",
              }}
            >
              <Stack direction="row" spacing={1.3} alignItems="flex-start">
                <FavoriteRoundedIcon
                  sx={{ color: "primary.main", fontSize: 22, mt: 0.15 }}
                />
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 800, mb: 0.5 }}
                  >
                    Thank you for helping PawBuddy grow
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.75 }}
                  >
                    Your feedback is shared with the PawBuddy administrators.
                    You can view or delete your submissions at any time.
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Submitted Feedback */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1.5}
              sx={{ mb: 2.5 }}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, mb: 0.5, color: "text.primary" }}
                >
                  My Feedback
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  A record of everything you've shared.
                </Typography>
              </Box>

              {!loading && (
                <Chip
                  icon={<ChatBubbleOutlineRoundedIcon />}
                  label={`${complaints.length} ${
                    complaints.length === 1 ? "submission" : "submissions"
                  }`}
                  sx={{
                    backgroundColor: "#E5F3EC",
                    color: "#2F7D6D",
                    fontWeight: 750,
                    "& .MuiChip-icon": { color: "inherit" },
                  }}
                />
              )}
            </Stack>

            {loading ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                spacing={2}
                sx={{ minHeight: 250 }}
              >
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                  Loading your feedback...
                </Typography>
              </Stack>
            ) : complaints.length === 0 ? (
              <Box
                sx={{
                  p: { xs: 3, sm: 5 },
                  minHeight: 270,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "22px",
                  border: "1px dashed #C7DCD1",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "22px",
                    backgroundColor: "#E6F3EC",
                    color: "primary.main",
                    mb: 2,
                  }}
                >
                  <ForumRoundedIcon sx={{ fontSize: 37 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  No feedback submitted yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.8, maxWidth: 330 }}
                >
                  When you share your first suggestion or issue, it will
                  appear here.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2.5}>
                {complaints.map((complaint) => (
                  <Card
                    key={complaint._id}
                    sx={{
                      borderRadius: "20px",
                      border: "1px solid #E2ECE6",
                      boxShadow: "0 5px 20px rgba(39,81,62,0.045)",
                      transition: "box-shadow 0.2s ease",
                      "&:hover": {
                        boxShadow: "0 11px 28px rgba(39,81,62,0.09)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: { xs: 2.5, sm: 3 },
                        "&:last-child": { pb: { xs: 2.5, sm: 3 } },
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                        spacing={1.5}
                        sx={{ mb: 2 }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ minWidth: 0 }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 35,
                              height: 35,
                              borderRadius: "11px",
                              backgroundColor: "#EAF5EF",
                              color: "primary.main",
                              flexShrink: 0,
                            }}
                          >
                            <AssignmentTurnedInRoundedIcon fontSize="small" />
                          </Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 800,
                              color: "text.primary",
                              overflowWrap: "anywhere",
                              fontSize: "1.08rem",
                            }}
                          >
                            {complaint.subject}
                          </Typography>
                        </Stack>

                        <Chip
                          label={formatCategory(complaint.category)}
                          size="small"
                          sx={{
                            fontWeight: 750,
                            backgroundColor: "#FFF0E9",
                            color: "#BB7057",
                            flexShrink: 0,
                          }}
                        />
                      </Stack>

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.7}
                        sx={{ mb: 2.5, color: "text.secondary" }}
                      >
                        <CalendarMonthRoundedIcon sx={{ fontSize: 17 }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          Submitted on {formatDate(complaint.createdAt)}
                        </Typography>
                      </Stack>

                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: "14px",
                          backgroundColor: "#F7FAF9",
                          border: "1px solid #E8F0EA",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.primary",
                            lineHeight: 1.85,
                            whiteSpace: "pre-wrap",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {complaint.message}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2.5 }} />

                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteOutlineRoundedIcon />}
                          disabled={deletingId === complaint._id}
                          onClick={() => handleDelete(complaint._id)}
                          sx={{ borderRadius: "11px", fontWeight: 750 }}
                        >
                          {deletingId === complaint._id
                            ? "Deleting..."
                            : "Delete Feedback"}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MyComplaints;
