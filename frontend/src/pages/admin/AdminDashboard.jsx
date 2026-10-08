import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const cardStyle = {
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
            Admin Dashboard
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
            }}
          >
            Welcome, {user?.name || "Admin"}. Manage PawBuddy from here.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* User Management */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              onClick={() => navigate("/admin/users")}
              sx={cardStyle}
            >
              <CardContent
                sx={{
                  p: 3,
                }}
              >
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
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  View users and activate or deactivate accounts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Create Staff */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              onClick={() => navigate("/admin/create-staff")}
              sx={cardStyle}
            >
              <CardContent
                sx={{
                  p: 3,
                }}
              >
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
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Create new shelter staff accounts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Manage Pets */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              onClick={() => navigate("/staff/pets")}
              sx={cardStyle}
            >
              <CardContent
                sx={{
                  p: 3,
                }}
              >
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
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Add, update, view and remove pets available for adoption.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Adoption Applications */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              onClick={() => navigate("/manage-adoptions")}
              sx={cardStyle}
            >
              <CardContent
                sx={{
                  p: 3,
                }}
              >
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
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Review and manage adoption requests submitted by adopters.
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