import React, { useEffect, useState } from "react";

import {
  Alert,
  Avatar,
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

import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import {
  getAllComplaints,
  deleteComplaintByAdmin,
} from "../../services/complaintService";

const categories = [
  { value: "", label: "All Categories" },
  { value: "adoption", label: "Adoption" },
  { value: "appointment", label: "Appointment" },
  { value: "payment", label: "Payment" },
  { value: "pet information", label: "Pet Information" },
  { value: "other", label: "Other" },
];

const categoryAppearance = {
  adoption: { background: "#E4F3EA", color: "#2F7D6D" },
  appointment: { background: "#E6F1F7", color: "#377D99" },
  payment: { background: "#FFF0E2", color: "#A8732F" },
  "pet information": { background: "#FBE9E5", color: "#BD695C" },
  other: { background: "#EFF2F1", color: "#60746D" },
};

const formatCategory = (category) =>
  categories.find((item) => item.value === category)?.label ||
  category ||
  "Other";

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const filters = {};
      if (categoryFilter) {
        filters.category = categoryFilter;
      }

      const data = await getAllComplaints(filters);
      setComplaints(data.complaints || []);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load feedback.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [categoryFilter]);

  const handleClear = async (complaintId) => {
    const confirmed = window.confirm(
      "Are you sure you want to clear this feedback?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(complaintId);
      setError("");
      setSuccess("");

      const data = await deleteComplaintByAdmin(complaintId);

      setComplaints((currentComplaints) =>
        currentComplaints.filter(
          (complaint) => complaint._id !== complaintId,
        ),
      );

      setSuccess(data.message || "Feedback cleared successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to clear feedback.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const activeCategoryLabel = categoryFilter
    ? formatCategory(categoryFilter)
    : "All categories";

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
              "linear-gradient(120deg, #E8F5EE 0%, #F7FBF8 58%, #FFF4EC 100%)",
            border: "1px solid #DDEBE3",
          }}
        >
          <ForumRoundedIcon
            aria-hidden="true"
            sx={{
              position: "absolute",
              right: { xs: -35, md: 35 },
              top: { xs: -40, md: -55 },
              fontSize: { xs: 160, md: 225 },
              color: "rgba(47, 125, 109, 0.065)",
              transform: "rotate(-15deg)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <ChatBubbleOutlineRoundedIcon
                sx={{ color: "primary.main", fontSize: 19 }}
              />
              <Typography
                variant="overline"
                sx={{
                  color: "primary.main",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                }}
              >
                ADMIN WORKSPACE
              </Typography>
            </Stack>

            <Typography
              component="h1"
              sx={{
                mb: 2,
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.15,
                fontSize: { xs: "2.1rem", sm: "2.7rem", md: "3.1rem" },
                color: "text.primary",
              }}
            >
              Manage{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                Feedback
              </Box>
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ maxWidth: 550, lineHeight: 1.8 }}
            >
              Review feedback shared by adopters, find entries by category,
              and keep the feedback list organized.
            </Typography>
          </Box>
        </Box>

        {/* Alerts */}
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

        {/* Filter panel */}
        <Card
          sx={{
            mb: 4,
            borderRadius: "20px",
            border: "1px solid #E3EBE7",
            boxShadow: "0 8px 28px rgba(36, 79, 62, 0.055)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 2.5 }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                    backgroundColor: "#E6F3EC",
                    color: "primary.main",
                  }}
                >
                  <TuneRoundedIcon sx={{ fontSize: 21 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: "text.primary" }}>
                    Filter feedback
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    View submissions from a specific category
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="text"
                startIcon={<RefreshRoundedIcon />}
                disabled={loading}
                onClick={fetchComplaints}
                sx={{ fontWeight: 700 }}
              >
                Refresh
              </Button>
            </Stack>

            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 7, md: 5 }}>
                <TextField
                  select
                  label="Category"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  fullWidth
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 5, md: 7 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent={{ xs: "flex-start", sm: "flex-end" }}
                >
                  <Chip
                    icon={<ForumRoundedIcon />}
                    label={
                      loading
                        ? "Loading feedback..."
                        : `${complaints.length} ${
                            complaints.length === 1 ? "entry" : "entries"
                          }`
                    }
                    sx={{
                      height: 36,
                      bgcolor: "#E7F3ED",
                      color: "#2F7D6D",
                      fontWeight: 750,
                      "& .MuiChip-icon": { color: "inherit" },
                    }}
                  />
                  {categoryFilter && (
                    <Button
                      size="small"
                      onClick={() => setCategoryFilter("")}
                      sx={{ fontWeight: 700 }}
                    >
                      Clear filter
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Results heading */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 2.5 }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              Feedback submissions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {categoryFilter
                ? `Showing feedback in ${activeCategoryLabel}.`
                : "Feedback submitted across all categories."}
            </Typography>
          </Box>
        </Stack>

        {loading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ minHeight: 290 }}
          >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading adopter feedback...
            </Typography>
          </Stack>
        ) : complaints.length === 0 ? (
          <Box
            sx={{
              py: { xs: 7, md: 9 },
              px: 3,
              textAlign: "center",
              borderRadius: "22px",
              backgroundColor: "#FFFFFF",
              border: "1px dashed #C7DCD1",
            }}
          >
            <Box
              sx={{
                width: 82,
                height: 82,
                mx: "auto",
                mb: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "24px",
                backgroundColor: "#E4F3EB",
              }}
            >
              <InboxRoundedIcon sx={{ color: "primary.main", fontSize: 42 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              No feedback found
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 430, mx: "auto", lineHeight: 1.8 }}
            >
              {categoryFilter
                ? "No feedback matches this category. Try choosing a different category."
                : "Feedback from adopters will appear here once submitted."}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {complaints.map((complaint) => {
              const appearance =
                categoryAppearance[complaint.category] ||
                categoryAppearance.other;

              const adopterName = complaint.user?.name || "Unavailable";
              const adopterInitial =
                complaint.user?.name?.trim()?.charAt(0)?.toUpperCase() || "?";

              return (
                <Grid key={complaint._id} size={{ xs: 12, md: 6 }}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      overflow: "hidden",
                      borderRadius: "22px",
                      border: "1px solid #E2ECE6",
                      boxShadow: "0 6px 22px rgba(39,81,62,0.05)",
                      transition: "box-shadow 0.22s ease, transform 0.22s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 13px 28px rgba(39,81,62,0.1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 5,
                        bgcolor: appearance.color,
                        opacity: 0.75,
                      }}
                    />
                    <CardContent
                      sx={{
                        p: { xs: 2.5, sm: 3 },
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                        "&:last-child": { pb: { xs: 2.5, sm: 3 } },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                        justifyContent="space-between"
                        sx={{ mb: 2 }}
                      >
                        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                          <Typography
                            component="h2"
                            variant="h6"
                            sx={{
                              fontWeight: 800,
                              lineHeight: 1.4,
                              overflowWrap: "anywhere",
                              mb: 0.75,
                            }}
                          >
                            {complaint.subject}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={0.6}>
                            <CalendarMonthRoundedIcon
                              sx={{ fontSize: 16, color: "text.secondary" }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              Submitted {formatDate(complaint.createdAt)}
                            </Typography>
                          </Stack>
                        </Box>
                        <Chip
                          label={formatCategory(complaint.category)}
                          size="small"
                          sx={{
                            flexShrink: 0,
                            bgcolor: appearance.background,
                            color: appearance.color,
                            fontWeight: 750,
                            maxWidth: { xs: 125, sm: 150 },
                          }}
                        />
                      </Stack>

                      {/* Adopter details */}
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: "15px",
                          backgroundColor: "#F6FAF7",
                          border: "1px solid #E6EEE8",
                          mb: 2.5,
                        }}
                      >
                        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 39,
                              height: 39,
                              bgcolor: "#DCEEE4",
                              color: "primary.main",
                              fontSize: "0.95rem",
                              fontWeight: 800,
                            }}
                          >
                            {adopterInitial}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", lineHeight: 1.3 }}
                            >
                              Submitted by
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 800, overflowWrap: "anywhere" }}
                            >
                              {adopterName}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack spacing={1}>
                          <Stack direction="row" spacing={1} alignItems="flex-start">
                            <EmailOutlinedIcon
                              sx={{ fontSize: 17, color: "#84988C", mt: 0.2 }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ overflowWrap: "anywhere" }}
                            >
                              {complaint.user?.email || "Unavailable"}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="flex-start">
                            <PhoneOutlinedIcon
                              sx={{ fontSize: 17, color: "#84988C", mt: 0.2 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {complaint.user?.phone || "Unavailable"}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>

                      {/* Feedback message */}
                      <Box sx={{ mb: 2.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.2 }}>
                          <PersonOutlineRoundedIcon
                            sx={{ fontSize: 19, color: "primary.main" }}
                          />
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 800, color: "text.primary" }}
                          >
                            Feedback message
                          </Typography>
                        </Stack>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            lineHeight: 1.85,
                            overflowWrap: "anywhere",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {complaint.message}
                        </Typography>
                      </Box>

                      <Divider sx={{ mt: "auto", mb: 2 }} />

                      {/* Admin action: same delete endpoint */}
                      <Stack direction="row" justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteOutlineRoundedIcon />}
                          disabled={deletingId === complaint._id}
                          onClick={() => handleClear(complaint._id)}
                          sx={{ borderRadius: "11px", fontWeight: 750, px: 2.2 }}
                        >
                          {deletingId === complaint._id
                            ? "Clearing..."
                            : "Clear Feedback"}
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ManageComplaints;
