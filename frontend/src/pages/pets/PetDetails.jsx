import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
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
} from "@mui/material";

import { getPetById } from "../../services/petService";

import {
  applyForAdoption,
  getMyApplications,
  cancelAdoption,
} from "../../services/adoptionService";

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [applicationOpen, setApplicationOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [applicationError, setApplicationError] = useState("");
  const [applicationSuccess, setApplicationSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [currentApplication, setCurrentApplication] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchPet = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPetById(id);

      setPet(data.pet || data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load pet details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const checkExistingApplication = async () => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      setCurrentApplication(null);
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "adopter") {
      setCurrentApplication(null);
      return;
    }

    try {
      const data = await getMyApplications();

      const petApplications = (data.applications || []).filter(
        (application) => application.pet?._id === id,
      );

      const approvedApplication = petApplications.find(
        (application) => application.status === "approved",
      );

      const pendingApplication = petApplications.find(
        (application) => application.status === "pending",
      );

      setCurrentApplication(
        approvedApplication || pendingApplication || null,
      );
    } catch (error) {
      console.error(
        "Failed to check existing application:",
        error,
      );
    }
  };

  useEffect(() => {
    fetchPet();
    checkExistingApplication();
  }, [id]);

  const handleApplyClick = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "adopter") {
      setApplicationError(
        "Only adopter accounts can submit adoption applications.",
      );
      return;
    }

    setApplicationError("");
    setApplicationSuccess("");
    setApplicationOpen(true);
  };

  const handleApplicationClose = () => {
    if (submitting) {
      return;
    }

    setApplicationOpen(false);
    setMessage("");
    setApplicationError("");
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setApplicationError("");
      setApplicationSuccess("");

      const data = await applyForAdoption({
        petId: pet._id,
        message,
      });

      setCurrentApplication(data.adoption);

      setApplicationSuccess(
        "Your adoption application has been submitted successfully.",
      );

      setMessage("");
      setApplicationOpen(false);
    } catch (error) {
      setApplicationError(
        error.response?.data?.message ||
          "Failed to submit adoption application.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelApplication = async () => {
    if (
      !currentApplication ||
      currentApplication.status !== "pending"
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel your adoption application for ${pet.name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setApplicationError("");
      setApplicationSuccess("");

      await cancelAdoption(currentApplication._id);

      setCurrentApplication(null);

      setApplicationSuccess(
        "Your adoption application has been cancelled.",
      );
    } catch (error) {
      setApplicationError(
        error.response?.data?.message ||
          "Failed to cancel adoption application.",
      );
    } finally {
      setCancelling(false);
    }
  };

  const getPetStatusColor = (status) => {
    if (status === "available") {
      return "success";
    }

    if (status === "pending") {
      return "warning";
    }

    return "default";
  };

  const getPetStatusLabel = (status) => {
    if (status === "pending") {
      return "Reserved";
    }

    if (!status) {
      return "Unavailable";
    }

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 70px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!pet) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert severity="warning">Pet not found.</Alert>
      </Container>
    );
  }

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
        <Button
          component={Link}
          to="/pets"
          variant="text"
          sx={{
            mb: 2,
            textTransform: "none",
          }}
        >
          ← Back to Pets
        </Button>

        {applicationSuccess && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
            }}
          >
            {applicationSuccess}
          </Alert>
        )}

        {applicationError && !applicationOpen && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
            }}
          >
            {applicationError}
          </Alert>
        )}

        <Paper
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Grid container>
            <Grid size={{ xs: 12, md: 6 }}>
              {pet.image ? (
                <Box
                  component="img"
                  src={`http://localhost:5000/uploads/${pet.image}`}
                  alt={pet.name}
                  sx={{
                    width: "100%",
                    height: {
                      xs: 320,
                      md: "100%",
                    },
                    minHeight: {
                      md: 520,
                    },
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    minHeight: {
                      xs: 320,
                      md: 520,
                    },
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
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  p: {
                    xs: 3,
                    sm: 4,
                  },
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={2}
                  sx={{
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      color: "primary.main",
                      fontWeight: 700,
                    }}
                  >
                    {pet.name}
                  </Typography>

                  <Chip
                    label={getPetStatusLabel(pet.status)}
                    color={getPetStatusColor(pet.status)}
                    sx={{
                      fontWeight: 600,
                    }}
                  />
                </Stack>

                <Stack spacing={2}>
                  <Typography>
                    <strong>Species:</strong> {pet.species}
                  </Typography>

                  <Typography>
                    <strong>Breed:</strong> {pet.breed}
                  </Typography>

                  <Typography>
                    <strong>Age:</strong> {pet.age}
                  </Typography>

                  <Typography>
                    <strong>Gender:</strong> {pet.gender}
                  </Typography>

                  <Typography>
                    <strong>Health Status:</strong>{" "}
                    {pet.healthStatus}
                  </Typography>

                  <Typography>
                    <strong>Vaccination Status:</strong>{" "}
                    {pet.vaccinationStatus}
                  </Typography>

                  <Typography>
                    <strong>Adoption Fee:</strong> ₹
                    {pet.adoptionFee}
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    mt: 4,
                    p: 2.5,
                    borderRadius: 2,
                    backgroundColor: "#F7FAF9",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: "primary.main",
                    }}
                  >
                    About {pet.name}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.8,
                    }}
                  >
                    {pet.description}
                  </Typography>
                </Box>

                {currentApplication?.status === "approved" ? (
                  <Alert
                    severity="success"
                    sx={{
                      mt: 4,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        mb: 0.5,
                      }}
                    >
                      Your adoption application has been approved!
                    </Typography>

                    <Typography variant="body2">
                      {pet.name} is now reserved for you. The next
                      steps in the adoption process will be available
                      here as they are scheduled.
                    </Typography>
                  </Alert>
                ) : pet.status === "available" ? (
                  currentApplication?.status === "pending" ? (
                    <Stack spacing={1.5} sx={{ mt: 4 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        disabled
                        color="secondary"
                        sx={{
                          py: 1.4,
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: "1rem",

                          "&.Mui-disabled": {
                            backgroundColor: "secondary.main",
                            color: "#FFFFFF",
                            opacity: 0.9,
                          },
                        }}
                      >
                        Applied for Adoption
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={handleCancelApplication}
                        disabled={cancelling}
                        sx={{
                          py: 1.2,
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        {cancelling
                          ? "Cancelling..."
                          : "Cancel Application"}
                      </Button>
                    </Stack>
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleApplyClick}
                      sx={{
                        mt: 4,
                        py: 1.4,
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "1rem",
                      }}
                    >
                      Apply for Adoption
                    </Button>
                  )
                ) : (
                  <Alert
                    severity="info"
                    sx={{
                      mt: 4,
                    }}
                  >
                    {pet.status === "pending"
                      ? "This pet is currently reserved and is no longer accepting adoption applications."
                      : "This pet is currently not available for adoption."}
                  </Alert>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Dialog
          open={applicationOpen}
          onClose={handleApplicationClose}
          fullWidth
          maxWidth="sm"
        >
          <Box
            component="form"
            onSubmit={handleApplicationSubmit}
          >
            <DialogTitle>
              Apply to Adopt {pet.name}
            </DialogTitle>

            <DialogContent>
              <Typography
                color="text.secondary"
                sx={{
                  mb: 2,
                }}
              >
                Tell us briefly why you would like to adopt{" "}
                {pet.name}.
              </Typography>

              {applicationError && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                  }}
                >
                  {applicationError}
                </Alert>
              )}

              <TextField
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                multiline
                rows={4}
                fullWidth
                inputProps={{
                  maxLength: 500,
                }}
                helperText={`${message.length}/500`}
              />
            </DialogContent>

            <DialogActions
              sx={{
                p: 3,
              }}
            >
              <Button
                onClick={handleApplicationClose}
                disabled={submitting}
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
                  : "Submit Application"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
};

export default PetDetails;