import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInterceptor";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const roleStyles = {
  admin: { backgroundColor: "#E9E6F7", color: "#62539B" },
  staff: { backgroundColor: "#E5F2F8", color: "#3B7997" },
  adopter: { backgroundColor: "#E4F3EA", color: "#2F7D6D" },
};

const roleLabel = (role) => {
  if (role === "staff") return "Shelter Staff";
  if (role === "admin") return "Administrator";
  if (role === "adopter") return "Adopter";
  return role || "Unknown";
};

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const currentUser = getCurrentUser();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/users");
      const userList = response.data?.users ?? response.data;

      setUsers(Array.isArray(userList) ? userList : []);
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

  const isCurrentAccount = (user) =>
    user._id === currentUser?._id ||
    user._id === currentUser?.id;

  const handleStatusChange = async (userId, currentStatus) => {
    const targetUser = users.find((user) => user._id === userId);

    if (!targetUser || isCurrentAccount(targetUser)) return;

    if (currentStatus) {
      const confirmed = window.confirm(
        `Deactivate ${targetUser.name || "this user"}'s account? They won't be able to use PawBuddy until the account is activated again.`,
      );

      if (!confirmed) return;
    }

    try {
      setUpdatingId(userId);
      setError("");
      setSuccess("");

      await axiosInstance.patch(`/users/${userId}/status`, {
        isActive: !currentStatus,
      });

      // The server has confirmed the update; reflect it immediately in the UI.
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === userId
            ? { ...user, isActive: !currentStatus }
            : user,
        ),
      );

      setSuccess(
        `${targetUser.name || "User"}'s account was ${
          currentStatus ? "deactivated" : "activated"
        } successfully.`,
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update user status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const statistics = [
    {
      label: "Total Users",
      value: users.length,
      icon: <PeopleRoundedIcon />,
      background: "#E4F3EA",
      color: "#2F7D6D",
    },
    {
      label: "Active Accounts",
      value: users.filter((user) => user.isActive).length,
      icon: <CheckCircleRoundedIcon />,
      background: "#E4F3EA",
      color: "#2F7D6D",
    },
    {
      label: "Inactive Accounts",
      value: users.filter((user) => !user.isActive).length,
      icon: <PersonOffRoundedIcon />,
      background: "#FBE9E6",
      color: "#C4675B",
    },
    {
      label: "Adopters",
      value: users.filter((user) => user.role === "adopter").length,
      icon: <PersonOutlineRoundedIcon />,
      background: "#FFF1E4",
      color: "#B57A3C",
    },
    {
      label: "Shelter Staff",
      value: users.filter((user) => user.role === "staff").length,
      icon: <BadgeRoundedIcon />,
      background: "#E6F1F7",
      color: "#4085A3",
    },
  ];

  const filteredUsers = users.filter((user) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      String(user.name || "").toLowerCase().includes(query) ||
      String(user.email || "").toLowerCase().includes(query);

    const matchesRole =
      roleFilter === "all" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const renderRoleChip = (user) => (
    <Chip
      label={roleLabel(user.role)}
      size="small"
      sx={{
        fontWeight: 750,
        ...(
          roleStyles[user.role] || {
            backgroundColor: "#EFF2F0",
            color: "#60746D",
          }
        ),
      }}
    />
  );

  const renderStatusChip = (user) => (
    <Chip
      size="small"
      icon={
        user.isActive ? (
          <CheckCircleRoundedIcon />
        ) : (
          <BlockRoundedIcon />
        )
      }
      label={user.isActive ? "Active" : "Inactive"}
      sx={{
        fontWeight: 750,
        backgroundColor: user.isActive ? "#E3F3E9" : "#FBE9E6",
        color: user.isActive ? "#2D765C" : "#BA6058",
        "& .MuiChip-icon": { color: "inherit", fontSize: 16 },
      }}
    />
  );

  const renderStatusButton = (user, fullWidth = false) => {
    const ownAccount = isCurrentAccount(user);
    const updating = updatingId === user._id;

    return (
      <Button
        variant={user.isActive ? "outlined" : "contained"}
        color={user.isActive ? "error" : "primary"}
        size="small"
        fullWidth={fullWidth}
        disabled={ownAccount || updatingId !== null}
        onClick={() => handleStatusChange(user._id, user.isActive)}
        startIcon={
          !ownAccount && !updating ? (
            user.isActive ? <BlockRoundedIcon /> : <CheckCircleRoundedIcon />
          ) : undefined
        }
        sx={{
          minWidth: fullWidth ? 0 : 150,
          py: 0.9,
          borderRadius: "10px",
          fontWeight: 750,
          whiteSpace: "nowrap",
        }}
      >
        {ownAccount
          ? "Current Account"
          : updating
            ? "Updating..."
            : user.isActive
              ? "Deactivate"
              : "Activate"}
      </Button>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 78px)",
        backgroundColor: "background.default",
        pb: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
        {/* Page header */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 3, sm: 4, md: 5 },
            mb: 4,
            borderRadius: { xs: "22px", md: "28px" },
            background:
              "linear-gradient(120deg, #E8F5EE 0%, #F7FBF8 58%, #FFF4EC 100%)",
            border: "1px solid #DDEBE3",
          }}
        >
          <ManageAccountsRoundedIcon
            aria-hidden="true"
            sx={{
              position: "absolute",
              right: { xs: -40, md: 35 },
              top: -55,
              fontSize: { xs: 160, md: 230 },
              color: "rgba(47,125,109,0.065)",
              transform: "rotate(-14deg)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1, maxWidth: 650 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <PeopleRoundedIcon sx={{ color: "primary.main", fontSize: 20 }} />
              <Typography
                variant="overline"
                sx={{ color: "primary.main", fontWeight: 800, letterSpacing: "0.12em" }}
              >
                ADMINISTRATOR WORKSPACE
              </Typography>
            </Stack>

            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "2.1rem", sm: "2.7rem", md: "3.1rem" },
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.15,
                color: "text.primary",
                mb: 2,
              }}
            >
              User <Box component="span" sx={{ color: "primary.main" }}>Management</Box>
            </Typography>

            <Typography sx={{ color: "text.secondary", maxWidth: 570, lineHeight: 1.8 }}>
              View registered adopters, shelter staff, and administrators.
              Manage account access from one convenient place.
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        {loading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ minHeight: 320 }}
          >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading PawBuddy accounts...
            </Typography>
          </Stack>
        ) : (
          <>
            {/* User statistics */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  sm: "repeat(3, minmax(0, 1fr))",
                  lg: "repeat(5, minmax(0, 1fr))",
                },
                gap: 2,
                mb: 5,
              }}
            >
              {statistics.map((item) => (
                <Card
                  key={item.label}
                  sx={{
                    borderRadius: "18px",
                    border: "1px solid #E3EBE7",
                    boxShadow: "0 5px 18px rgba(39,81,62,0.045)",
                  }}
                >
                  <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                    <Stack
                      direction="row"
                      alignItems="flex-start"
                      justifyContent="space-between"
                      spacing={1}
                      sx={{ mb: 1.75 }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 700, pt: 0.4 }}
                      >
                        {item.label}
                      </Typography>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "12px",
                          bgcolor: item.background,
                          color: item.color,
                          "& svg": { fontSize: 22 },
                        }}
                      >
                        {item.icon}
                      </Avatar>
                    </Stack>
                    <Typography
                      sx={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1, color: "text.primary" }}
                    >
                      {item.value}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Directory heading */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
              sx={{ mb: 2.5 }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Account Directory
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Find accounts and update their access status.
                </Typography>
              </Box>

              <Button
                variant="outlined"
                startIcon={<RefreshRoundedIcon />}
                onClick={() => {
                  setSuccess("");
                  fetchUsers();
                }}
                sx={{ borderRadius: "11px", whiteSpace: "nowrap" }}
              >
                Refresh Users
              </Button>
            </Stack>

            {/* Filters */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2.5 },
                mb: 3,
                border: "1px solid #E3EBE7",
                borderRadius: "18px",
                boxShadow: "0 6px 22px rgba(39,81,62,0.045)",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <TuneRoundedIcon sx={{ color: "primary.main", fontSize: 20 }} />
                <Typography sx={{ fontWeight: 750 }}>Search &amp; Filter Users</Typography>
              </Stack>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Search by name or email"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchRoundedIcon sx={{ color: "#8BA79A" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Role"
                    value={roleFilter}
                    onChange={(event) => setRoleFilter(event.target.value)}
                  >
                    <MenuItem value="all">All Roles</MenuItem>
                    <MenuItem value="adopter">Adopters</MenuItem>
                    <MenuItem value="staff">Shelter Staff</MenuItem>
                    <MenuItem value="admin">Administrators</MenuItem>
                  </TextField>
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Status"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Paper>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Registered Users
              </Typography>
              <Chip
                label={`${filteredUsers.length} ${
                  filteredUsers.length === 1 ? "user" : "users"
                } found`}
                sx={{ bgcolor: "#E5F3EC", color: "#2F7D6D", fontWeight: 750 }}
              />
            </Stack>

            {filteredUsers.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 5, md: 7 },
                  borderRadius: "20px",
                  border: "1px dashed #C7DCD1",
                  textAlign: "center",
                }}
              >
                <PeopleRoundedIcon sx={{ fontSize: 52, color: "#A2C9B9", mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  No matching accounts
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Try adjusting your search or filters.
                </Typography>
              </Paper>
            ) : (
              <>
                {/* Desktop table */}
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    display: { xs: "none", md: "block" },
                    borderRadius: "20px",
                    border: "1px solid #E1EBE5",
                    boxShadow: "0 6px 24px rgba(39,81,62,0.05)",
                    overflowX: "auto",
                  }}
                >
                  <Table sx={{ minWidth: 760 }}>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: "#F1F8F4",
                          "& th": {
                            color: "#506E60",
                            fontSize: "0.78rem",
                            letterSpacing: "0.025em",
                            fontWeight: 800,
                            borderColor: "#E3EBE7",
                            py: 2,
                          },
                        }}
                      >
                        <TableCell>User</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow
                          key={user._id}
                          hover
                          sx={{
                            "& td": { borderColor: "#EDF2EE", py: 1.8 },
                            "&:last-child td": { borderBottom: 0 },
                          }}
                        >
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                              <Avatar
                                sx={{
                                  width: 38,
                                  height: 38,
                                  bgcolor: "#DDEFE5",
                                  color: "primary.main",
                                  fontWeight: 800,
                                  fontSize: "0.95rem",
                                }}
                              >
                                {(user.name || "U").charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 750 }}>
                                  {user.name || "Unknown User"}
                                </Typography>
                                {isCurrentAccount(user) && (
                                  <Typography variant="caption" color="primary.main" sx={{ fontWeight: 800 }}>
                                    Your account
                                  </Typography>
                                )}
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ overflowWrap: "anywhere", maxWidth: 230 }}>
                            <Typography variant="body2" color="text.secondary">
                              {user.email || "Not provided"}
                            </Typography>
                          </TableCell>
                          <TableCell>{renderRoleChip(user)}</TableCell>
                          <TableCell>{renderStatusChip(user)}</TableCell>
                          <TableCell align="right">{renderStatusButton(user)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Mobile account cards */}
                <Box sx={{ display: { xs: "block", md: "none" } }}>
                  <Stack spacing={2}>
                    {filteredUsers.map((user) => (
                      <Card
                        key={user._id}
                        sx={{
                          borderRadius: "18px",
                          border: "1px solid #E1EBE5",
                          boxShadow: "0 5px 20px rgba(39,81,62,0.045)",
                        }}
                      >
                        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                            <Avatar
                              sx={{
                                bgcolor: "#DDEFE5",
                                color: "primary.main",
                                fontWeight: 800,
                              }}
                            >
                              {(user.name || "U").charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography sx={{ fontWeight: 800, overflowWrap: "anywhere" }}>
                                {user.name || "Unknown User"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
                                {user.email || "Not provided"}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                            {renderRoleChip(user)}
                            {renderStatusChip(user)}
                            {isCurrentAccount(user) && (
                              <Chip label="You" size="small" variant="outlined" color="primary" />
                            )}
                          </Stack>

                          <Divider sx={{ mb: 2 }} />
                          {renderStatusButton(user, true)}
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              </>
            )}

            {/* Account safeguard note */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2.5 }}>
              <InfoOutlinedIcon sx={{ fontSize: 18, color: "#78978B" }} />
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Your own administrator account cannot be deactivated from this page.
              </Typography>
            </Stack>
          </>
        )}
      </Container>
    </Box>
  );
};

export default UserManagement;
