import React from "react";
import { Link } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import pawBuddyHero from "../assets/pawbuddy-hero.svg";

const Home = () => {
  const token = localStorage.getItem("token");

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: {
            xs: 520,
            sm: 600,
            md: 620,
          },
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={pawBuddyHero}
          alt="PawBuddy pet adoption"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              maxWidth: {
                xs: "100%",
                sm: 520,
              },
              p: {
                xs: 3,
                sm: 4,
              },
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(4px)",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: "primary.main",
                fontWeight: 800,
                mb: 2,
                fontSize: {
                  xs: "2.4rem",
                  sm: "3rem",
                  md: "3.5rem",
                },
              }}
            >
              Find Your New Best Friend
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                lineHeight: 1.7,
                mb: 3,
              }}
            >
              Browse pets waiting for loving homes and start your adoption
              journey with PawBuddy.
            </Typography>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >
              <Button
                component={Link}
                to="/pets"
                variant="contained"
                size="large"
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  px: 4,
                  py: 1.4,
                }}
              >
                Browse Pets
              </Button>

              {!token && (
                <Button
                  component={Link}
                  to="/register"
                  variant="outlined"
                  size="large"
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    px: 4,
                    py: 1.4,
                  }}
                >
                  Create Account
                </Button>
              )}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* More homepage sections will go here */}
    </Box>
  );
};

export default Home;