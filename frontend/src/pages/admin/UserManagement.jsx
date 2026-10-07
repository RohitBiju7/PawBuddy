import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInterceptor";

import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/users");

      setUsers(response.data.users || response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load users. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      await axiosInstance.patch(`/users/${userId}/status`, {
        isActive: !currentStatus,
      });

      fetchUsers();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update user status.",
      );
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
            User Management
          </Typography>

          <Typography color="text.secondary">
            View PawBuddy users and manage account status.
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
            }}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              minHeight: "300px",
            }}
          >
            <CircularProgress />
          </Stack>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              overflowX: "auto",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Role</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong>Action</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.map((user) => {
                  const isCurrentUser =
                    user._id === currentUser?._id ||
                    user._id === currentUser?.id;

                  return (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>

                      <TableCell
                        sx={{
                          wordBreak: "break-word",
                        }}
                      >
                        {user.email}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={user.role}
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            backgroundColor: "#DCEFE8",
                            color: "primary.main",
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={user.isActive ? "Active" : "Inactive"}
                          size="small"
                          color={user.isActive ? "success" : "error"}
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color={user.isActive ? "secondary" : "primary"}
                          disabled={isCurrentUser}
                          onClick={() =>
                            handleStatusChange(user._id, user.isActive)
                          }
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                        >
                          {isCurrentUser
                            ? "Current Account"
                            : user.isActive
                              ? "Deactivate"
                              : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {users.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{
                        py: 4,
                        color: "text.secondary",
                      }}
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default UserManagement;
