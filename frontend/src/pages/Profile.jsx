import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInterceptor";

import {
  Box,
  Paper,
  Typography,
  Alert,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        setUser(response.data.user);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load profile. Please try again."
        );
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 70px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "background.default",
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
          minHeight: "calc(100vh - 70px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "background.default",
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
        minHeight: "calc(100vh - 70px)",
        backgroundColor: "background.default",
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
        <Box
          sx={{
            mb: 4,
          }}
        >
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
            View your PawBuddy account details.
          </Typography>
        </Box>

        <Stack spacing={3}>
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
                wordBreak: "break-word",
              }}
            >
              {user.email}
            </Typography>
          </Box>

          {user.phone && (
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
                {user.phone}
              </Typography>
            </Box>
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
                backgroundColor: "#DCEFE8",
                color: "primary.main",
                fontWeight: 600,
                textTransform: "capitalize",
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
                label={user.isActive ? "Active" : "Inactive"}
                color={user.isActive ? "success" : "error"}
                variant="outlined"
                sx={{
                  fontWeight: 600,
                }}
              />
            </Box>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default Profile;