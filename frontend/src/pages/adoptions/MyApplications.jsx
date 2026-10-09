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

import {
  createAdoptionFeeOrder,
  verifyAdoptionFeePayment,
  getAdoptionPaymentStatus,
} from "../../services/paymentService";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [paymentStatuses, setPaymentStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [paymentLoadingId, setPaymentLoadingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const fetchPaymentStatus = async (applicationId) => {
    try {
      const data =
        await getAdoptionPaymentStatus(applicationId);

      setPaymentStatuses((current) => ({
        ...current,
        [applicationId]: data,
      }));
    } catch (error) {
      console.error(
        "Failed to load payment status:",
        error,
      );
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyApplications();

      const applicationList =
        data.applications || [];

      setApplications(applicationList);

      /*
        Payment status is relevant once an application
        has been approved or completed.
      */
      const paymentRelevantApplications =
        applicationList.filter(
          (application) =>
            application.pet &&
            ["approved", "completed"].includes(
              application.status,
            ),
        );

      await Promise.all(
        paymentRelevantApplications.map(
          (application) =>
            fetchPaymentStatus(application._id),
        ),
      );
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

    if (status === "completed") {
      return "info";
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

    if (status === "adopted") {
      return "info";
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

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
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
      setSuccess("");

      await cancelAdoption(applicationId);

      setApplications((currentApplications) =>
        currentApplications.filter(
          (application) =>
            application._id !== applicationId,
        ),
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to cancel adoption application.",
      );
    }
  };

  const handlePayment = async (application) => {
    try {
      setPaymentLoadingId(application._id);
      setError("");
      setSuccess("");

      /*
        Load Razorpay Checkout only when the user
        actually needs to make a payment.
      */
      const scriptLoaded =
        await loadRazorpayScript();

      if (!scriptLoaded) {
        setError(
          "Unable to load Razorpay. Please check your internet connection and try again.",
        );

        return;
      }

      /*
        Ask our backend to create the order.

        The backend determines the amount from the
        pet document, so the frontend cannot alter it.
      */
      const orderData =
        await createAdoptionFeeOrder(
          application._id,
        );

      /*
        Safety for ₹0 adoption fee.

        Normally the UI will already know this from
        the pet, but the backend is still the authority.
      */
      if (!orderData.paymentRequired) {
        await fetchPaymentStatus(
          application._id,
        );

        setSuccess(
          "No adoption fee is required for this pet.",
        );

        return;
      }

      const user = JSON.parse(
        localStorage.getItem("user"),
      );

      const options = {
        key: orderData.keyId,

        amount: orderData.order.amount,

        currency: orderData.order.currency,

        name: "PawBuddy",

        description: `Adoption fee for ${
          application.pet?.name || "pet adoption"
        }`,

        order_id: orderData.order.id,

        handler: async (response) => {
          try {
            setPaymentLoadingId(
              application._id,
            );

            await verifyAdoptionFeePayment({
              razorpay_order_id:
                response.razorpay_order_id,

              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_signature:
                response.razorpay_signature,
            });

            await fetchPaymentStatus(
              application._id,
            );

            setSuccess(
              `Adoption fee for ${
                application.pet?.name ||
                "your pet"
              } was paid successfully.`,
            );
          } catch (error) {
            setError(
              error.response?.data?.message ||
                "Payment verification failed.",
            );
          } finally {
            setPaymentLoadingId(null);
          }
        },

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: {
          color: "#2F7D6D",
        },

        modal: {
          ondismiss: () => {
            setPaymentLoadingId(null);
          },
        },
      };

      const razorpay = new window.Razorpay(
        options,
      );

      razorpay.on(
        "payment.failed",
        (response) => {
          setError(
            response.error?.description ||
              "Payment failed. Please try again.",
          );

          setPaymentLoadingId(null);
        },
      );

      razorpay.open();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to start payment.",
      );

      setPaymentLoadingId(null);
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

              const paymentStatus =
                paymentStatuses[
                  application._id
                ];

              const paymentRequired =
                pet?.adoptionFee > 0;

              const isPaid =
                paymentStatus?.paid === true;

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
                          justifyContent:
                            "center",
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
                        {pet?.name ||
                          "Pet unavailable"}
                      </Typography>

                      <Stack
                        spacing={1.5}
                        sx={{ mb: 2 }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.7 }}
                          >
                            Application Status
                          </Typography>

                          <Chip
                            label={
                              application.status
                            }
                            color={getApplicationStatusColor(
                              application.status,
                            )}
                            size="small"
                            sx={{
                              textTransform:
                                "capitalize",
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
                              label={getPetStatusLabel(
                                pet.status,
                              )}
                              color={getPetStatusColor(
                                pet.status,
                              )}
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
                            <strong>
                              Species:
                            </strong>{" "}
                            {pet.species}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            <strong>
                              Breed:
                            </strong>{" "}
                            {pet.breed}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            <strong>
                              Adoption Fee:
                            </strong>{" "}
                            {pet.adoptionFee === 0
                              ? "Free"
                              : `₹${pet.adoptionFee}`}
                          </Typography>
                        </Stack>
                      )}

                      {application.message && (
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            backgroundColor:
                              "#F7FAF9",
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            <strong>
                              Your message:
                            </strong>
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

                      {application.status ===
                        "approved" && (
                        <>
                          <Alert
                            severity="success"
                            sx={{
                              mt: 2,
                            }}
                          >
                            Your adoption
                            application has been
                            approved.
                            {pet?.status ===
                              "pending" &&
                              ` ${pet.name} is now reserved for you.`}
                          </Alert>

                          {pet && (
                            <Box
                              sx={{
                                mt: 2,
                                p: 2,
                                borderRadius: 2,
                                backgroundColor:
                                  "#F7FAF9",
                                border:
                                  "1px solid",
                                borderColor:
                                  "divider",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 700,
                                  mb: 1,
                                }}
                              >
                                Adoption Fee
                              </Typography>

                              {!paymentRequired ? (
                                <Alert severity="info">
                                  This pet has no
                                  adoption fee. No
                                  payment is required.
                                </Alert>
                              ) : isPaid ? (
                                <Alert severity="success">
                                  Adoption fee of ₹
                                  {pet.adoptionFee} has
                                  been paid
                                  successfully.
                                </Alert>
                              ) : (
                                <>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      mb: 1.5,
                                    }}
                                  >
                                    Adoption Fee:{" "}
                                    <strong>
                                      ₹
                                      {
                                        pet.adoptionFee
                                      }
                                    </strong>
                                  </Typography>

                                  <Button
                                    variant="contained"
                                    fullWidth
                                    disabled={
                                      paymentLoadingId ===
                                      application._id
                                    }
                                    onClick={() =>
                                      handlePayment(
                                        application,
                                      )
                                    }
                                    sx={{
                                      textTransform:
                                        "none",
                                      fontWeight: 700,
                                    }}
                                  >
                                    {paymentLoadingId ===
                                    application._id
                                      ? "Starting Payment..."
                                      : `Pay ₹${pet.adoptionFee}`}
                                  </Button>
                                </>
                              )}
                            </Box>
                          )}
                        </>
                      )}

                      {application.status ===
                        "rejected" && (
                        <Alert
                          severity="error"
                          sx={{
                            mt: 2,
                          }}
                        >
                          This adoption application
                          was rejected.
                        </Alert>
                      )}

                      {application.status ===
                        "completed" && (
                        <Alert
                          severity="info"
                          sx={{
                            mt: 2,
                          }}
                        >
                          This adoption has been
                          completed.
                        </Alert>
                      )}

                      <Box
                        sx={{
                          mt: "auto",
                          pt: 3,
                        }}
                      >
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

                        {application.status ===
                          "pending" && (
                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={() =>
                              handleCancel(
                                application._id,
                              )
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
                    Browse available pets and
                    submit your first adoption
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