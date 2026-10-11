import React, {
  useEffect,
  useState,
} from "react";

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
} from "@mui/material";

import {
  createComplaint,
  getMyComplaints,
  deleteOwnComplaint,
} from "../../services/complaintService";

const MyComplaints = () => {
  const [complaints, setComplaints] =
    useState([]);

  const [formData, setFormData] =
    useState({
      subject: "",
      category: "",
      message: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getMyComplaints();

      setComplaints(
        data.complaints || [],
      );
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
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const data =
        await createComplaint(
          formData,
        );

      setFormData({
        subject: "",
        category: "",
        message: "",
      });

      await fetchComplaints();

      setSuccess(
        data.message ||
          "Feedback submitted successfully.",
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

  const handleDelete = async (
    complaintId,
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this feedback?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        complaintId,
      );

      setError("");
      setSuccess("");

      const data =
        await deleteOwnComplaint(
          complaintId,
        );

      setComplaints(
        (currentComplaints) =>
          currentComplaints.filter(
            (complaint) =>
              complaint._id !==
              complaintId,
          ),
      );

      setSuccess(
        data.message ||
          "Feedback deleted successfully.",
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

  const formatDate = (date) => {
    return new Date(
      date,
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );
  };

  return (
    <Box
      sx={{
        minHeight:
          "calc(100vh - 70px)",
        backgroundColor:
          "background.default",
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
              color:
                "primary.main",
              fontWeight: 700,
              mb: 1,
            }}
          >
            Feedback
          </Typography>

          <Typography
            color="text.secondary"
          >
            Share feedback, report
            an issue, or tell us
            about your experience
            with PawBuddy.
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
          >
            {success}
          </Alert>
        )}

        <Stack spacing={4}>
          <Card
            sx={{
              borderRadius: 3,
              border:
                "1px solid",
              borderColor:
                "divider",
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2.5,
                  sm: 3,
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                Submit Feedback
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Select a category
                and describe your
                feedback or issue.
              </Typography>

              <Box
                component="form"
                onSubmit={
                  handleSubmit
                }
              >
                <Stack spacing={2.5}>
                  <TextField
                    label="Subject"
                    name="subject"
                    value={
                      formData.subject
                    }
                    onChange={
                      handleChange
                    }
                    fullWidth
                    required
                    inputProps={{
                      maxLength: 150,
                    }}
                  />

                  <TextField
                    select
                    label="Category"
                    name="category"
                    value={
                      formData.category
                    }
                    onChange={
                      handleChange
                    }
                    fullWidth
                    required
                  >
                    <MenuItem value="adoption">
                      Adoption
                    </MenuItem>

                    <MenuItem value="appointment">
                      Appointment
                    </MenuItem>

                    <MenuItem value="payment">
                      Payment
                    </MenuItem>

                    <MenuItem value="pet information">
                      Pet Information
                    </MenuItem>

                    <MenuItem value="other">
                      Other
                    </MenuItem>
                  </TextField>

                  <TextField
                    label="Message"
                    name="message"
                    value={
                      formData.message
                    }
                    onChange={
                      handleChange
                    }
                    multiline
                    minRows={5}
                    fullWidth
                    required
                    inputProps={{
                      maxLength: 1000,
                    }}
                    helperText={`${formData.message.length}/1000`}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "flex-end",
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={
                        submitting
                      }
                      sx={{
                        textTransform:
                          "none",
                        fontWeight: 600,
                        minWidth: 160,
                      }}
                    >
                      {submitting
                        ? "Submitting..."
                        : "Submit Feedback"}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>

          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              My Feedback
            </Typography>

            {loading ? (
              <Stack
                alignItems="center"
                sx={{ py: 6 }}
              >
                <CircularProgress />
              </Stack>
            ) : complaints.length ===
              0 ? (
              <Card
                sx={{
                  borderRadius: 3,
                  border:
                    "1px solid",
                  borderColor:
                    "divider",
                }}
              >
                <CardContent
                  sx={{
                    py: 6,
                    textAlign:
                      "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    No feedback submitted
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Feedback you submit
                    will appear here.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Stack spacing={2}>
                {complaints.map(
                  (complaint) => (
                    <Card
                      key={
                        complaint._id
                      }
                      sx={{
                        borderRadius: 3,
                        border:
                          "1px solid",
                        borderColor:
                          "divider",
                      }}
                    >
                      <CardContent
                        sx={{
                          p: {
                            xs: 2.5,
                            sm: 3,
                          },
                        }}
                      >
                        <Stack
                          direction={{
                            xs: "column",
                            sm: "row",
                          }}
                          justifyContent="space-between"
                          alignItems={{
                            xs:
                              "flex-start",
                            sm:
                              "center",
                          }}
                          spacing={1.5}
                          sx={{
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight:
                                  700,
                              }}
                            >
                              {
                                complaint.subject
                              }
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              Submitted on{" "}
                              {formatDate(
                                complaint.createdAt,
                              )}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack spacing={1}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            <strong>
                              Category:
                            </strong>{" "}
                            <span
                              style={{
                                textTransform:
                                  "capitalize",
                              }}
                            >
                              {
                                complaint.category
                              }
                            </span>
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              lineHeight:
                                1.7,
                            }}
                          >
                            {
                              complaint.message
                            }
                          </Typography>
                        </Stack>

                        <Box
                          sx={{
                            mt: 2.5,
                            display:
                              "flex",
                            justifyContent:
                              "flex-end",
                          }}
                        >
                          <Button
                            variant="outlined"
                            color="error"
                            disabled={
                              deletingId ===
                              complaint._id
                            }
                            onClick={() =>
                              handleDelete(
                                complaint._id,
                              )
                            }
                            sx={{
                              textTransform:
                                "none",
                              fontWeight:
                                600,
                            }}
                          >
                            {deletingId ===
                            complaint._id
                              ? "Deleting..."
                              : "Delete"}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ),
                )}
              </Stack>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default MyComplaints;