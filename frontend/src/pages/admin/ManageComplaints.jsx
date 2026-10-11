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
  Divider,
} from "@mui/material";

import {
  getAllComplaints,
  deleteComplaintByAdmin,
} from "../../services/complaintService";

const ManageComplaints = () => {
  const [complaints, setComplaints] =
    useState([]);

  const [categoryFilter, setCategoryFilter] =
    useState("");

  const [loading, setLoading] =
    useState(true);

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

      const filters = {};

      if (categoryFilter) {
        filters.category = categoryFilter;
      }

      const data =
        await getAllComplaints(filters);

      setComplaints(
        data.complaints || [],
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load feedback.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [categoryFilter]);

  const handleClear = async (
    complaintId,
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to clear this feedback?",
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
        await deleteComplaintByAdmin(
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
          "Feedback cleared successfully.",
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to clear feedback.",
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
            Manage Feedback
          </Typography>

          <Typography
            color="text.secondary"
          >
            Review feedback submitted
            by adopters.
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

        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            border:
              "1px solid",
            borderColor:
              "divider",
          }}
        >
          <CardContent>
            <TextField
              select
              label="Category"
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value,
                )
              }
              fullWidth
            >
              <MenuItem value="">
                All Categories
              </MenuItem>

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
          </CardContent>
        </Card>

        {loading ? (
          <Stack
            alignItems="center"
            sx={{ py: 8 }}
          >
            <CircularProgress />
          </Stack>
        ) : complaints.length === 0 ? (
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
                py: 8,
                textAlign:
                  "center",
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                No feedback found
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                No feedback matches
                the selected category.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={3}>
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
                          Submitted{" "}
                          {formatDate(
                            complaint.createdAt,
                          )}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack spacing={0.8}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        <strong>
                          Adopter:
                        </strong>{" "}
                        {complaint.user?.name ||
                          "Unavailable"}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        <strong>
                          Email:
                        </strong>{" "}
                        {complaint.user?.email ||
                          "Unavailable"}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        <strong>
                          Phone:
                        </strong>{" "}
                        {complaint.user?.phone ||
                          "Unavailable"}
                      </Typography>

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
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        mb: 0.5,
                      }}
                    >
                      Feedback
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        lineHeight: 1.7,
                      }}
                    >
                      {
                        complaint.message
                      }
                    </Typography>

                    <Box
                      sx={{
                        mt: 3,
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
                          handleClear(
                            complaint._id,
                          )
                        }
                        sx={{
                          textTransform:
                            "none",
                          fontWeight: 600,
                        }}
                      >
                        {deletingId ===
                        complaint._id
                          ? "Clearing..."
                          : "Clear Feedback"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ),
            )}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default ManageComplaints;