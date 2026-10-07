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

const StaffDashboard = () => {
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
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              mb: 1,
            }}
          >
            Staff Dashboard
          </Typography>

          <Typography color="text.secondary">
            Welcome, {user?.name || "Staff"}. Manage shelter pets from here.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              onClick={() => navigate("/staff/pets")}
              sx={cardStyle}
            >
              <CardContent sx={{ p: 3 }}>
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

                <Typography color="text.secondary">
                  Add, edit, view and remove pets available for adoption.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              onClick={() => navigate("/pets")}
              sx={cardStyle}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "secondary.main",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  View Pet Listings
                </Typography>

                <Typography color="text.secondary">
                  View the pets currently listed on PawBuddy.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StaffDashboard;