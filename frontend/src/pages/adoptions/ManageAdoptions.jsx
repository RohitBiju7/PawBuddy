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
  TextField,
  Avatar,
} from "@mui/material";

import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import StickyNote2RoundedIcon from "@mui/icons-material/StickyNote2Rounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

import {
  getAllApplications,
  updateApplicationStatus,
  completeAdoption,
  updateStaffNotes,
} from "../../services/adoptionService";

import { getAdoptionPaymentStatusForStaff } from "../../services/paymentService";

const statusDesign = {
  pending: {
    label: "Pending",
    color: "#99651E",
    background: "#FFF0DC",
    icon: <HourglassTopRoundedIcon />,
  },
  approved: {
    label: "Approved",
    color: "#246A52",
    background: "#DFF2E6",
    icon: <CheckCircleRoundedIcon />,
  },
  rejected: {
    label: "Rejected",
    color: "#B95656",
    background: "#FBE9E7",
    icon: <CancelRoundedIcon />,
  },
  completed: {
    label: "Completed",
    color: "#367F98",
    background: "#E3F0F6",
    icon: <FavoriteRoundedIcon />,
  },
};

const ManageAdoptions = () => {
  const [applications, setApplications] = useState([]);
  const [paymentStatuses, setPaymentStatuses] = useState({});
  const [staffNotes, setStaffNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [savingNotesId, setSavingNotesId] = useState(null);
  const [editingNotesId, setEditingNotesId] = useState(null);

  const fetchPaymentStatus = async (applicationId) => {
    try {
      const data = await getAdoptionPaymentStatusForStaff(applicationId);
      setPaymentStatuses((current) => ({
        ...current,
        [applicationId]: data,
      }));
    } catch (error) {
      console.error("Failed to load adoption payment status:", error);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllApplications();
      const applicationList = data.applications || [];
      setApplications(applicationList);

      const initialNotes = {};
      applicationList.forEach((application) => {
        initialNotes[application._id] = application.staffNotes || "";
      });
      setStaffNotes(initialNotes);

      const paymentRelevantApplications = applicationList.filter(
        (application) =>
          application.pet &&
          ["approved", "completed"].includes(application.status),
      );

      await Promise.all(
        paymentRelevantApplications.map((application) =>
          fetchPaymentStatus(application._id),
        ),
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load adoption applications.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getPetStatusLabel = (status) => {
    if (status === "pending") return "Reserved";
    if (!status) return "Unavailable";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleNotesChange = (applicationId, value) => {
    setStaffNotes((current) => ({
      ...current,
      [applicationId]: value,
    }));
  };

  const handleSaveNotes = async (applicationId) => {
    if (editingNotesId !== applicationId) {
      setEditingNotesId(applicationId);
      return;
    }

    try {
      setSavingNotesId(applicationId);
      setError("");
      setSuccess("");

      const data = await updateStaffNotes(
        applicationId,
        staffNotes[applicationId] || "",
      );

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                staffNotes: data.adoption?.staffNotes || "",
              }
            : application,
        ),
      );

      setEditingNotesId(null);
      setSuccess(data.message || "Staff notes updated successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update staff notes.",
      );
    } finally {
      setSavingNotesId(null);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    const action = status === "approved" ? "approve" : "reject";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this adoption application?`,
    );

    if (!confirmed) return;

    try {
      setUpdatingId(applicationId);
      setError("");
      setSuccess("");

      const data = await updateApplicationStatus(applicationId, status);

      // Approving one application may reject other applications.
      await fetchApplications();
      setSuccess(
        data.message || `Adoption application ${status} successfully.`,
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update adoption application.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCompleteAdoption = async (applicationId, petName) => {
    const confirmed = window.confirm(
      `Has ${petName} been adopted by the approved adopter in person?`,
    );

    if (!confirmed) return;

    try {
      setUpdatingId(applicationId);
      setError("");
      setSuccess("");

      const data = await completeAdoption(applicationId);
      await fetchApplications();
      setSuccess(data.message || "Adoption completed successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to complete the adoption.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const summary = ["pending", "approved", "completed", "rejected"].map(
    (status) => ({
      status,
      count: applications.filter((item) => item.status === status).length,
      ...statusDesign[status],
    }),
  );

  const detailTile = {
    height: "100%",
    p: 1.7,
    borderRadius: "13px",
    backgroundColor: "#F7FAF9",
    border: "1px solid #E8F0EA",
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
            p: { xs: 3, sm: 4, md: 5 },
            mb: 4,
            borderRadius: { xs: "22px", md: "28px" },
            background:
              "linear-gradient(120deg, #E8F5EE 0%, #F7FAF8 58%, #FFF3EC 100%)",
            border: "1px solid #DFEBE3",
          }}
        >
          <AssignmentRoundedIcon
            aria-hidden="true"
            sx={{
              position: "absolute",
              top: -50,
              right: { xs: -40, md: 35 },
              fontSize: { xs: 165, md: 220 },
              color: "rgba(47,125,109,0.065)",
              transform: "rotate(-13deg)",
              pointerEvents: "none",
            }}
          />
          <Box sx={{ position: "relative", maxWidth: 680 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <PetsRoundedIcon sx={{ fontSize: 19, color: "primary.main" }} />
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  color: "primary.main",
                }}
              >
                SHELTER WORKSPACE
              </Typography>
            </Stack>
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.15,
                fontSize: { xs: "2.1rem", sm: "2.7rem", md: "3.15rem" },
                color: "text.primary",
                mb: 2,
              }}
            >
              Manage <Box component="span" sx={{ color: "primary.main" }}>Adoptions</Box>
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Review applications, maintain internal notes, verify payment
              status, and help every approved pet reach their forever home.
            </Typography>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        {loading ? (
          <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ minHeight: 320 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading adoption applications...
            </Typography>
          </Stack>
        ) : (
          <>
            {/* Overview */}
            <Grid container spacing={2} sx={{ mb: 5 }}>
              {summary.map((item) => (
                <Grid key={item.status} size={{ xs: 6, md: 3 }}>
                  <Card sx={{ borderRadius: "18px", height: "100%" }}>
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 }, "&:last-child": { pb: { xs: 2, sm: 2.5 } } }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {item.label}
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                            {item.count}
                          </Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: item.background, color: item.color, width: { xs: 38, sm: 46 }, height: { xs: 38, sm: 46 } }}>
                          {item.icon}
                        </Avatar>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1.5}
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Adoption Applications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage each application from review to completion.
                </Typography>
              </Box>
              <Chip
                label={`${applications.length} ${applications.length === 1 ? "application" : "applications"}`}
                sx={{ bgcolor: "#E6F3EC", color: "#2F7D6D", fontWeight: 750 }}
              />
            </Stack>

            <Grid container spacing={3}>
              {applications.map((application) => {
                const pet = application.pet;
                const adopter = application.adopter;
                const paymentStatus = paymentStatuses[application._id];
                const paymentRequired = pet?.adoptionFee > 0;
                const isPaid = paymentStatus?.paid === true;
                const paymentStillLoading =
                  application.status === "approved" &&
                  pet &&
                  paymentStatus === undefined;
                const appearance = statusDesign[application.status] || statusDesign.pending;
                const currentlyEditing = editingNotesId === application._id;

                return (
                  <Grid key={application._id} size={{ xs: 12, md: 6 }}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        borderRadius: "22px",
                        border: "1px solid #E3EBE7",
                        boxShadow: "0 7px 24px rgba(39,81,62,0.055)",
                      }}
                    >
                      {/* Photo and status */}
                      <Box sx={{ position: "relative", height: 225, bgcolor: "#EAF4EF" }}>
                        {pet?.image ? (
                          <Box
                            component="img"
                            src={`http://localhost:5000/uploads/${pet.image}`}
                            alt={pet.name}
                            loading="lazy"
                            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <Stack spacing={1} alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                            <PetsRoundedIcon sx={{ fontSize: 60, color: "#A2C8B8" }} />
                            <Typography variant="body2" color="text.secondary">
                              No Image Available
                            </Typography>
                          </Stack>
                        )}
                        <Chip
                          icon={appearance.icon}
                          label={appearance.label}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            bgcolor: appearance.background,
                            color: appearance.color,
                            boxShadow: "0 3px 10px rgba(0,0,0,0.09)",
                            fontWeight: 800,
                            height: 32,
                            "& .MuiChip-icon": { color: "inherit", fontSize: 17 },
                          }}
                        />
                      </Box>

                      <CardContent
                        sx={{
                          p: { xs: 2.5, sm: 3 },
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          "&:last-child": { pb: { xs: 2.5, sm: 3 } },
                        }}
                      >
                        <Box sx={{ mb: 2.5 }}>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}>
                            {pet?.name || "Pet unavailable"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {pet ? `${pet.species || "Pet"} · ${pet.breed || "Mixed breed"}` : "Pet record removed"}
                          </Typography>
                        </Box>

                        {pet ? (
                          <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                            <Grid size={{ xs: 6 }}>
                              <Box sx={detailTile}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.7 }}>
                                  Pet Status
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 750, color: "text.primary" }}>
                                  {getPetStatusLabel(pet.status)}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Box sx={detailTile}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.7 }}>
                                  Adoption Fee
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 800, color: "primary.main" }}>
                                  {Number(pet.adoptionFee || 0) === 0
                                    ? "Free"
                                    : `₹${Number(pet.adoptionFee).toLocaleString("en-IN")}`}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        ) : (
                          <Alert severity="warning" sx={{ mb: 2.5 }}>
                            The pet linked to this application no longer exists.
                          </Alert>
                        )}

                        {pet && ["approved", "completed"].includes(application.status) && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 1.5,
                              p: 2,
                              mb: 2.5,
                              borderRadius: "14px",
                              backgroundColor: "#F0F7F3",
                              border: "1px solid #DCEBE2",
                            }}
                          >
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <PaymentsRoundedIcon sx={{ color: "primary.main", fontSize: 21 }} />
                              <Typography variant="body2" sx={{ fontWeight: 750 }}>
                                Payment Status
                              </Typography>
                            </Stack>
                            <Chip
                              label={!paymentRequired ? "Not Required" : paymentStatus === undefined ? "Checking..." : isPaid ? "Paid" : "Unpaid"}
                              size="small"
                              color={!paymentRequired ? "info" : paymentStatus === undefined ? "default" : isPaid ? "success" : "warning"}
                              sx={{ fontWeight: 750 }}
                            />
                          </Box>
                        )}

                        <Divider sx={{ mb: 2.5 }} />

                        {/* Adopter */}
                        <Stack direction="row" alignItems="center" spacing={1.3} sx={{ mb: 1.7 }}>
                          <Avatar sx={{ width: 40, height: 40, bgcolor: "#E5F2EB", color: "primary.main" }}>
                            <PersonOutlineRoundedIcon />
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
                              Adopter Details
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Application contact information
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack spacing={1} sx={{ mb: 2.5, overflowWrap: "anywhere" }}>
                          <Typography variant="body2" color="text.secondary">
                            <Box component="strong" sx={{ color: "text.primary" }}>Name: </Box>
                            {adopter?.name || "Unavailable"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <Box component="strong" sx={{ color: "text.primary" }}>Email: </Box>
                            {adopter?.email || "Unavailable"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <Box component="strong" sx={{ color: "text.primary" }}>Phone: </Box>
                            {adopter?.phone || "Unavailable"}
                          </Typography>
                        </Stack>

                        {application.message && (
                          <Box sx={{ p: 2.25, mb: 2.5, borderRadius: "14px", bgcolor: "#F7FAF9", border: "1px solid #E8F0EA" }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                              Application Message
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                              {application.message}
                            </Typography>
                          </Box>
                        )}

                        {/* Internal notes: one Edit/Save button */}
                        <Box
                          sx={{
                            p: 2.5,
                            mb: 3,
                            background: "linear-gradient(135deg, #EAF5EF 0%, #F4FAF6 100%)",
                            border: "1px solid #BDDECE",
                            borderRadius: "16px",
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={1.5}
                            sx={{ mb: 1.5 }}
                          >
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <StickyNote2RoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "primary.dark", lineHeight: 1.3 }}>
                                  Staff Notes
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Internal only
                                </Typography>
                              </Box>
                            </Stack>
                            <Button
                              variant={currentlyEditing ? "contained" : "outlined"}
                              size="small"
                              startIcon={currentlyEditing ? <SaveRoundedIcon /> : <EditRoundedIcon />}
                              disabled={savingNotesId === application._id}
                              onClick={() => handleSaveNotes(application._id)}
                              sx={{ flexShrink: 0, fontWeight: 750, borderRadius: "10px", px: { xs: 1.2, sm: 1.8 } }}
                            >
                              {savingNotesId === application._id
                                ? "Saving..."
                                : currentlyEditing
                                  ? "Save Notes"
                                  : "Edit Notes"}
                            </Button>
                          </Stack>

                          {currentlyEditing ? (
                            <TextField
                              value={staffNotes[application._id] || ""}
                              onChange={(event) => handleNotesChange(application._id, event.target.value)}
                              multiline
                              minRows={3}
                              fullWidth
                              autoFocus
                              placeholder="Add internal notes about this application..."
                              inputProps={{ maxLength: 1000 }}
                              helperText={`${staffNotes[application._id]?.length || 0}/1000`}
                              sx={{ backgroundColor: "#FFFFFF", borderRadius: 2 }}
                            />
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{
                                color: staffNotes[application._id] ? "text.primary" : "text.secondary",
                                fontStyle: staffNotes[application._id] ? "normal" : "italic",
                                lineHeight: 1.8,
                                whiteSpace: "pre-wrap",
                                overflowWrap: "anywhere",
                              }}
                            >
                              {staffNotes[application._id] || "No staff notes added yet."}
                            </Typography>
                          )}
                        </Box>

                        {/* Review actions, payment and completion */}
                        <Box sx={{ mt: "auto" }}>
                          {application.status === "pending" && pet && (
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                              <Button
                                variant="contained"
                                color="success"
                                fullWidth
                                disabled={updatingId === application._id}
                                onClick={() => handleStatusUpdate(application._id, "approved")}
                                sx={{ py: 1.25, fontWeight: 800 }}
                              >
                                {updatingId === application._id ? "Updating..." : "Approve Application"}
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                fullWidth
                                disabled={updatingId === application._id}
                                onClick={() => handleStatusUpdate(application._id, "rejected")}
                                sx={{ py: 1.25, fontWeight: 750 }}
                              >
                                {updatingId === application._id ? "Updating..." : "Reject"}
                              </Button>
                            </Stack>
                          )}

                          {application.status === "approved" && pet && (
                            <Stack spacing={1.5}>
                              <Alert severity="success">
                                Application approved. The pet is reserved for this adopter.
                              </Alert>
                              {paymentRequired && !isPaid && (
                                <Alert severity="warning">
                                  The adoption fee must be paid before this adoption can be completed.
                                </Alert>
                              )}
                              {!paymentRequired && (
                                <Alert severity="info">
                                  This pet has no adoption fee. Payment is not required.
                                </Alert>
                              )}
                              {paymentRequired && isPaid && (
                                <Alert severity="success">Adoption fee has been paid.</Alert>
                              )}
                              <Button
                                variant="contained"
                                fullWidth
                                disabled={
                                  updatingId === application._id ||
                                  paymentStillLoading ||
                                  (paymentRequired && !isPaid)
                                }
                                onClick={() => handleCompleteAdoption(application._id, pet.name)}
                                endIcon={<FavoriteRoundedIcon />}
                                sx={{ py: 1.3, fontWeight: 800 }}
                              >
                                {updatingId === application._id
                                  ? "Updating..."
                                  : paymentStillLoading
                                    ? "Checking Payment..."
                                    : "Mark as Adopted"}
                              </Button>
                            </Stack>
                          )}

                          {application.status === "rejected" && (
                            <Alert severity="error">
                              This application has been rejected.
                            </Alert>
                          )}
                          {application.status === "completed" && (
                            <Alert severity="info" icon={<FavoriteRoundedIcon />}>
                              This adoption has been completed.
                            </Alert>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}

              {applications.length === 0 && (
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      p: { xs: 4, sm: 6 },
                      py: { xs: 8, md: 9 },
                      backgroundColor: "#FFFFFF",
                      border: "1px dashed #C7DCD1",
                      borderRadius: "22px",
                      textAlign: "center",
                    }}
                  >
                    <PetsRoundedIcon sx={{ fontSize: 56, color: "#9FC9B6", mb: 1.5 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                      No adoption applications yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Applications submitted by adopters will appear here.
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

export default ManageAdoptions;
