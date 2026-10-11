import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInterceptor";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

const CreateStaff = () => {
  const [formData, setFormData] = useState({ ...emptyForm });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setError("");
    setSuccess("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await axiosInstance.post("/users/staff", formData);

      setSuccess(
        response.data.message ||
          "Shelter staff account created successfully.",
      );

      setFormData({ ...emptyForm });
      setShowPassword(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create staff account.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputIconStyle = {
    fontSize: 20,
    color: "#88A094",
  };

  const benefits = [
    {
      title: "Pet management",
      description: "Add pet profiles and manage existing listings.",
    },
    {
      title: "Adoption applications",
      description: "Review requests and coordinate adoption progress.",
    },
    {
      title: "Appointments",
      description: "Review and manage pet visits and meetings.",
    },
  ];

  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: "background.default",
        pb: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
        {/* Page introduction */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 3, sm: 4, md: 5 },
            mb: 4,
            borderRadius: { xs: "22px", md: "28px" },
            background:
              "linear-gradient(120deg, #E8F5EE 0%, #F7FBF8 57%, #FFF4EC 100%)",
            border: "1px solid #DDEBE3",
          }}
        >
          <PersonAddAltRoundedIcon
            aria-hidden="true"
            sx={{
              position: "absolute",
              right: { xs: -28, md: 40 },
              top: -35,
              fontSize: { xs: 150, md: 215 },
              color: "rgba(47,125,109,0.065)",
              transform: "rotate(-12deg)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <PetsRoundedIcon
                sx={{ fontSize: 19, color: "primary.main" }}
              />
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  color: "primary.main",
                }}
              >
                ADMIN WORKSPACE
              </Typography>
            </Stack>

            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                color: "text.primary",
                letterSpacing: "-0.035em",
                lineHeight: 1.15,
                fontSize: { xs: "2.1rem", sm: "2.7rem", md: "3.1rem" },
                mb: 2,
              }}
            >
              Create <Box component="span" sx={{ color: "primary.main" }}>Shelter Staff</Box>
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ maxWidth: 610, lineHeight: 1.8 }}
            >
              Add a member to your shelter team. New staff members can help
              manage pet listings, adoption applications, and appointments.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3} alignItems="stretch">
          {/* Staff creation form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                p: { xs: 3, sm: 4, md: 4.5 },
                backgroundColor: "#FFFFFF",
                borderRadius: "22px",
                border: "1px solid #E1EBE5",
                boxShadow: "0 8px 28px rgba(39,81,62,0.055)",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "15px",
                    backgroundColor: "#E4F3EB",
                    color: "primary.main",
                  }}
                >
                  <BadgeRoundedIcon sx={{ fontSize: 25 }} />
                </Box>

                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 800, letterSpacing: "-0.025em" }}
                  >
                    Staff account details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enter the new staff member's information.
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 3 }} />

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert
                  severity="success"
                  icon={<CheckCircleRoundedIcon />}
                  sx={{ mb: 3 }}
                >
                  {success}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Full name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    autoComplete="name"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineRoundedIcon sx={inputIconStyle} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    label="Email address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    fullWidth
                    autoComplete="email"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon sx={inputIconStyle} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    label="Phone number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    fullWidth
                    autoComplete="tel"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneOutlinedIcon sx={inputIconStyle} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    fullWidth
                    autoComplete="new-password"
                    helperText="Minimum 6 characters"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon sx={inputIconStyle} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={() => setShowPassword((current) => !current)}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              aria-pressed={showPassword}
                            >
                              {showPassword ? (
                                <VisibilityOffOutlinedIcon />
                              ) : (
                                <VisibilityOutlinedIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={submitting}
                    startIcon={
                      submitting ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <PersonAddAltRoundedIcon />
                      )
                    }
                    sx={{
                      mt: 1,
                      minHeight: 52,
                      py: 1.4,
                      fontSize: "0.98rem",
                      fontWeight: 800,
                      borderRadius: "12px",
                    }}
                  >
                    {submitting ? "Creating Account..." : "Create Staff Account"}
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* Information sidebar */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                p: { xs: 3, sm: 4 },
                borderRadius: "22px",
                overflow: "hidden",
                position: "relative",
                border: "1px solid #DDEBE2",
                background:
                  "linear-gradient(155deg, #E8F5ED 0%, #F5FAF6 62%, #FFF6EE 100%)",
              }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  position: "absolute",
                  right: -75,
                  top: -65,
                  backgroundColor: "rgba(168,213,197,0.28)",
                  pointerEvents: "none",
                }}
              />

              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "16px",
                    color: "primary.main",
                    backgroundColor: "#DCEFE4",
                    mb: 2.5,
                  }}
                >
                  <ShieldOutlinedIcon sx={{ fontSize: 28 }} />
                </Box>

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, mb: 1.2, color: "text.primary" }}
                >
                  What can shelter staff do?
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.8, mb: 3 }}
                >
                  Staff accounts have access to the shelter management tools
                  needed to support the adoption journey.
                </Typography>

                <Stack spacing={2.5}>
                  {benefits.map((benefit) => (
                    <Stack
                      key={benefit.title}
                      direction="row"
                      spacing={1.4}
                      alignItems="flex-start"
                    >
                      <CheckCircleRoundedIcon
                        sx={{ color: "primary.main", fontSize: 22, mt: 0.15 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 800, mb: 0.4 }}
                        >
                          {benefit.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.7 }}
                        >
                          {benefit.description}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>

                <Divider sx={{ my: 3, borderColor: "#DAE8DF" }} />

                <Typography
                  variant="body2"
                  sx={{ mb: 2, lineHeight: 1.75, color: "#61756C" }}
                >
                  Staff accounts are created by administrators. Share their
                  sign-in details securely after creation.
                </Typography>

                <Button
                  component={Link}
                  to="/admin/users"
                  variant="outlined"
                  endIcon={<ArrowForwardRoundedIcon />}
                  startIcon={<PeopleOutlineRoundedIcon />}
                  sx={{
                    width: "100%",
                    py: 1.25,
                    borderRadius: "11px",
                    backgroundColor: "rgba(255,255,255,0.75)",
                  }}
                >
                  View User Management
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreateStaff;
