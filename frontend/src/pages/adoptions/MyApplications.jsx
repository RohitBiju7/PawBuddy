import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
} from "@mui/material";

import {
  getMyApplications,
  cancelAdoption,
} from "../../services/adoptionService";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyApplications();

      setApplications(data.applications || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load your adoption applications.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getApplicationStatusColor = (status) => {
    if (status === "approved") {
      return "success";
    }

    if (status === "rejected") {
      return "error";
    }

    return "warning";
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

  const handleCancel = async (applicationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this adoption application?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await cancelAdoption(applicationId);

      setApplications((currentApplications) =>
        currentApplications.filter(
          (application) => application._id !== applicationId,
        ),
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to cancel adoption application.",
      );
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
            My Adoption Applications
          </Typography>

          <Typography color="text.secondary">
            Track the status of pets you have applied to adopt.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
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
            {applications.map((application) => {
              const pet = application.pet;

              return (
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                  }}
                  key={application._id}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
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
                          height: 220,
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 220,
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

                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "primary.main",
                          fontWeight: 700,
                          mb: 2,
                        }}
                      >
                        {pet?.name || "Pet unavailable"}
                      </Typography>

                      <Stack spacing={1.5} sx={{ mb: 2 }}>
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.7 }}
                          >
                            Application Status
                          </Typography>

                          <Chip
                            label={application.status}
                            color={getApplicationStatusColor(
                              application.status,
                            )}
                            size="small"
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: 600,
                            }}
                          />
                        </Box>

                        {pet && (
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 0.7 }}
                            >
                              Pet Status
                            </Typography>

                            <Chip
                              label={getPetStatusLabel(pet.status)}
                              color={getPetStatusColor(pet.status)}
                              size="small"
                              sx={{
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                        )}
                      </Stack>

                      {pet && (
                        <Stack spacing={0.8}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            <strong>Species:</strong> {pet.species}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            <strong>Breed:</strong> {pet.breed}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            <strong>Adoption Fee:</strong> ₹
                            {pet.adoptionFee}
                          </Typography>
                        </Stack>
                      )}

                      {application.message && (
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            backgroundColor: "#F7FAF9",
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            <strong>Your message:</strong>
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mt: 0.5,
                              lineHeight: 1.6,
                            }}
                          >
                            {application.message}
                          </Typography>
                        </Box>
                      )}

                      {application.status === "approved" && (
                        <Alert
                          severity="success"
                          sx={{
                            mt: 2,
                          }}
                        >
                          Your adoption application has been approved.
                          {pet?.status === "pending" &&
                            ` ${pet.name} is now reserved for you.`}
                        </Alert>
                      )}

                      {application.status === "rejected" && (
                        <Alert
                          severity="error"
                          sx={{
                            mt: 2,
                          }}
                        >
                          This adoption application was rejected.
                        </Alert>
                      )}

                      <Box sx={{ mt: "auto", pt: 3 }}>
                        {pet && (
                          <Button
                            component={Link}
                            to={`/pets/${pet._id}`}
                            variant="outlined"
                            fullWidth
                            sx={{
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            View Pet
                          </Button>
                        )}

                        {application.status === "pending" && (
                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={() =>
                              handleCancel(application._id)
                            }
                            sx={{
                              mt: 1.5,
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            Cancel Application
                          </Button>
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
                    py: 8,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    No applications yet
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Browse available pets and submit your first adoption
                    application.
                  </Typography>

                  <Button
                    component={Link}
                    to="/pets"
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Browse Pets
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default MyApplications;