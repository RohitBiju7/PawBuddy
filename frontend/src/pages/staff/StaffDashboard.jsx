import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Stack,
  Chip,
  Divider,
} from "@mui/material";

import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

const StaffDashboard = () => {
  const navigate = useNavigate();

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const staffName = user?.name?.trim() || "Staff";

  const workspaces = [
    {
      title: "Manage Pets",
      description:
        "Add new pets, update their information, manage photos, and maintain the shelter's adoption listings.",
      path: "/staff/pets",
      action: "Manage pet listings",
      icon: <PetsRoundedIcon sx={{ fontSize: 30 }} />,
      number: "01",
      background: "#E2F3EA",
      iconColor: "#2F7D6D",
      accent: "#2F7D6D",
    },
    {
      title: "View Pet Listings",
      description:
        "Browse the public pet collection and see how available, reserved, and adopted pets appear to visitors.",
      path: "/pets",
      action: "Browse pet listings",
      icon: <VisibilityRoundedIcon sx={{ fontSize: 30 }} />,
      number: "02",
      background: "#FFF0E7",
      iconColor: "#CF765B",
      accent: "#F28C7A",
    },
    {
      title: "Adoption Applications",
      description:
        "Review adopter requests, approve or reject applications, add private staff notes, and complete adoptions.",
      path: "/manage-adoptions",
      action: "Review applications",
      icon: (
        <AssignmentTurnedInRoundedIcon sx={{ fontSize: 30 }} />
      ),
      number: "03",
      background: "#E8F1F9",
      iconColor: "#4A7FA3",
      accent: "#80A9C8",
    },
    {
      title: "Manage Appointments",
      description:
        "Review requests for adoption and site visits, confirm schedules, and mark finished visits as completed.",
      path: "/manage-appointments",
      action: "View appointments",
      icon: <EventAvailableRoundedIcon sx={{ fontSize: 30 }} />,
      number: "04",
      background: "#FFF2DF",
      iconColor: "#B67B36",
      accent: "#E2B66D",
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
        {/* Branded dashboard header */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: "22px", md: "28px" },
            border: "1px solid #DCEBE2",
            background:
              "linear-gradient(118deg, #E6F4EB 0%, #F5FAF6 58%, #FFF3EA 100%)",
            p: { xs: 3, sm: 4, md: 5 },
            mb: 4,
          }}
        >
          <PetsRoundedIcon
            aria-hidden="true"
            sx={{
              position: "absolute",
              right: { xs: -35, md: 30 },
              top: { xs: -40, md: -55 },
              fontSize: { xs: 160, md: 245 },
              color: "rgba(47, 125, 109, 0.065)",
              transform: "rotate(-18deg)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1, maxWidth: 700 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 2 }}
            >
              <DashboardRoundedIcon
                sx={{ fontSize: 19, color: "primary.main" }}
              />

              <Typography
                variant="overline"
                sx={{
                  color: "primary.main",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                }}
              >
                SHELTER WORKSPACE
              </Typography>
            </Stack>

            <Typography
              component="h1"
              sx={{
                color: "text.primary",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.15,
                fontSize: {
                  xs: "2.1rem",
                  sm: "2.7rem",
                  md: "3.2rem",
                },
                mb: 1.8,
              }}
            >
              Welcome back, {staffName}
              <Box component="span" sx={{ color: "primary.main" }}>
                .
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 555,
                color: "text.secondary",
                fontSize: { xs: "0.97rem", sm: "1.05rem" },
                lineHeight: 1.8,
                mb: 2.5,
              }}
            >
              Help every pet get closer to a loving home. Manage shelter
              listings, review adoption applications, and coordinate visits
              from one convenient place.
            </Typography>

            <Chip
              icon={<CheckCircleOutlineRoundedIcon />}
              label="Shelter management"
              sx={{
                bgcolor: "#FFFFFF",
                color: "#2F7D6D",
                border: "1px solid #D2E8DC",
                fontWeight: 750,
                "& .MuiChip-icon": { color: "#2F7D6D" },
              }}
            />
          </Box>
        </Box>

        {/* Workspace heading */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}
            >
              Manage your shelter
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Choose a workspace to continue your daily tasks.
            </Typography>
          </Box>

          <Chip
            label="4 workspaces"
            sx={{
              backgroundColor: "#E5F3EC",
              color: "#2F7D6D",
              fontWeight: 750,
            }}
          />
        </Stack>

        {/* Existing four staff destinations */}
        <Grid container spacing={3}>
          {workspaces.map((workspace) => (
            <Grid
              key={workspace.path}
              size={{ xs: 12, sm: 6 }}
            >
              <Card
                sx={{
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: "22px",
                  border: "1px solid #E0EBE4",
                  boxShadow: "0 6px 24px rgba(39, 81, 62, 0.05)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 16px 34px rgba(39, 81, 62, 0.11)",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(workspace.path)}
                  aria-label={workspace.action}
                  sx={{ height: "100%", display: "block" }}
                >
                  <Box
                    sx={{
                      height: 5,
                      backgroundColor: workspace.accent,
                    }}
                  />

                  <CardContent
                    sx={{
                      p: { xs: 3, sm: 3.5 },
                      display: "flex",
                      flexDirection: "column",
                      minHeight: { xs: 265, sm: 292 },
                      "&:last-child": { pb: { xs: 3, sm: 3.5 } },
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      sx={{ mb: 3 }}
                    >
                      <Box
                        sx={{
                          width: 62,
                          height: 62,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "18px",
                          backgroundColor: workspace.background,
                          color: workspace.iconColor,
                        }}
                      >
                        {workspace.icon}
                      </Box>

                      <Typography
                        sx={{
                          fontSize: "2rem",
                          fontWeight: 800,
                          lineHeight: 1,
                          color: "#E1EBE5",
                        }}
                      >
                        {workspace.number}
                      </Typography>
                    </Stack>

                    <Typography
                      component="h2"
                      variant="h6"
                      sx={{
                        color: "text.primary",
                        fontWeight: 800,
                        mb: 1,
                      }}
                    >
                      {workspace.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.8, mb: 3 }}
                    >
                      {workspace.description}
                    </Typography>

                    <Box sx={{ mt: "auto" }}>
                      <Divider sx={{ mb: 2, borderColor: "#E9F0EC" }} />

                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ color: "primary.main" }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 800 }}
                        >
                          {workspace.action}
                        </Typography>

                        <ArrowForwardRoundedIcon sx={{ fontSize: 21 }} />
                      </Stack>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Closing encouragement */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            mt: 4,
            p: { xs: 2.5, sm: 3 },
            backgroundColor: "#EDF7F1",
            border: "1px solid #DCEBE2",
            borderRadius: "18px",
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "14px",
              bgcolor: "#D7EEE1",
              color: "primary.main",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <FavoriteRoundedIcon sx={{ fontSize: 24 }} />
          </Box>

          <Box>
            <Typography
              variant="subtitle1"
              sx={{ color: "text.primary", fontWeight: 800, mb: 0.3 }}
            >
              Every small step makes a difference.
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Thank you for helping pets and adopters find their perfect match.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default StaffDashboard;
