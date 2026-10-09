import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
} from "@mui/material";

import PetsIcon from "@mui/icons-material/Pets";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PeopleIcon from "@mui/icons-material/People";
import BadgeIcon from "@mui/icons-material/Badge";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  getAdminDashboardStats,
} from "../../services/dashboardService";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user"),
  );

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAdminDashboardStats();

      setStats(data.stats);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load dashboard statistics.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const actionCardStyle = {
    height: "100%",
    cursor: "pointer",
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 3,
    transition: "0.2s ease",

    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: 4,
    },
  };

  const statCardStyle = {
    height: "100%",
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "0 4px 18px rgba(0, 0, 0, 0.05)",
  };

  const overviewData = stats
    ? [
        {
          name: "Available",
          value: stats.pets.available,
        },
        {
          name: "Reserved",
          value: stats.pets.reserved,
        },
        {
          name: "Successful",
          value: stats.adoptions.successful,
        },
      ]
    : [];

  const applicationData = stats
    ? [
        {
          name: "Pending",
          value: stats.applications.pending,
        },
        {
          name: "Approved",
          value: stats.applications.approved,
        },
        {
          name: "Rejected",
          value: stats.applications.rejected,
        },
        {
          name: "Completed",
          value: stats.applications.completed,
        },
      ]
    : [];

  const applicationColors = [
    "#F2B84B",
    "#2F7D6D",
    "#F28C7A",
    "#69AFA0",
  ];

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    backgroundColor,
    iconColor,
    onClick,
  }) => {
    return (
      <Card
        onClick={onClick}
        sx={{
          ...statCardStyle,
          cursor: onClick ? "pointer" : "default",
          transition: "0.2s ease",

          "&:hover": onClick
            ? {
                transform: "translateY(-3px)",
                boxShadow: 4,
              }
            : {},
        }}
      >
        <CardContent
          sx={{
            p: 3,
            height: "100%",
          }}
        >
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {title}
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "text.primary",
                  mb: 0.5,
                }}
              >
                {value}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                }}
              >
                {subtitle}
              </Typography>
            </Box>

            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor,
                color: iconColor,
              }}
            >
              {icon}
            </Avatar>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 70px)",
          backgroundColor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: "primary.main",
              fontWeight: 800,
              mb: 1,
            }}
          >
            Admin Dashboard
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
            }}
          >
            Welcome, {user?.name || "Admin"}. Here is an overview of
            PawBuddy.
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

        {stats && (
          <>
            {/* Main statistics */}
            <Grid
              container
              spacing={2.5}
              sx={{ mb: 4 }}
            >
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 3,
                }}
              >
                <StatCard
                  title="Available Pets"
                  value={stats.pets.available}
                  subtitle="Ready for adoption"
                  icon={<PetsIcon />}
                  backgroundColor="#E2F2ED"
                  iconColor="#2F7D6D"
                  onClick={() =>
                    navigate("/staff/pets")
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 3,
                }}
              >
                <StatCard
                  title="Reserved Pets"
                  value={stats.pets.reserved}
                  subtitle="Adoption in progress"
                  icon={<HomeWorkIcon />}
                  backgroundColor="#FFF1E6"
                  iconColor="#D97855"
                  onClick={() =>
                    navigate("/manage-adoptions")
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 3,
                }}
              >
                <StatCard
                  title="Successful Adoptions"
                  value={
                    stats.adoptions.successful
                  }
                  subtitle="All-time completed adoptions"
                  icon={<FavoriteIcon />}
                  backgroundColor="#FDE8E4"
                  iconColor="#F28C7A"
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 3,
                }}
              >
                <StatCard
                  title="Adoption Fees Collected"
                  value={`₹${Number(
                    stats.payments
                      .adoptionFeesCollected || 0,
                  ).toLocaleString("en-IN")}`}
                  subtitle={`${stats.payments.successfulPayments} verified payments`}
                  icon={<CurrencyRupeeIcon />}
                  backgroundColor="#E2F2ED"
                  iconColor="#2F7D6D"
                />
              </Grid>
            </Grid>

            {/* Charts */}
            <Grid
              container
              spacing={3}
              sx={{ mb: 4 }}
            >
              <Grid
                size={{
                  xs: 12,
                  lg: 6,
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow:
                      "0 4px 18px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 0.5,
                      }}
                    >
                      Pet & Adoption Overview
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Current available and reserved pets compared with
                      all-time successful adoptions.
                    </Typography>

                    <Box
                      sx={{
                        width: "100%",
                        height: 320,
                      }}
                    >
                      <ResponsiveContainer>
                        <BarChart
                          data={overviewData}
                          margin={{
                            top: 10,
                            right: 20,
                            left: -15,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                          />

                          <XAxis
                            dataKey="name"
                            tickLine={false}
                          />

                          <YAxis
                            allowDecimals={false}
                            tickLine={false}
                          />

                          <Tooltip />

                          <Bar
                            dataKey="value"
                            fill="#2F7D6D"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>

                    <Alert
                      severity="info"
                      sx={{ mt: 1 }}
                    >
                      Successful Adoptions is an all-time historical
                      total. It remains unchanged when an adopted pet
                      is removed from the active pet list.
                    </Alert>
                  </CardContent>
                </Card>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  lg: 6,
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow:
                      "0 4px 18px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 0.5,
                      }}
                    >
                      Application Status
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Distribution of adoption application records
                      currently retained in PawBuddy.
                    </Typography>

                    <Box
                      sx={{
                        width: "100%",
                        height: 340,
                      }}
                    >
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={applicationData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="46%"
                            innerRadius={75}
                            outerRadius={115}
                            paddingAngle={3}
                          >
                            {applicationData.map(
                              (entry, index) => (
                                <Cell
                                  key={entry.name}
                                  fill={
                                    applicationColors[
                                      index %
                                        applicationColors.length
                                    ]
                                  }
                                />
                              ),
                            )}
                          </Pie>

                          <Tooltip />

                          <Legend
                            verticalAlign="bottom"
                            height={36}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Operational statistics */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Operations
            </Typography>

            <Grid
              container
              spacing={2.5}
              sx={{ mb: 5 }}
            >
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 3,
                }}
              >
                <StatCard
                  title="Registered Adopters"
                  value={stats.users.adopters}
                  subtitle="Adopter accounts"
                  icon={<PeopleIcon />}
                  backgroundColor="#E2F2ED"
                  iconColor="#2F7D6D"
                  onClick={() =>
                    navigate("/admin/users")
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 3,
                }}
              >
                <StatCard
                  title="Shelter Staff"
                  value={stats.users.staff}
                  subtitle="Staff accounts"
                  icon={<BadgeIcon />}
                  backgroundColor="#EDF3F8"
                  iconColor="#42647A"
                  onClick={() =>
                    navigate("/admin/users")
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 3,
                }}
              >
                <StatCard
                  title="Pending Applications"
                  value={
                    stats.applications.pending
                  }
                  subtitle="Waiting for review"
                  icon={<AssignmentIcon />}
                  backgroundColor="#FFF1E6"
                  iconColor="#D97855"
                  onClick={() =>
                    navigate("/manage-adoptions")
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 3,
                }}
              >
                <StatCard
                  title="Upcoming Appointments"
                  value={
                    stats.appointments.upcoming
                  }
                  subtitle="Scheduled visits"
                  icon={<EventIcon />}
                  backgroundColor="#FDE8E4"
                  iconColor="#F28C7A"
                  onClick={() =>
                    navigate(
                      "/manage-appointments",
                    )
                  }
                />
              </Grid>
            </Grid>
          </>
        )}

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Management
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Access PawBuddy administration tools.
          </Typography>
        </Box>

        {/* Existing management cards */}
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
          >
            <Card
              onClick={() =>
                navigate("/admin/users")
              }
              sx={actionCardStyle}
            >
              <CardContent sx={{ p: 3 }}>
                <Avatar
                  sx={{
                    mb: 2,
                    bgcolor: "#E2F2ED",
                    color: "#2F7D6D",
                  }}
                >
                  <ManageAccountsIcon />
                </Avatar>

                <Typography
                  variant="h6"
                  sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  User Management
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  View users and activate or deactivate accounts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
          >
            <Card
              onClick={() =>
                navigate(
                  "/admin/create-staff",
                )
              }
              sx={actionCardStyle}
            >
              <CardContent sx={{ p: 3 }}>
                <Avatar
                  sx={{
                    mb: 2,
                    bgcolor: "#FDE8E4",
                    color: "#F28C7A",
                  }}
                >
                  <PersonAddIcon />
                </Avatar>

                <Typography
                  variant="h6"
                  sx={{
                    color: "secondary.main",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Create Staff
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Create new shelter staff accounts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
          >
            <Card
              onClick={() =>
                navigate("/staff/pets")
              }
              sx={actionCardStyle}
            >
              <CardContent sx={{ p: 3 }}>
                <Avatar
                  sx={{
                    mb: 2,
                    bgcolor: "#E2F2ED",
                    color: "#2F7D6D",
                  }}
                >
                  <PetsIcon />
                </Avatar>

                <Typography
                  variant="h6"
                  sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Manage Pets
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Add, update, view and remove pets available for
                  adoption.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
          >
            <Card
              onClick={() =>
                navigate(
                  "/manage-adoptions",
                )
              }
              sx={actionCardStyle}
            >
              <CardContent sx={{ p: 3 }}>
                <Avatar
                  sx={{
                    mb: 2,
                    bgcolor: "#FFF1E6",
                    color: "#D97855",
                  }}
                >
                  <AssignmentIcon />
                </Avatar>

                <Typography
                  variant="h6"
                  sx={{
                    color: "secondary.main",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Adoption Applications
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Review and manage adoption requests submitted by
                  adopters.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
          >
            <Card
              onClick={() =>
                navigate(
                  "/manage-appointments",
                )
              }
              sx={actionCardStyle}
            >
              <CardContent sx={{ p: 3 }}>
                <Avatar
                  sx={{
                    mb: 2,
                    bgcolor: "#EDF3F8",
                    color: "#42647A",
                  }}
                >
                  <EventIcon />
                </Avatar>

                <Typography
                  variant="h6"
                  sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Manage Appointments
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Review, approve and complete adoption and site visit
                  appointments.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;