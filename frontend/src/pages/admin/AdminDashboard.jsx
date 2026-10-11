import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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

import { getAdminDashboardStats } from "../../services/dashboardService";

const rupees = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const statsCardStyle = {
  height: "100%",
  minWidth: 0,
  overflow: "hidden",
  borderRadius: "19px",
  border: "1px solid #E1EBE5",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 6px 22px rgba(38, 80, 62, 0.045)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const sectionTitleStyle = {
  fontWeight: 800,
  letterSpacing: "-0.025em",
  color: "text.primary",
  fontSize: { xs: "1.35rem", sm: "1.55rem" },
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  background,
  color,
  onClick,
}) => {
  const Inner = onClick ? CardActionArea : Box;

  return (
    <Card
      sx={{
        ...statsCardStyle,
        "&:hover": onClick
          ? {
              transform: "translateY(-3px)",
              boxShadow: "0 13px 28px rgba(38, 80, 62, 0.1)",
            }
          : undefined,
      }}
    >
      <Inner
        onClick={onClick}
        sx={{ display: "block", height: "100%" }}
      >
        <CardContent
          sx={{
            height: "100%",
            p: { xs: 2.25, sm: 2.75 },
            "&:last-child": { pb: { xs: 2.25, sm: 2.75 } },
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={1}
            sx={{ mb: 2.25 }}
          >
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontWeight: 700, pt: 0.4 }}
            >
              {title}
            </Typography>

            <Avatar
              sx={{
                width: 44,
                height: 44,
                flexShrink: 0,
                borderRadius: "13px",
                backgroundColor: background,
                color,
                "& .MuiSvgIcon-root": { fontSize: 23 },
              }}
            >
              {icon}
            </Avatar>
          </Stack>

          <Typography
            sx={{
              fontSize: { xs: "1.8rem", md: "2rem", xl: "1.85rem" },
              color: "text.primary",
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.035em",
              overflowWrap: "anywhere",
              mb: 0.8,
            }}
          >
            {value}
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: "text.secondary", lineHeight: 1.6, display: "block" }}
          >
            {subtitle}
          </Typography>
        </CardContent>
      </Inner>
    </Card>
  );
};

