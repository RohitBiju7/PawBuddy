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
  Divider,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";

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

  const [currentApplication, setCurrentApplication] =
    useState(null);

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

  const getPetStatusLabel = (status) => {
    if (status === "pending") {
      return "Reserved";
    }

    if (!status) {
      return "Unavailable";
    }

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getPetStatusStyle = (status) => {
    if (status === "available") {
      return {
        bgcolor: "#E2F3E9",
        color: "#246A52",
      };
    }

    if (status === "pending") {
      return {
        bgcolor: "#FFF0DC",
        color: "#9A601E",
      };
    }

    return {
      bgcolor: "#EFF2F0",
      color: "#60746D",
    };
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "Not specified";
    }

    if (typeof value === "string") {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    return value;
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 78px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          backgroundColor: "background.default",
        }}
      >
        <CircularProgress />

        <Typography variant="body2" color="text.secondary">
          Getting to know your new friend...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 7 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>

        <Button
          component={Link}
          to="/pets"
          startIcon={<ArrowBackRoundedIcon />}
        >
          Back to Pets
        </Button>
      </Container>
    );
  }

  if (!pet) {
    return (
      <Container maxWidth="md" sx={{ py: 7 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Pet not found.
        </Alert>

        <Button
          component={Link}
          to="/pets"
          startIcon={<ArrowBackRoundedIcon />}
        >
          Back to Pets
        </Button>
      </Container>
    );
  }

  const petFacts = [
    {
      label: "Species",
      value: formatValue(pet.species),
    },
    {
      label: "Breed",
      value: formatValue(pet.breed),
    },
    {
      label: "Age",
      value: formatValue(pet.age),
    },
    {
      label: "Gender",
      value: formatValue(pet.gender),
    },
    {
      label: "Health Status",
      value: formatValue(pet.healthStatus),
    },
    {
      label: "Vaccination Status",
      value: formatValue(pet.vaccinationStatus),
    },
  ];

  const adoptionFee = Number(pet.adoptionFee || 0);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 78px)",
        backgroundColor: "background.default",
        pb: { xs: 8, md: 12 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 3, md: 5 },
        }}
      >
        {/* Back Navigation */}
        <Button
          component={Link}
          to="/pets"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            mb: 3,
            color: "text.secondary",
            fontWeight: 700,
            px: 1,
            "&:hover": {
              color: "primary.main",
              backgroundColor: "#EAF4EF",
            },
          }}
        >
          Back to Pets
        </Button>

        {/* Feedback */}
        {applicationSuccess && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              border: "1px solid #D7EADB",
            }}
          >
            {applicationSuccess}
          </Alert>
        )}

        {applicationError && !applicationOpen && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {applicationError}
          </Alert>
        )}

        {/* Introduction */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(120deg, #E8F5EE 0%, #F7FAF6 60%, #FFF4EC 100%)",
            border: "1px solid #DFEBE3",
            borderRadius: {
              xs: "22px",
              md: "28px",
            },
            p: {
              xs: 3,
              sm: 4,
              md: 5,
            },
            mb: 3,
          }}
        >
          <PetsRoundedIcon
            aria-hidden="true"
            sx={{
              position: "absolute",
              right: {
                xs: -30,
                md: 35,
              },
              top: -50,
              fontSize: {
                xs: 150,
                md: 215,
              },
              color: "rgba(47,125,109,0.065)",
              transform: "rotate(-18deg)",
              pointerEvents: "none",
            }}
          />

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <FavoriteRoundedIcon
                sx={{
                  fontSize: 19,
                  color: "secondary.main",
                }}
              />

              <Typography
                variant="overline"
                sx={{
                  color: "primary.main",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                }}
              >
                MEET YOUR FUTURE FRIEND
              </Typography>
            </Stack>

            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "text.primary",
                lineHeight: 1.15,
                fontSize: {
                  xs: "2.3rem",
                  sm: "3rem",
                  md: "3.5rem",
                },
                mb: 1.5,
              }}
            >
              Meet{" "}
              <Box
                component="span"
                sx={{
                  color: "primary.main",
                }}
              >
                {pet.name}
              </Box>
              <Box
                component="span"
                sx={{
                  color: "secondary.main",
                }}
              >
                .
              </Box>
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                maxWidth: 600,
                lineHeight: 1.8,
                fontSize: {
                  xs: "0.97rem",
                  sm: "1.05rem",
                },
              }}
            >
              Every pet has a story. Get to know{" "}
              {pet.name}, explore their details,
              and take the next step toward
              a wonderful companionship.
            </Typography>
          </Box>
        </Box>

        {/* Main Pet Profile */}
        <Grid container spacing={3} alignItems="stretch">
          {/* Pet Photograph */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                minHeight: {
                  xs: 330,
                  sm: 440,
                  md: 590,
                },
                position: "relative",
                borderRadius: "24px",
                overflow: "hidden",
                backgroundColor: "#E6F1EB",
                border: "1px solid #DFEAE2",
                boxShadow:
                  "0 10px 32px rgba(39,81,62,0.07)",
              }}
            >
              {pet.image ? (
                <Box
                  component="img"
                  src={`/uploads/${pet.image}`}
                  alt={pet.name}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              ) : (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  spacing={1.5}
                  sx={{
                    position: "absolute",
                    inset: 0,
                  }}
                >
                  <PetsRoundedIcon
                    sx={{
                      fontSize: 100,
                      color: "#9FC9B8",
                    }}
                  />

                  <Typography color="text.secondary">
                    No Image Available
                  </Typography>
                </Stack>
              )}

              {/* Photo Status Badge */}
              <Chip
                icon={
                  pet.status === "available" ? (
                    <CheckCircleRoundedIcon />
                  ) : undefined
                }
                label={getPetStatusLabel(pet.status)}
                sx={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  height: 36,
                  px: 0.6,
                  fontWeight: 800,
                  borderRadius: "11px",
                  boxShadow:
                    "0 4px 14px rgba(0,0,0,0.10)",
                  ...getPetStatusStyle(pet.status),
                  "& .MuiChip-icon": {
                    color: "inherit",
                  },
                }}
              />

              {/* Bottom Photo Label */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 3,
                  pt: 8,
                  background:
                    "linear-gradient(transparent, rgba(20,47,37,0.7))",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <FavoriteRoundedIcon
                    sx={{
                      fontSize: 19,
                      color: "#F5A394",
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    A little friend with a lot of love
                  </Typography>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* Pet Information and Adoption */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                p: {
                  xs: 3,
                  sm: 4,
                },
                borderRadius: "24px",
                border: "1px solid #E3EBE7",
                boxShadow:
                  "0 6px 24px rgba(39,81,62,0.045)",
                backgroundColor: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{ mb: 1 }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "14px",
                    backgroundColor: "#E4F3EB",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PetsRoundedIcon />
                </Box>

                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: "-0.025em",
                    }}
                  >
                    At a glance
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Get to know {pet.name}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2.5 }} />

              {/* Pet Facts */}
              <Grid container spacing={1.5}>
                {petFacts.map((fact) => (
                  <Grid
                    size={{
                      xs: 6,
                    }}
                    key={fact.label}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        p: {
                          xs: 1.5,
                          sm: 2,
                        },
                        borderRadius: "14px",
                        backgroundColor: "#F7FAF9",
                        border: "1px solid #EAF0EC",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          color: "text.secondary",
                          fontWeight: 600,
                          mb: 0.8,
                        }}
                      >
                        {fact.label}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.primary",
                          fontWeight: 750,
                          overflowWrap: "anywhere",
                          textTransform:
                            "none",
                        }}
                      >
                        {fact.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Adoption Fee */}
              <Box
                sx={{
                  mt: 3,
                  p: 2.5,
                  borderRadius: "16px",
                  background:
                    "linear-gradient(110deg, #EDF7F0 0%, #F7FBF8 100%)",
                  border: "1px solid #D9EBDF",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 600, mb: 0.3 }}
                    >
                      Adoption Fee
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: "primary.main",
                        letterSpacing: "-0.025em",
                      }}
                    >
                      {adoptionFee === 0
                        ? "Free"
                        : `₹${adoptionFee.toLocaleString(
                            "en-IN",
                          )}`}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      flexShrink: 0,
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#DDF0E5",
                    }}
                  >
                    <FavoriteRoundedIcon
                      sx={{
                        color: "primary.main",
                        fontSize: 26,
                      }}
                    />
                  </Box>
                </Stack>
              </Box>

              {/* Adoption Controls */}
              <Box sx={{ mt: "auto", pt: 3 }}>
                {currentApplication?.status === "approved" ? (
                  <Alert
                    severity="success"
                    icon={<CheckCircleRoundedIcon />}
                    sx={{
                      border: "1px solid #D6EBDD",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,
                        mb: 0.5,
                      }}
                    >
                      Application Approved!
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ lineHeight: 1.7 }}
                    >
                      {pet.name} is now reserved for you.
                      The next steps in the adoption
                      process will be available here
                      as they are scheduled.
                    </Typography>
                  </Alert>
                ) : pet.status === "available" ? (
                  currentApplication?.status === "pending" ? (
                    <Stack spacing={1.5}>
                      <Alert
                        severity="info"
                        icon={<InfoOutlinedIcon />}
                        sx={{
                          border: "1px solid #D8E8EE",
                        }}
                      >
                        Your adoption application is
                        currently awaiting review.
                      </Alert>

                      <Button
                        variant="contained"
                        fullWidth
                        disabled
                        sx={{
                          py: 1.5,
                          fontWeight: 750,
                          fontSize: "0.98rem",
                          borderRadius: "12px",
                          "&.Mui-disabled": {
                            backgroundColor: "#DCEEE6",
                            color: "#2F7D6D",
                          },
                        }}
                      >
                        Applied for Adoption
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        disabled={cancelling}
                        onClick={handleCancelApplication}
                        sx={{
                          py: 1.2,
                          fontWeight: 700,
                          borderRadius: "12px",
                        }}
                      >
                        {cancelling
                          ? "Cancelling..."
                          : "Cancel Application"}
                      </Button>
                    </Stack>
                  ) : (
                    <Stack spacing={1.5}>
                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        endIcon={<ArrowForwardRoundedIcon />}
                        onClick={handleApplyClick}
                        sx={{
                          py: 1.5,
                          fontWeight: 800,
                          fontSize: "1rem",
                          borderRadius: "12px",
                        }}
                      >
                        Apply to Adopt {pet.name}
                      </Button>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          textAlign: "center",
                          lineHeight: 1.6,
                        }}
                      >
                        Take the first step toward
                        welcoming your new companion.
                      </Typography>
                    </Stack>
                  )
                ) : (
                  <Alert
                    severity="info"
                    sx={{
                      border: "1px solid #DDE9ED",
                    }}
                  >
                    {pet.status === "pending"
                      ? "This pet is currently reserved and is no longer accepting adoption applications."
                      : "This pet is currently not available for adoption."}
                  </Alert>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* About Pet */}
        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: {
              xs: 3,
              sm: 4,
              md: 5,
            },
            borderRadius: "24px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E3EBE7",
            boxShadow:
              "0 6px 24px rgba(39,81,62,0.045)",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ mb: 2.5 }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: "14px",
                backgroundColor: "#FDEBE6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VolunteerActivismRoundedIcon
                sx={{
                  color: "#D97969",
                  fontSize: 24,
                }}
              />
            </Box>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                About {pet.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Every pet has a story worth sharing
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "1rem",
              lineHeight: 1.95,
              maxWidth: 900,
              whiteSpace: "pre-wrap",
            }}
          >
            {pet.description ||
              `Learn more about ${pet.name} by contacting the shelter.`}
          </Typography>
        </Paper>

        {/* Bottom Decorative Message */}
        <Box
          sx={{
            mt: 5,
            textAlign: "center",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
          >
            <FavoriteRoundedIcon
              sx={{
                fontSize: 17,
                color: "secondary.main",
              }}
            />

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontWeight: 600,
              }}
            >
              Little paws. Big love. Forever homes.
            </Typography>
          </Stack>
        </Box>

        {/* Adoption Application Dialog */}
        <Dialog
          open={applicationOpen}
          onClose={handleApplicationClose}
          fullWidth
          maxWidth="sm"
          slotProps={{
            paper: {
              sx: {
                borderRadius: "22px",
                overflow: "hidden",
              },
            },
          }}
        >
          <Box
            component="form"
            onSubmit={handleApplicationSubmit}
          >
            {/* Dialog Header */}
            <Box
              sx={{
                background:
                  "linear-gradient(115deg, #E8F5EE 0%, #FFF4EC 100%)",
                p: {
                  xs: 3,
                  sm: 4,
                },
                pb: 3,
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "15px",
                    backgroundColor: "#DDEFE5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FavoriteRoundedIcon
                    sx={{
                      fontSize: 26,
                      color: "primary.main",
                    }}
                  />
                </Box>

                <Box>
                  <DialogTitle
                    sx={{
                      p: 0,
                      fontWeight: 800,
                      color: "text.primary",
                      fontSize: {
                        xs: "1.25rem",
                        sm: "1.5rem",
                      },
                    }}
                  >
                    Apply to Adopt {pet.name}
                  </DialogTitle>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Begin your adoption journey
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <DialogContent
              sx={{
                p: {
                  xs: 3,
                  sm: 4,
                },
              }}
            >
              <Typography
                color="text.secondary"
                sx={{
                  mb: 3,
                  lineHeight: 1.75,
                }}
              >
                Tell the shelter a little about
                yourself and why you would love
                to welcome {pet.name} into your home.
              </Typography>

              {applicationError && (
                <Alert
                  severity="error"
                  sx={{ mb: 3 }}
                >
                  {applicationError}
                </Alert>
              )}

              <TextField
                label="Your Message"
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                multiline
                rows={5}
                fullWidth
                placeholder="Tell us why you'd like to adopt this pet..."
                inputProps={{
                  maxLength: 500,
                }}
                helperText={`${message.length}/500 characters`}
              />
            </DialogContent>

            <DialogActions
              sx={{
                px: {
                  xs: 3,
                  sm: 4,
                },
                pb: {
                  xs: 3,
                  sm: 4,
                },
                pt: 0,
                gap: 1,
              }}
            >
              <Button
                onClick={handleApplicationClose}
                disabled={submitting}
                color="inherit"
                sx={{
                  fontWeight: 700,
                  px: 2.5,
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                endIcon={
                  !submitting ? (
                    <ArrowForwardRoundedIcon />
                  ) : undefined
                }
                sx={{
                  py: 1.2,
                  px: 3,
                  fontWeight: 750,
                  borderRadius: "12px",
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