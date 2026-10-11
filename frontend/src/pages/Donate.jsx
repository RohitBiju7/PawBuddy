import React, { useEffect, useState } from "react";

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
  Grid,
  InputAdornment,
} from "@mui/material";

import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import {
  createDonationOrder,
  verifyDonationPayment,
  getMyDonations,
} from "../services/paymentService";

const QUICK_AMOUNTS = [100, 500, 1000, 2000];

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const Donate = () => {
  const [amount, setAmount] = useState("");
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchDonations = async () => {
    try {
      setLoading(true);

      const data = await getMyDonations();
      setDonations(data.donations || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load donation history.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleDonate = async () => {
    try {
      setError("");
      setSuccess("");

      const donationAmount = Number(amount);

      if (!Number.isFinite(donationAmount) || donationAmount < 1) {
        setError("Please enter a valid donation amount.");
        return;
      }

      setPaying(true);

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        setError("Razorpay checkout could not be loaded.");
        setPaying(false);
        return;
      }

      const data = await createDonationOrder(donationAmount);

      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "PawBuddy",
        description: "Donation to support pet care and adoption",
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const verifyData = await verifyDonationPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setSuccess(
              verifyData.message || "Thank you for your donation!",
            );
            setAmount("");
            await fetchDonations();
          } catch (error) {
            setError(
              error.response?.data?.message ||
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

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to start donation payment.",
      );
      setPaying(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalDonated = donations.reduce(
    (total, donation) => total + Number(donation.amount || 0),
    0,
  );

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 78px)",
        backgroundColor: "background.default",
        pb: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
        {/* Donation introduction */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 3, sm: 4, md: 5 },
            mb: 4,
            borderRadius: { xs: "22px", md: "28px" },
            background:
              "linear-gradient(115deg, #E7F5ED 0%, #F5FAF6 54%, #FFF2EB 100%)",
            border: "1px solid #DDEBE3",
          }}
        >
          <FavoriteRoundedIcon
            aria-hidden="true"
            sx={{
              position: "absolute",
              right: { xs: -40, md: 40 },
              top: { xs: -55, md: -65 },
              fontSize: { xs: 180, md: 260 },
              color: "rgba(242,140,122,0.13)",
              transform: "rotate(-16deg)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1, maxWidth: 660 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <VolunteerActivismRoundedIcon
                sx={{ fontSize: 20, color: "primary.main" }}
              />
              <Typography
                variant="overline"
                sx={{
                  color: "primary.main",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                }}
              >
                MAKE A DIFFERENCE
              </Typography>
            </Stack>

            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.14,
                fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.25rem" },
                color: "text.primary",
                mb: 2,
              }}
            >
              A little kindness.
              <Box component="span" sx={{ display: "block", color: "primary.main" }}>
                A lot of love.
              </Box>
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ fontSize: { xs: "0.98rem", sm: "1.06rem" }, lineHeight: 1.85 }}
            >
              Your contribution helps support pet care, shelter needs,
              and adoption services. Every gesture of generosity
              helps us work toward happier, healthier lives for pets.
            </Typography>
          </Box>
        </Box>

        {/* Payment feedback */}
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

        <Grid container spacing={3} alignItems="stretch" sx={{ mb: 4 }}>
          {/* Donation form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card
              sx={{
                height: "100%",
                borderRadius: "23px",
                border: "1px solid #E2ECE6",
                boxShadow: "0 8px 28px rgba(39,81,62,0.055)",
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4 }, "&:last-child": { pb: { xs: 3, sm: 4 } } }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      flexShrink: 0,
                      borderRadius: "15px",
                      backgroundColor: "#E4F3EB",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FavoriteRoundedIcon sx={{ color: "primary.main", fontSize: 27 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
                      Make a donation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Choose an amount that feels right for you.
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
                  Select an amount
                </Typography>

                <Grid container spacing={1.5} sx={{ mb: 3 }}>
                  {QUICK_AMOUNTS.map((quickAmount) => {
                    const selected = Number(amount) === quickAmount;
                    return (
                      <Grid size={{ xs: 6, sm: 3 }} key={quickAmount}>
                        <Button
                          fullWidth
                          variant={selected ? "contained" : "outlined"}
                          onClick={() => setAmount(String(quickAmount))}
                          disabled={paying}
                          aria-pressed={selected}
                          sx={{
                            minHeight: 55,
                            fontSize: "1.05rem",
                            fontWeight: 800,
                            borderRadius: "13px",
                            borderColor: selected ? "primary.main" : "#D4E8DC",
                            backgroundColor: selected ? "primary.main" : "#F7FAF8",
                            "&:hover": {
                              borderColor: "primary.main",
                              backgroundColor: selected ? "primary.dark" : "#EBF5EF",
                            },
                          }}
                        >
                          {formatCurrency(quickAmount)}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>

                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
                  Or enter your own amount
                </Typography>

                <TextField
                  label="Custom Amount"
                  type="number"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  fullWidth
                  disabled={paying}
                  placeholder="Enter donation amount"
                  slotProps={{
                    htmlInput: { min: 1, step: "0.01" },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
                            ₹
                          </Typography>
                        </InputAdornment>
                      ),
                    },
                  }}
                  helperText="Minimum donation: ₹1"
                />

                <Box
                  sx={{
                    mt: 3,
                    p: 2.25,
                    borderRadius: "14px",
                    backgroundColor: "#F0F8F3",
                    border: "1px solid #DDEDE2",
                  }}
                >
                  <Stack direction="row" spacing={1.2} alignItems="flex-start">
                    <CheckCircleRoundedIcon sx={{ color: "primary.main", fontSize: 21, mt: 0.15 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                      Payments are processed through Razorpay. Your donation
                      will appear in your history once payment is verified.
                    </Typography>
                  </Stack>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  disabled={paying}
                  onClick={handleDonate}
                  startIcon={paying ? <CircularProgress size={18} color="inherit" /> : <FavoriteRoundedIcon />}
                  endIcon={!paying ? <ArrowForwardRoundedIcon /> : undefined}
                  sx={{
                    mt: 3,
                    py: 1.55,
                    fontSize: "1rem",
                    fontWeight: 800,
                    borderRadius: "12px",
                  }}
                >
                  {paying
                    ? "Opening Payment..."
                    : amount
                      ? `Donate ${formatCurrency(amount)}`
                      : "Donate Now"}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Warm supporting panel */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                position: "relative",
                height: "100%",
                minHeight: { xs: 310, md: 470 },
                overflow: "hidden",
                borderRadius: "23px",
                background: "linear-gradient(145deg, #205D51 0%, #2F7D6D 100%)",
                p: { xs: 3.5, sm: 4.5 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                color: "#FFFFFF",
              }}
            >
              <PetsRoundedIcon
                aria-hidden="true"
                sx={{
                  position: "absolute",
                  bottom: -60,
                  right: -30,
                  fontSize: { xs: 220, md: 280 },
                  color: "rgba(255,255,255,0.095)",
                  transform: "rotate(-15deg)",
                  pointerEvents: "none",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: -100,
                  right: -100,
                  width: 300,
                  height: 300,
                  border: "45px solid rgba(168,213,197,0.10)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                }}
              />

              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    width: 55,
                    height: 55,
                    borderRadius: "17px",
                    backgroundColor: "rgba(255,255,255,0.13)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 27, color: "#F8BEAC" }} />
                </Box>

                <Typography variant="overline" sx={{ color: "#BFE2D4", fontWeight: 800, letterSpacing: "0.13em" }}>
                  MORE THAN A DONATION
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: "-0.035em",
                    lineHeight: 1.25,
                    mt: 1.5,
                    mb: 2,
                    maxWidth: 340,
                    fontSize: { xs: "1.9rem", sm: "2.2rem" },
                  }}
                >
                  Be part of their happy ending.
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.83)", lineHeight: 1.85, maxWidth: 340 }}>
                  Small acts of kindness create room for care, comfort,
                  and new beginnings. Thank you for supporting pets
                  on their journey home.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ position: "relative", zIndex: 1, mt: 4 }}>
                <FavoriteRoundedIcon sx={{ color: "#F6AC9A", fontSize: 19 }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#D8EFE4" }}>
                  Little paws. Big love. Forever homes.
                </Typography>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        {/* Donation history */}
        <Card
          sx={{
            borderRadius: "23px",
            border: "1px solid #E2ECE6",
            boxShadow: "0 8px 28px rgba(39,81,62,0.045)",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 }, "&:last-child": { pb: { xs: 3, sm: 4 } } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 49,
                    height: 49,
                    borderRadius: "15px",
                    backgroundColor: "#E5F3EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PaymentsRoundedIcon sx={{ color: "primary.main", fontSize: 26 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
                    My Donations
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your successful contributions to PawBuddy.
                  </Typography>
                </Box>
              </Stack>

              {!loading && donations.length > 0 && (
                <Chip
                  icon={<FavoriteRoundedIcon />}
                  label={`${formatCurrency(totalDonated)} donated`}
                  sx={{
                    px: 0.5,
                    py: 2.3,
                    fontWeight: 800,
                    backgroundColor: "#E4F3EA",
                    color: "#2F7D6D",
                    "& .MuiChip-icon": { color: "inherit" },
                  }}
                />
              )}
            </Stack>

            <Divider sx={{ mb: 2.5 }} />

            {loading ? (
              <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                  Loading your donation history...
                </Typography>
              </Stack>
            ) : donations.length === 0 ? (
              <Box sx={{ py: 6, px: 2, textAlign: "center" }}>
                <Box
                  sx={{
                    mx: "auto",
                    mb: 2,
                    width: 76,
                    height: 76,
                    borderRadius: "22px",
                    backgroundColor: "#EAF5EE",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <VolunteerActivismRoundedIcon sx={{ fontSize: 39, color: "primary.main" }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Your kindness starts here
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  You haven’t made a donation yet. Your contributions will appear here.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1.5}>
                {donations.map((donation) => (
                  <Box
                    key={donation._id}
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      border: "1px solid #E5EEE8",
                      borderRadius: "15px",
                      backgroundColor: "#F9FCFA",
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={1.5}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            flexShrink: 0,
                            borderRadius: "13px",
                            backgroundColor: "#E4F3EB",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FavoriteRoundedIcon sx={{ color: "primary.main", fontSize: 23 }} />
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
                            {formatCurrency(donation.amount)}
                          </Typography>
                          <Stack direction="row" spacing={0.6} alignItems="center">
                            <CalendarMonthRoundedIcon sx={{ fontSize: 15, color: "text.secondary" }} />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(donation.paidAt || donation.createdAt)}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                      <Chip
                        label="Successful"
                        icon={<CheckCircleRoundedIcon />}
                        size="small"
                        sx={{
                          backgroundColor: "#E2F3E9",
                          color: "#246A52",
                          fontWeight: 800,
                          "& .MuiChip-icon": { color: "inherit" },
                        }}
                      />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Donate;