const ManagementCard = ({ title, description, icon, tint, color, onClick }) => (
  <Card
    sx={{
      height: "100%",
      borderRadius: "20px",
      border: "1px solid #E2EBE5",
      boxShadow: "0 5px 20px rgba(38, 80, 62, 0.045)",
      overflow: "hidden",
      transition: "transform 0.22s ease, box-shadow 0.22s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 14px 28px rgba(38, 80, 62, 0.105)",
      },
    }}
  >
    <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
      <CardContent
        sx={{
          p: { xs: 2.75, sm: 3 },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          "&:last-child": { pb: { xs: 2.75, sm: 3 } },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2.5 }}
        >
          <Avatar
            sx={{
              width: 54,
              height: 54,
              borderRadius: "16px",
              bgcolor: tint,
              color,
              "& .MuiSvgIcon-root": { fontSize: 28 },
            }}
          >
            {icon}
          </Avatar>
          <ArrowForwardRoundedIcon sx={{ color: "#93ADA0", fontSize: 22 }} />
        </Stack>

        <Typography
          variant="h6"
          sx={{ color: "text.primary", fontWeight: 800, mb: 1 }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.8, flexGrow: 1 }}
        >
          {description}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "primary.main", fontWeight: 800, mt: 2.5 }}
        >
          Open workspace
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminDashboardStats();
      setStats(data.stats);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load dashboard statistics. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const overviewData = stats
    ? [
        { name: "Available", value: stats.pets.available },
        { name: "Reserved", value: stats.pets.reserved },
        { name: "Successful", value: stats.adoptions.successful },
      ]
    : [];

  const applicationData = stats
    ? [
        { name: "Pending", value: stats.applications.pending },
        { name: "Approved", value: stats.applications.approved },
        { name: "Rejected", value: stats.applications.rejected },
        { name: "Completed", value: stats.applications.completed },
      ]
    : [];

  const applicationColors = ["#E5AC5A", "#2F7D6D", "#F28C7A", "#74AFC1"];
  const hasApplications = applicationData.some((item) => item.value > 0);

  const primaryStats = stats
    ? [
        {
          title: "Available Pets",
          value: stats.pets.available,
          subtitle: "Ready to find a home",
          icon: <PetsRoundedIcon />,
          background: "#E2F3EA",
          color: "#2F7D6D",
          path: "/staff/pets",
        },
        {
          title: "Reserved Pets",
          value: stats.pets.reserved,
          subtitle: "Adoptions in progress",
          icon: <HomeWorkRoundedIcon />,
          background: "#FFF0E0",
          color: "#B97B30",
          path: "/manage-adoptions",
        },
        {
          title: "Successful Adoptions",
          value: stats.adoptions.successful,
          subtitle: "Completed all-time",
          icon: <FavoriteRoundedIcon />,
          background: "#FCEAE7",
          color: "#D97668",
        },
        {
          title: "Adoption Fees Collected",
          value: rupees(stats.payments.adoptionFeesCollected),
          subtitle: `${stats.payments.successfulPayments} verified payments`,
          icon: <CurrencyRupeeRoundedIcon />,
          background: "#E8F1F9",
          color: "#4C819E",
        },
        {
          title: "Donations Collected",
          value: rupees(stats.payments.donationsCollected),
          subtitle: `${stats.payments.successfulDonations || 0} successful donations`,
          icon: <VolunteerActivismRoundedIcon />,
          background: "#FCEAE7",
          color: "#D97668",
        },
      ]
    : [];

  const operations = stats
    ? [
        {
          title: "Registered Adopters",
          value: stats.users.adopters,
          subtitle: "Adopter accounts",
          icon: <PeopleRoundedIcon />,
          background: "#E2F3EA",
          color: "#2F7D6D",
          path: "/admin/users",
        },
        {
          title: "Shelter Staff",
          value: stats.users.staff,
          subtitle: "Staff accounts",
          icon: <BadgeRoundedIcon />,
          background: "#E8F1F9",
          color: "#4C819E",
          path: "/admin/users",
        },
        {
          title: "Pending Applications",
          value: stats.applications.pending,
          subtitle: "Waiting for review",
          icon: <AssignmentRoundedIcon />,
          background: "#FFF0E0",
          color: "#B97B30",
          path: "/manage-adoptions",
        },
        {
          title: "Upcoming Appointments",
          value: stats.appointments.upcoming,
          subtitle: "Scheduled visits",
          icon: <EventAvailableRoundedIcon />,
          background: "#FCEAE7",
          color: "#D97668",
          path: "/manage-appointments",
        },
      ]
    : [];

  const managementLinks = [
    {
      title: "User Management",
      description: "View user accounts and manage account activation status.",
      path: "/admin/users",
      icon: <ManageAccountsRoundedIcon />,
      tint: "#E2F3EA",
      color: "#2F7D6D",
    },
    {
      title: "Create Staff",
      description: "Create new shelter staff accounts and expand your team.",
      path: "/admin/create-staff",
      icon: <PersonAddAltRoundedIcon />,
      tint: "#FCEAE7",
      color: "#D97668",
    },
    {
      title: "Manage Pets",
      description: "Add pets, update listings, upload photos, and remove pets.",
      path: "/staff/pets",
      icon: <PetsRoundedIcon />,
      tint: "#E2F3EA",
      color: "#2F7D6D",
    },
    {
      title: "Adoption Applications",
      description: "Review adoption requests, add staff notes, and complete adoptions.",
      path: "/manage-adoptions",
      icon: <AssignmentRoundedIcon />,
      tint: "#FFF0E0",
      color: "#B97B30",
    },
    {
      title: "Manage Appointments",
      description: "Review, approve, and complete adoption or site visit appointments.",
      path: "/manage-appointments",
      icon: <EventAvailableRoundedIcon />,
      tint: "#E8F1F9",
      color: "#4C819E",
    },
    {
      title: "Manage Feedback",
      description: "Read submitted feedback, filter by category, and clear entries.",
      path: "/admin/complaints",
      icon: <ChatBubbleOutlineRoundedIcon />,
      tint: "#FCEAE7",
      color: "#D97668",
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
      <Container maxWidth="xl" sx={{ pt: { xs: 3, md: 5 } }}>
        {/* Branded heading */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: "22px", md: "28px" },
            border: "1px solid #DCEBE2",
            background:
              "linear-gradient(117deg, #E7F5ED 0%, #F5FAF6 59%, #FFF4ED 100%)",
            p: { xs: 3, sm: 4, md: 5 },
            mb: 4,
          }}
        >
          <PetsRoundedIcon
            aria-hidden="true"
            sx={{
              position: "absolute",
              right: { xs: -28, md: 40 },
              top: { xs: -45, md: -65 },
              fontSize: { xs: 155, md: 250 },
              color: "rgba(47, 125, 109, 0.06)",
              transform: "rotate(-18deg)",
              pointerEvents: "none",
            }}
          />
          <Box sx={{ position: "relative", zIndex: 1, maxWidth: 900 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <DashboardRoundedIcon
                sx={{ fontSize: 19, color: "primary.main" }}
              />
              <Typography
                variant="overline"
                sx={{
                  color: "primary.main",
                  letterSpacing: "0.12em",
                  fontWeight: 800,
                }}
              >
                PAWBUDDY ADMINISTRATION
              </Typography>
            </Stack>
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                color: "text.primary",
                fontSize: { xs: "2.1rem", sm: "2.7rem", md: "3.15rem" },
                letterSpacing: "-0.035em",
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              Admin <Box component="span" sx={{ color: "primary.main" }}>Dashboard</Box>
              <Box component="span" sx={{ color: "secondary.main" }}>.</Box>
            </Typography>
            <Typography
              sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}
            >
              Welcome back, {user?.name || "Admin"}. Here's an overview of your
              shelter's pets, adoptions, payments, and daily operations.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshRoundedIcon />}
              onClick={fetchStats}
              disabled={loading}
              sx={{
                bgcolor: "rgba(255,255,255,0.8)",
                borderRadius: "11px",
                px: 2.25,
                "&:hover": { bgcolor: "#FFFFFF" },
              }}
            >
              {loading ? "Refreshing..." : "Refresh Statistics"}
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading && !stats ? (
          <Stack
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{ py: 12 }}
          >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading PawBuddy statistics...
            </Typography>
          </Stack>
        ) : (
          <>
            {stats && (
              <>
                {/* Five main metrics */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={1}
                  sx={{ mb: 2.5 }}
                >
                  <Box>
                    <Typography sx={sectionTitleStyle}>At a Glance</Typography>
                    <Typography variant="body2" color="text.secondary">
                      A snapshot of PawBuddy's adoption activity and revenue.
                    </Typography>
                  </Box>
                  <Chip
                    label="Current database snapshot"
                    size="small"
                    sx={{
                      bgcolor: "#E4F3EA",
                      color: "#2F7D6D",
                      fontWeight: 750,
                    }}
                  />
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "minmax(0,1fr)",
                      sm: "repeat(2,minmax(0,1fr))",
                      md: "repeat(3,minmax(0,1fr))",
                      xl: "repeat(5,minmax(0,1fr))",
                    },
                    gap: 2.5,
                    mb: 5,
                  }}
                >
                  {primaryStats.map((item) => (
                    <StatCard
                      key={item.title}
                      {...item}
                      onClick={item.path ? () => navigate(item.path) : undefined}
                    />
                  ))}
                </Box>

                {/* Data charts */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.3}
                  sx={{ mb: 2.5 }}
                >
                  <Box
                    sx={{
                      width: 39,
                      height: 39,
                      borderRadius: "12px",
                      bgcolor: "#E2F3EA",
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <BarChartRoundedIcon />
                  </Box>
                  <Typography sx={sectionTitleStyle}>Reports & Insights</Typography>
                </Stack>

                <Grid container spacing={3} sx={{ mb: 5 }} alignItems="stretch">
                  <Grid size={{ xs: 12, lg: 6 }}>
                    <Card
                      sx={{
                        ...statsCardStyle,
                        borderRadius: "22px",
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2.5, sm: 3.5 }, "&:last-child": { pb: { xs: 2.5, sm: 3.5 } } }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <BarChartRoundedIcon sx={{ color: "primary.main", fontSize: 21 }} />
                          <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Pet & Adoption Overview
                          </Typography>
                        </Stack>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.75, mb: 3 }}
                        >
                          Active pet availability compared with historical successful adoptions.
                        </Typography>
                        <Box sx={{ width: "100%", height: 290 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={overviewData}
                              margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
                            >
                              <CartesianGrid stroke="#E7EEE9" strokeDasharray="4 4" vertical={false} />
                              <XAxis
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: "#71867B", fontSize: 12 }}
                              />
                              <YAxis
                                allowDecimals={false}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: "#71867B", fontSize: 12 }}
                              />
                              <Tooltip
                                cursor={{ fill: "#EEF7F1" }}
                                contentStyle={{ borderRadius: 12, border: "1px solid #E3EBE7" }}
                              />
                              <Bar
                                dataKey="value"
                                fill="#2F7D6D"
                                maxBarSize={74}
                                radius={[9, 9, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                        <Stack
                          direction="row"
                          alignItems="flex-start"
                          spacing={1}
                          sx={{
                            mt: 2,
                            p: 2,
                            bgcolor: "#F2F8F5",
                            border: "1px solid #E2EDE6",
                            borderRadius: "12px",
                          }}
                        >
                          <InfoOutlinedIcon sx={{ fontSize: 19, color: "primary.main", mt: 0.15 }} />
                          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            Successful Adoptions is an all-time total and remains unchanged when an adopted pet is removed from the active pet list.
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 12, lg: 6 }}>
                    <Card
                      sx={{
                        ...statsCardStyle,
                        borderRadius: "22px",
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2.5, sm: 3.5 }, "&:last-child": { pb: { xs: 2.5, sm: 3.5 } } }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <DonutLargeRoundedIcon sx={{ color: "primary.main", fontSize: 21 }} />
                          <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Application Status
                          </Typography>
                        </Stack>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.75, mb: 2 }}
                        >
                          Status distribution of adoption application records retained in PawBuddy.
                        </Typography>
                        {hasApplications ? (
                          <Box sx={{ width: "100%", height: 335 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={applicationData}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="45%"
                                  innerRadius={65}
                                  outerRadius={108}
                                  paddingAngle={3}
                                >
                                  {applicationData.map((entry, index) => (
                                    <Cell
                                      key={entry.name}
                                      fill={applicationColors[index]}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip
                                  contentStyle={{ borderRadius: 12, border: "1px solid #E3EBE7" }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                              </PieChart>
                            </ResponsiveContainer>
                          </Box>
                        ) : (
                          <Stack
                            alignItems="center"
                            justifyContent="center"
                            spacing={1.5}
                            sx={{ height: 335 }}
                          >
                            <DonutLargeRoundedIcon sx={{ fontSize: 64, color: "#BDD7C9" }} />
                            <Typography variant="body2" color="text.secondary">
                              No application records to chart yet.
                            </Typography>
                          </Stack>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Operations */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography sx={sectionTitleStyle}>Shelter Operations</Typography>
                  <Typography variant="body2" color="text.secondary">
                    People, pending decisions, and upcoming visits.
                  </Typography>
                </Box>
                <Grid container spacing={2.5} sx={{ mb: 5 }}>
                  {operations.map((item) => (
                    <Grid key={item.title} size={{ xs: 12, sm: 6, lg: 3 }}>
                      <StatCard
                        {...item}
                        onClick={() => navigate(item.path)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {/* Workspace links */}
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={sectionTitleStyle}>Management</Typography>
              <Typography variant="body2" color="text.secondary">
                Access PawBuddy's administration tools and shelter workflows.
              </Typography>
            </Box>

            <Grid container spacing={2.5}>
              {managementLinks.map((item) => (
                <Grid key={item.path} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <ManagementCard
                    {...item}
                    onClick={() => navigate(item.path)}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default AdminDashboard;
