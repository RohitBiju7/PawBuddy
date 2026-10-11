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
} from "@mui/material";

import {
  getAllApplications,
  updateApplicationStatus,
  completeAdoption,
  updateStaffNotes,
} from "../../services/adoptionService";

import { getAdoptionPaymentStatusForStaff } from "../../services/paymentService";

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

      /*
        Payment status matters for approved/completed adoptions.
      */
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

  const getApplicationStatusColor = (status) => {
    if (status === "approved") {
      return "success";
    }

    if (status === "rejected") {
      return "error";
    }

    if (status === "completed") {
      return "info";
    }

    return "warning";
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

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(applicationId);

      setError("");
      setSuccess("");

      const data = await updateApplicationStatus(applicationId, status);

      /*
        Refetch because approving one application
        can reject others automatically.
      */
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

    if (!confirmed) {
      return;
    }

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
            Review and manage adoption applications submitted by adopters.
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

              const paymentStatus = paymentStatuses[application._id];

              const paymentRequired = pet?.adoptionFee > 0;

              const isPaid = paymentStatus?.paid === true;

              const paymentStillLoading =
                application.status === "approved" &&
                pet &&
                paymentStatus === undefined;

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
                        sx={{
                          mb: 2,
                        }}
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
                          color={getApplicationStatusColor(application.status)}
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: 600,
                          }}
                        />
                      </Stack>

                      {pet && (
                        <Stack spacing={0.8} sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Breed:</strong> {pet.breed}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            <strong>Species:</strong> {pet.species}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            <strong>Pet Status:</strong>{" "}
                            {getPetStatusLabel(pet.status)}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            <strong>Adoption Fee:</strong>{" "}
                            {pet.adoptionFee === 0
                              ? "Free"
                              : `₹${pet.adoptionFee}`}
                          </Typography>

                          {["approved", "completed"].includes(
                            application.status,
                          ) && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                <strong>Payment:</strong>
                              </Typography>

                              {!paymentRequired ? (
                                <Chip
                                  label="Not Required"
                                  color="info"
                                  size="small"
                                  sx={{
                                    fontWeight: 600,
                                  }}
                                />
                              ) : paymentStatus === undefined ? (
                                <Chip
                                  label="Checking..."
                                  size="small"
                                  sx={{
                                    fontWeight: 600,
                                  }}
                                />
                              ) : isPaid ? (
                                <Chip
                                  label="Paid"
                                  color="success"
                                  size="small"
                                  sx={{
                                    fontWeight: 600,
                                  }}
                                />
                              ) : (
                                <Chip
                                  label="Unpaid"
                                  color="warning"
                                  size="small"
                                  sx={{
                                    fontWeight: 600,
                                  }}
                                />
                              )}
                            </Box>
                          )}
                        </Stack>
                      )}

                      {!pet && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                          The pet linked to this application no longer exists.
                        </Alert>
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
                        <Typography variant="body2" color="text.secondary">
                          <strong>Name:</strong>{" "}
                          {adopter?.name || "Unavailable"}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          <strong>Email:</strong>{" "}
                          {adopter?.email || "Unavailable"}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
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

                      <Divider sx={{ my: 3 }} />

                      <Box
                        sx={{
                          p: 2.5,
                          backgroundColor: "#EAF4F1",
                          borderRadius: 2.5,
                          border: "1px solid",
                          borderColor: "#A8D5C5",
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={2}
                          sx={{ mb: 1.5 }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              color: "primary.main",
                            }}
                          >
                            Staff Notes
                          </Typography>

                          <Button
                            variant="outlined"
                            size="small"
                            disabled={savingNotesId === application._id}
                            onClick={() => handleSaveNotes(application._id)}
                            sx={{
                              textTransform: "none",
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            {savingNotesId === application._id
                              ? "Saving..."
                              : editingNotesId === application._id
                                ? "Save Notes"
                                : "Edit Notes"}
                          </Button>
                        </Stack>

                        {editingNotesId === application._id ? (
                          <TextField
                            value={staffNotes[application._id] || ""}
                            onChange={(event) =>
                              handleNotesChange(
                                application._id,
                                event.target.value,
                              )
                            }
                            multiline
                            minRows={3}
                            fullWidth
                            autoFocus
                            placeholder="Add internal notes about this application..."
                            inputProps={{
                              maxLength: 1000,
                            }}
                            helperText={`${
                              staffNotes[application._id]?.length || 0
                            }/1000`}
                            sx={{
                              backgroundColor: "white",
                              borderRadius: 2,
                            }}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{
                              lineHeight: 1.7,
                              whiteSpace: "pre-wrap",
                              color: staffNotes[application._id]
                                ? "text.primary"
                                : "text.secondary",
                              fontStyle: staffNotes[application._id]
                                ? "normal"
                                : "italic",
                            }}
                          >
                            {staffNotes[application._id] ||
                              "No staff notes added yet."}
                          </Typography>
                        )}
                      </Box>

                      {application.status === "pending" && pet && (
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
                              handleStatusUpdate(application._id, "approved")
                            }
                            sx={{
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            {updatingId === application._id
                              ? "Updating..."
                              : "Approve"}
                          </Button>

                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            disabled={updatingId === application._id}
                            onClick={() =>
                              handleStatusUpdate(application._id, "rejected")
                            }
                            sx={{
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            {updatingId === application._id
                              ? "Updating..."
                              : "Reject"}
                          </Button>
                        </Stack>
                      )}

                      {application.status === "approved" && pet && (
                        <Box
                          sx={{
                            mt: 3,
                          }}
                        >
                          <Alert
                            severity="success"
                            sx={{
                              mb: 2,
                            }}
                          >
                            This application has been approved. The pet is
                            currently reserved for this adopter.
                          </Alert>

                          {paymentRequired && !isPaid && (
                            <Alert
                              severity="warning"
                              sx={{
                                mb: 2,
                              }}
                            >
                              The adoption fee must be paid before this adoption
                              can be marked as completed.
                            </Alert>
                          )}

                          {!paymentRequired && (
                            <Alert
                              severity="info"
                              sx={{
                                mb: 2,
                              }}
                            >
                              This pet has no adoption fee. Payment is not
                              required.
                            </Alert>
                          )}

                          {paymentRequired && isPaid && (
                            <Alert
                              severity="success"
                              sx={{
                                mb: 2,
                              }}
                            >
                              Adoption fee has been paid.
                            </Alert>
                          )}

                          <Button
                            variant="contained"
                            fullWidth
                            disabled={
                              updatingId === application._id ||
                              paymentStillLoading ||
                              (paymentRequired && !isPaid)
                            }
                            onClick={() =>
                              handleCompleteAdoption(application._id, pet.name)
                            }
                            sx={{
                              textTransform: "none",
                              fontWeight: 700,
                            }}
                          >
                            {updatingId === application._id
                              ? "Updating..."
                              : paymentStillLoading
                                ? "Checking Payment..."
                                : "Mark as Adopted"}
                          </Button>
                        </Box>
                      )}

                      {application.status === "rejected" && (
                        <Alert
                          severity="error"
                          sx={{
                            mt: 3,
                          }}
                        >
                          This application has been rejected.
                        </Alert>
                      )}

                      {application.status === "completed" && (
                        <Alert
                          severity="info"
                          sx={{
                            mt: 3,
                          }}
                        >
                          This adoption has been completed.
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
                    sx={{ mb: 1 }}
                  >
                    No adoption applications
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
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
