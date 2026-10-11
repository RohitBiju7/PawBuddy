import React, { useEffect, useState } from "react";

import axiosInstance from "../services/axiosInterceptor";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlineRoundedIcon from "@mui/icons-material/LockOutlineRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canEdit = user && ["adopter", "staff"].includes(user.role);

  const fetchProfile = async () => {
    try {
      setError("");

      const response = await axiosInstance.get("/users/profile");
      const profileUser = response.data.user;

      setUser(profileUser);
      setFormData({
        name: profileUser.name || "",
        email: profileUser.email || "",
        phone: profileUser.phone || "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load profile. Please try again.",
      );
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setError("");
    setSuccess("");

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });

    setEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });

    setError("");
    setSuccess("");
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!formData.name.trim()) {
        setError("Name is required.");
        return;
      }

      if (!formData.email.trim()) {
        setError("Email is required.");
        return;
      }

      const response = await axiosInstance.patch("/users/profile", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });

      const updatedUser = response.data.user;

      setUser(updatedUser);
      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
      });

      // Keep locally stored user details in sync, preserving existing fields.
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          ...updatedUser,
        }),
      );

      setEditing(false);
      setSuccess(response.data.message || "Profile updated successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (error && !user) {
    return (
      <Container
        maxWidth="sm"
        sx={{ minHeight: "60vh", display: "flex", alignItems: "center", py: 6 }}
      >
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Alert severity="error">{error}</Alert>
          <Button variant="outlined" onClick={fetchProfile}>
            Try Again
          </Button>
        </Stack>
      </Container>
    );
  }

  if (!user) {
    return (
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "60vh", backgroundColor: "background.default" }}
      >
        <CircularProgress color="primary" />
        <Typography color="text.secondary">Loading your profile...</Typography>
      </Stack>
    );
  }

  const roleLabel =
    user.role === "admin"
      ? "Administrator"
      : user.role === "staff"
        ? "Shelter Staff"
        : user.role === "adopter"
          ? "Adopter"
          : user.role || "Member";

  const accountInitial = user.name?.trim()?.charAt(0)?.toUpperCase() || "P";

  const detailItems = [
    {
      label: "Full name",
      value: user.name || "Not provided",
      icon: <BadgeRoundedIcon />,
    },
    {
      label: "Email address",
      value: user.email || "Not provided",
      icon: <EmailOutlinedIcon />,
    },
    {
      label: "Phone number",
      value: user.phone || "Not provided",
      icon: <PhoneOutlinedIcon />,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 78px)",
        backgroundColor: "background.default",
        pb: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
        {/* Page banner */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: "22px", md: "28px" },
            background:
              "linear-gradient(118deg, #E7F4EC 0%, #F6FAF7 58%, #FFF3EA 100%)",
            border: "1px solid #DDEBE3",
            p: { xs: 3, sm: 4, md: 5 },
            mb: 3,
          }}
        >
          <PetsRoundedIcon
            aria-hidden="true"
            sx={{
              position: "absolute",
              right: { xs: -40, md: 35 },
              top: -55,
              fontSize: { xs: 170, md: 245 },
              transform: "rotate(-18deg)",
              color: "rgba(47, 125, 109, 0.06)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <AccountCircleRoundedIcon
                sx={{ color: "primary.main", fontSize: 19 }}
              />
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  letterSpacing: "0.13em",
                }}
              >
                YOUR PAWBUDDY ACCOUNT
              </Typography>
            </Stack>

            <Typography
              component="h1"
              sx={{
                color: "text.primary",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                fontSize: { xs: "2.15rem", sm: "2.75rem", md: "3.15rem" },
                lineHeight: 1.16,
                mb: 1.5,
              }}
            >
              My <Box component="span" sx={{ color: "primary.main" }}>Profile</Box>
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ lineHeight: 1.8, maxWidth: 580 }}
            >
              {canEdit
                ? "Your personal space at PawBuddy. Keep your contact information up to date and manage your account details."
                : "View your PawBuddy account information and account status."}
            </Typography>
          </Box>
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

        {/* Identity section */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: "22px",
            border: "1px solid #E3EBE7",
            boxShadow: "0 6px 24px rgba(39, 81, 62, 0.045)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={3}
          >
            <Stack direction="row" alignItems="center" spacing={2.25} sx={{ minWidth: 0 }}>
              <Avatar
                sx={{
                  width: { xs: 68, sm: 78 },
                  height: { xs: 68, sm: 78 },
                  flexShrink: 0,
                  background: "linear-gradient(145deg, #2F7D6D, #63B49D)",
                  color: "#FFFFFF",
                  fontSize: { xs: "1.8rem", sm: "2rem" },
                  fontWeight: 800,
                  boxShadow: "0 7px 16px rgba(47, 125, 109, 0.2)",
                }}
              >
                {accountInitial}
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, color: "text.primary", overflowWrap: "anywhere", mb: 0.75 }}
                >
                  {user.name || "PawBuddy Member"}
                </Typography>
                <Chip
                  size="small"
                  label={roleLabel}
                  icon={<VerifiedUserRoundedIcon />}
                  sx={{
                    bgcolor: "#E4F3EB",
                    color: "#236B55",
                    fontWeight: 750,
                    "& .MuiChip-icon": { color: "inherit", fontSize: 16 },
                  }}
                />
              </Box>
            </Stack>

            {canEdit && !editing && (
              <Button
                variant="contained"
                startIcon={<EditRoundedIcon />}
                onClick={handleEdit}
                sx={{
                  px: 3,
                  py: 1.2,
                  alignSelf: { xs: "stretch", sm: "center" },
                  borderRadius: "12px",
                }}
              >
                Edit Profile
              </Button>
            )}
          </Stack>
        </Paper>

        <Grid container spacing={3} alignItems="stretch">
          {/* Personal information */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                height: "100%",
                borderRadius: "22px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E3EBE7",
                boxShadow: "0 6px 24px rgba(39, 81, 62, 0.045)",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{ mb: 2.5 }}
              >
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: "14px",
                    bgcolor: "#E5F3EC",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccountCircleRoundedIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Personal Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {editing ? "Update your contact details" : "Your account contact details"}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              {editing ? (
                <Stack spacing={2.5}>
                  <TextField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    disabled={saving}
                  />
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    disabled={saving}
                  />
                  <TextField
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    disabled={saving}
                  />

                  <Divider sx={{ pt: 0.5 }} />

                  <Stack
                    direction={{ xs: "column-reverse", sm: "row" }}
                    spacing={1.5}
                    justifyContent="flex-end"
                  >
                    <Button
                      variant="outlined"
                      startIcon={<CloseRoundedIcon />}
                      onClick={handleCancel}
                      disabled={saving}
                      sx={{ px: 3, py: 1.2 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={saving ? <CircularProgress size={17} color="inherit" /> : <SaveRoundedIcon />}
                      onClick={handleSave}
                      disabled={saving}
                      sx={{ px: 3, py: 1.2 }}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack spacing={2}>
                  {detailItems.map((item) => (
                    <Stack
                      key={item.label}
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{
                        p: 2,
                        minWidth: 0,
                        borderRadius: "15px",
                        bgcolor: "#F8FBF9",
                        border: "1px solid #E9F0EC",
                      }}
                    >
                      <Box
                        sx={{
                          width: 43,
                          height: 43,
                          borderRadius: "13px",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "#E8F4ED",
                          color: "primary.main",
                          "& svg": { fontSize: 21 },
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mb: 0.35, fontWeight: 600 }}
                        >
                          {item.label}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "text.primary",
                            fontWeight: 700,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>

          {/* Account details */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                height: "100%",
                borderRadius: "22px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E3EBE7",
                boxShadow: "0 6px 24px rgba(39, 81, 62, 0.045)",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 2.5 }}>
                <VerifiedUserRoundedIcon sx={{ color: "primary.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Account Overview
                </Typography>
              </Stack>

              <Divider sx={{ mb: 2.5 }} />

              <Box
                sx={{
                  p: 2,
                  border: "1px solid #E2EDE6",
                  borderRadius: "15px",
                  bgcolor: "#F5FAF7",
                  mb: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", fontWeight: 700, mb: 1 }}
                >
                  Account Role
                </Typography>
                <Chip
                  label={roleLabel}
                  sx={{ bgcolor: "#E1F1E8", color: "#246A52", fontWeight: 750 }}
                />
              </Box>

              {user.isActive !== undefined && (
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid #E2EDE6",
                    borderRadius: "15px",
                    bgcolor: "#F5FAF7",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", fontWeight: 700, mb: 1 }}
                  >
                    Account Status
                  </Typography>
                  <Chip
                    label={user.isActive ? "Active" : "Inactive"}
                    icon={user.isActive ? <CheckCircleRoundedIcon /> : undefined}
                    color={user.isActive ? "success" : "error"}
                    variant="outlined"
                    sx={{
                      fontWeight: 750,
                      "& .MuiChip-icon": { color: "inherit", fontSize: 17 },
                    }}
                  />
                </Box>
              )}

              <Box
                sx={{
                  p: 2.25,
                  borderRadius: "15px",
                  bgcolor: "#FFF7F2",
                  border: "1px solid #F6E9DE",
                  display: "flex",
                  gap: 1.25,
                  alignItems: "flex-start",
                }}
              >
                <LockOutlineRoundedIcon
                  sx={{ color: "#CA8367", fontSize: 20, mt: 0.2, flexShrink: 0 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  {canEdit
                    ? "Your changes are saved securely to your PawBuddy account."
                    : "Administrator account details are view-only on this page."}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;
