import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInterceptor";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import pawBuddyHero from "../assets/register-login.png";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting || success) return;

    setError("");
    setSuccess("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await axiosInstance.post("/users/register", formData);

      setSuccess(response.data.message || "Registration successful.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
      setSubmitting(false);
    }
  };

  const inputIconStyle = {
    color: "#819D8F",
    fontSize: 20,
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        py: { xs: 5, md: 8 },
        px: { xs: 2, sm: 3 },
        background:
          "radial-gradient(circle at 8% 12%, rgba(168,213,197,0.27), transparent 32%), radial-gradient(circle at 94% 85%, rgba(242,140,122,0.12), transparent 30%), #F7FAF9",
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Paper
          elevation={0}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.95fr 1.05fr" },
            minHeight: { md: 700 },
            borderRadius: { xs: "24px", md: "30px" },
            overflow: "hidden",
            border: "1px solid #DFEBE4",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 24px 70px rgba(32,93,81,0.085)",
          }}
        >
          {/* Matching PawBuddy illustration panel */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              position: "relative",
              flexDirection: "column",
              justifyContent: "space-between",
              minWidth: 0,
              overflow: "hidden",
              background:
                "linear-gradient(155deg, #E2F2E9 0%, #F2F8F1 48%, #FFF3E7 100%)",
              p: { md: 4, lg: 5 },
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                position: "absolute",
                top: -95,
                right: -95,
                width: 280,
                height: 280,
                borderRadius: "50%",
                border: "50px solid rgba(47,125,109,0.06)",
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 3, color: "primary.main" }}
              >
                <PetsRoundedIcon sx={{ fontSize: 20 }} />
                <Typography
                  variant="overline"
                  sx={{ fontWeight: 800, letterSpacing: "0.13em" }}
                >
                  JOIN THE PAWBUDDY FAMILY
                </Typography>
              </Stack>

              <Typography
                component="h1"
                sx={{
                  color: "#223532",
                  fontWeight: 800,
                  letterSpacing: "-0.045em",
                  fontSize: { md: "2.55rem", lg: "3.15rem" },
                  lineHeight: 1.17,
                  maxWidth: 440,
                  mb: 2.5,
                }}
              >
                A little love can change a {" "}
                <Box component="span" sx={{ color: "primary.main" }}>
                  whole life.
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: "#60746D",
                  maxWidth: 400,
                  lineHeight: 1.85,
                  fontSize: { md: "0.98rem", lg: "1.05rem" },
                }}
              >
                Create your adopter account to explore pets, connect with
                shelters, and begin the journey toward a forever friendship.
              </Typography>
            </Box>

            <Box
              component="img"
              src={pawBuddyHero}
              alt="Illustration of a dog and cat waiting beside a loving home"
              sx={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                height: { md: 270, lg: 315 },
                objectFit: "cover",
                objectPosition: "right center",
                mt: 3,
                borderRadius: "18px",
              }}
            />

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ position: "relative", zIndex: 1, mt: 2 }}
            >
              <FavoriteRoundedIcon
                sx={{ fontSize: 17, color: "secondary.main" }}
              />
              <Typography
                variant="caption"
                sx={{ color: "#557568", fontWeight: 700 }}
              >
                Little paws. Big love. Forever homes.
              </Typography>
            </Stack>
          </Box>

          {/* Account registration form */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
              maxWidth: 540,
              mx: "auto",
              p: { xs: 3, sm: 5, md: 5, lg: 7 },
            }}
          >
            <Box
              sx={{
                width: 58,
                height: 58,
                borderRadius: "17px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#E5F3EB",
                color: "primary.main",
                mb: 3,
              }}
            >
              <PetsRoundedIcon sx={{ fontSize: 29 }} />
            </Box>

            <Typography
              component="h2"
              sx={{
                color: "text.primary",
                fontSize: { xs: "2rem", sm: "2.35rem" },
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.2,
                mb: 1,
              }}
            >
              Create your account
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ lineHeight: 1.75, mb: 3.5 }}
            >
              Join PawBuddy and take the first step toward finding your new
              companion.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success} Redirecting to login...
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.25}>
                <TextField
                  label="Full name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  autoComplete="name"
                  required
                  fullWidth
                  disabled={submitting}
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
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                  fullWidth
                  disabled={submitting}
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
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  required
                  fullWidth
                  disabled={submitting}
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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create your password"
                  autoComplete="new-password"
                  required
                  fullWidth
                  disabled={submitting}
                  helperText="Use at least 6 characters."
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
                            onClick={() =>
                              setShowPassword((current) => !current)
                            }
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            aria-pressed={showPassword}
                            disabled={submitting}
                            size="small"
                            sx={{ color: "#708B7F" }}
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
                  fullWidth
                  size="large"
                  disabled={submitting || Boolean(success)}
                  endIcon={
                    submitting ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <ArrowForwardRoundedIcon />
                    )
                  }
                  sx={{
                    py: 1.55,
                    mt: 0.5,
                    borderRadius: "12px",
                    fontSize: "1rem",
                    fontWeight: 800,
                  }}
                >
                  {success
                    ? "Account Created"
                    : submitting
                      ? "Creating Account..."
                      : "Create Account"}
                </Button>
              </Stack>
            </Box>

            <Stack
              direction="row"
              spacing={0.8}
              alignItems="center"
              justifyContent="center"
              flexWrap="wrap"
              sx={{ mt: 3.5, textAlign: "center" }}
            >
              <Typography variant="body2" color="text.secondary">
                Already have an account?
              </Typography>

              <Typography
                component={Link}
                to="/login"
                variant="body2"
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  fontWeight: 800,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Sign in
              </Typography>
            </Stack>

            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: "1px solid #E9F0EC",
                textAlign: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                Your next best friend could be waiting for you.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
