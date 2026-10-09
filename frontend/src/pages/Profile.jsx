import React, {
  useEffect,
  useState,
} from "react";

import axiosInstance from "../services/axiosInterceptor";

import {
  Box,
  Paper,
  Typography,
  Alert,
  Stack,
  Chip,
  CircularProgress,
  Button,
  TextField,
} from "@mui/material";

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

  const canEdit =
    user &&
    ["adopter", "staff"].includes(
      user.role,
    );

  const fetchProfile = async () => {
    try {
      setError("");

      const response =
        await axiosInstance.get(
          "/users/profile",
        );

      const profileUser =
        response.data.user;

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
    const {
      name,
      value,
    } = event.target;

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

      const response =
        await axiosInstance.patch(
          "/users/profile",
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
          },
        );

      const updatedUser =
        response.data.user;

      setUser(updatedUser);

      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
      });

      /*
        Keep locally stored user details in sync.

        Preserve any fields that may already exist
        in localStorage while replacing updated ones.
      */
      const storedUser =
        JSON.parse(
          localStorage.getItem("user"),
        ) || {};

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          ...updatedUser,
        }),
      );

      setEditing(false);

      setSuccess(
        response.data.message ||
          "Profile updated successfully.",
      );
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
      <Box
        sx={{
          minHeight:
            "calc(100vh - 70px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:
            "background.default",
          px: 2,
        }}
      >
        <Alert
          severity="error"
          sx={{
            width: "100%",
            maxWidth: 600,
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          minHeight:
            "calc(100vh - 70px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:
            "background.default",
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
        >
          <CircularProgress color="primary" />

          <Typography
            sx={{
              color: "primary.main",
              fontWeight: 600,
            }}
          >
            Loading profile...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight:
          "calc(100vh - 70px)",
        backgroundColor:
          "background.default",
        px: 2,
        py: {
          xs: 3,
          sm: 5,
        },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 700,
          mx: "auto",
          p: {
            xs: 3,
            sm: 4,
          },
          borderRadius: 3,
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                mb: 1,
              }}
            >
              My Profile
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
              }}
            >
              {canEdit
                ? "View and manage your PawBuddy account details."
                : "View your PawBuddy account details."}
            </Typography>
          </Box>

          {canEdit && !editing && (
            <Button
              variant="contained"
              onClick={handleEdit}
              sx={{
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Edit Profile
            </Button>
          )}
        </Stack>

        {error && user && (
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

        <Stack spacing={3}>
          {editing ? (
            <>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
              />
            </>
          ) : (
            <>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 0.5,
                  }}
                >
                  Name
                </Typography>

                <Typography color="text.secondary">
                  {user.name}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 0.5,
                  }}
                >
                  Email
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    wordBreak:
                      "break-word",
                  }}
                >
                  {user.email}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 0.5,
                  }}
                >
                  Phone
                </Typography>

                <Typography color="text.secondary">
                  {user.phone ||
                    "Not provided"}
                </Typography>
              </Box>
            </>
          )}

          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              Role
            </Typography>

            <Chip
              label={user.role}
              sx={{
                backgroundColor:
                  "#DCEFE8",
                color: "primary.main",
                fontWeight: 600,
                textTransform:
                  "capitalize",
              }}
            />
          </Box>

          {user.isActive !== undefined && (
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Account Status
              </Typography>

              <Chip
                label={
                  user.isActive
                    ? "Active"
                    : "Inactive"
                }
                color={
                  user.isActive
                    ? "success"
                    : "error"
                }
                variant="outlined"
                sx={{
                  fontWeight: 600,
                }}
              />
            </Box>
          )}

          {editing && (
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
              justifyContent="flex-end"
              sx={{ pt: 1 }}
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={saving}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default Profile;