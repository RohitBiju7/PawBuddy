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
  getAllApplications,
  updateApplicationStatus,
} from "../../services/adoptionService";

const ManageAdoptions = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllApplications();

      setApplications(data.applications || []);
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

  const getStatusColor = (status) => {
    if (status === "approved") {
      return "success";
    }

    if (status === "rejected") {
      return "error";
    }

    return "warning";
  };

  const handleStatusUpdate = async (applicationId, status) => {
    const action = status === "approved" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this adoption application?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(applicationId);
      setError("");
      setSuccess("");

      await updateApplicationStatus(applicationId, status);

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status,
              }
            : application,
        ),
      );

      setSuccess(
        `Adoption application ${status} successfully.`,
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
            Adoption Applications
          </Typography>

          <Typography color="text.secondary">
            Review adoption requests submitted by adopters.
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
            {applications.map((application) => {
              const pet = application.pet;
              const adopter = application.adopter;

              return (
                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                  key={application._id}
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
                            fontWeight: 700,
                            color: "primary.main",
                          }}
                        >
                          {pet?.name || "Pet unavailable"}
                        </Typography>

                        <Chip
                          label={application.status}
                          color={getStatusColor(application.status)}
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: 600,
                          }}
                        />
                      </Stack>

                      {pet && (
                        <Stack spacing={0.8} sx={{ mb: 2 }}>
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
                            <strong>Species:</strong> {pet.species}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            <strong>Adoption Fee:</strong> ₹{pet.adoptionFee}
                          </Typography>
                        </Stack>
                      )}

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
                            sx={{
                              fontWeight: 700,
                              mb: 0.5,
                            }}
                          >
                            Application Message
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              lineHeight: 1.6,
                            }}
                          >
                            {application.message}
                          </Typography>
                        </Box>
                      )}

                      {application.status === "pending" && (
                        <Stack
                          direction={{
                            xs: "column",
                            sm: "row",
                          }}
                          spacing={1.5}
                          sx={{
                            mt: 3,
                          }}
                        >
                          <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            disabled={updatingId === application._id}
                            onClick={() =>
                              handleStatusUpdate(
                                application._id,
                                "approved",
                              )
                            }
                            sx={{
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            Approve
                          </Button>

                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            disabled={updatingId === application._id}
                            onClick={() =>
                              handleStatusUpdate(
                                application._id,
                                "rejected",
                              )
                            }
                            sx={{
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            Reject
                          </Button>
                        </Stack>
                      )}

                      {application.status !== "pending" && (
                        <Alert
                          severity={
                            application.status === "approved"
                              ? "success"
                              : "error"
                          }
                          sx={{
                            mt: 3,
                          }}
                        >
                          This application has been {application.status}.
                        </Alert>
                      )}
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
                    sx={{
                      mb: 1,
                    }}
                  >
                    No adoption applications
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    New adoption applications will appear here.
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

export default ManageAdoptions;