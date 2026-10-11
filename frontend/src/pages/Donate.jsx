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
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";

import {
  createDonationOrder,
  verifyDonationPayment,
  getMyDonations,
} from "../services/paymentService";

const Donate = () => {
  const [amount, setAmount] =
    useState("");

  const [donations, setDonations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [paying, setPaying] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const quickAmounts = [
    100,
    500,
    1000,
    2000,
  ];

  const loadRazorpayScript = () => {
    return new Promise(
      (resolve) => {
        if (
          window.Razorpay
        ) {
          resolve(true);
          return;
        }

        const script =
          document.createElement(
            "script",
          );

        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () =>
          resolve(true);

        script.onerror = () =>
          resolve(false);

        document.body.appendChild(
          script,
        );
      },
    );
  };

  const fetchDonations =
    async () => {
      try {
        setLoading(true);

        const data =
          await getMyDonations();

        setDonations(
          data.donations || [],
        );
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Failed to load donation history.",
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleDonate =
    async () => {
      try {
        setError("");
        setSuccess("");

        const donationAmount =
          Number(amount);

        if (
          !Number.isFinite(
            donationAmount,
          ) ||
          donationAmount < 1
        ) {
          setError(
            "Please enter a valid donation amount.",
          );
          return;
        }

        setPaying(true);

        const scriptLoaded =
          await loadRazorpayScript();

        if (!scriptLoaded) {
          setError(
            "Razorpay checkout could not be loaded.",
          );
          setPaying(false);
          return;
        }

        const data =
          await createDonationOrder(
            donationAmount,
          );

        const options = {
          key: data.keyId,

          amount:
            data.order.amount,

          currency:
            data.order.currency,

          name: "PawBuddy",

          description:
            "Donation to support pet care and adoption",

          order_id:
            data.order.id,

          handler: async (
            response,
          ) => {
            try {
              const verifyData =
                await verifyDonationPayment(
                  {
                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature,
                  },
                );

              setSuccess(
                verifyData.message ||
                  "Thank you for your donation!",
              );

              setAmount("");

              await fetchDonations();
            } catch (error) {
              setError(
                error.response?.data
                  ?.message ||
                  "Donation verification failed.",
              );
            } finally {
              setPaying(false);
            }
          },

          modal: {
            ondismiss: () => {
              setPaying(false);
            },
          },

          theme: {
            color: "#2F7D6D",
          },
        };

        const razorpay =
          new window.Razorpay(
            options,
          );

        razorpay.open();
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Failed to start donation payment.",
        );

        setPaying(false);
      }
    };

  const formatDate = (
    date,
  ) => {
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
      <Container maxWidth="md">
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
            Donate to PawBuddy
          </Typography>

          <Typography
            color="text.secondary"
          >
            Your contribution helps
            support pet care,
            shelter needs, and
            adoption services.
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
            borderRadius: 3,
            border:
              "1px solid",
            borderColor:
              "divider",
            mb: 4,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2.5,
                sm: 4,
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              Choose an amount
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Select a quick amount
              or enter your own
              donation.
            </Typography>

            <Stack
              direction="row"
              spacing={1.5}
              flexWrap="wrap"
              useFlexGap
              sx={{ mb: 3 }}
            >
              {quickAmounts.map(
                (
                  quickAmount,
                ) => (
                  <Button
                    key={
                      quickAmount
                    }
                    variant={
                      Number(
                        amount,
                      ) ===
                      quickAmount
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() =>
                      setAmount(
                        String(
                          quickAmount,
                        ),
                      )
                    }
                    sx={{
                      textTransform:
                        "none",
                      fontWeight:
                        600,
                    }}
                  >
                    ₹
                    {
                      quickAmount
                    }
                  </Button>
                ),
              )}
            </Stack>

            <TextField
              label="Custom Amount"
              type="number"
              value={amount}
              onChange={(event) =>
                setAmount(
                  event.target.value,
                )
              }
              fullWidth
              inputProps={{
                min: 1,
                step: "0.01",
              }}
              placeholder="Enter donation amount"
            />

            <Button
              variant="contained"
              fullWidth
              disabled={paying}
              onClick={
                handleDonate
              }
              sx={{
                mt: 3,
                py: 1.2,
                textTransform:
                  "none",
                fontWeight: 700,
              }}
            >
              {paying
                ? "Opening Payment..."
                : amount
                  ? `Donate ₹${amount}`
                  : "Donate"}
            </Button>
          </CardContent>
        </Card>

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
                sm: 4,
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
              My Donations
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Your successful
              donations to PawBuddy.
            </Typography>

            {loading ? (
              <Stack
                alignItems="center"
                sx={{ py: 4 }}
              >
                <CircularProgress />
              </Stack>
            ) : donations.length ===
              0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  py: 3,
                  textAlign:
                    "center",
                }}
              >
                No donations yet.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {donations.map(
                  (
                    donation,
                    index,
                  ) => (
                    <React.Fragment
                      key={
                        donation._id
                      }
                    >
                      <Stack
                        direction={{
                          xs:
                            "column",
                          sm: "row",
                        }}
                        justifyContent="space-between"
                        alignItems={{
                          xs:
                            "flex-start",
                          sm:
                            "center",
                        }}
                        spacing={1}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontWeight:
                                700,
                            }}
                          >
                            ₹
                            {
                              donation.amount
                            }
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {formatDate(
                              donation.paidAt ||
                                donation.createdAt,
                            )}
                          </Typography>
                        </Box>

                        <Chip
                          label="Successful"
                          color="success"
                          size="small"
                          sx={{
                            fontWeight:
                              600,
                          }}
                        />
                      </Stack>

                      {index <
                        donations.length -
                          1 && (
                        <Divider />
                      )}
                    </React.Fragment>
                  ),
                )}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Donate;