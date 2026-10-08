import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Stack,
  Divider,
} from "@mui/material";

import pawBuddyLogo from "../assets/pawbuddy-logo.png";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid",
        borderColor: "divider",
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            py: 4,
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            justifyContent: "space-between",
            alignItems: {
              xs: "center",
              md: "flex-start",
            },
            gap: 4,
          }}
        >
          <Box
            sx={{
              textAlign: {
                xs: "center",
                md: "left",
              },
              maxWidth: 350,
            }}
          >
            <Box
              component={Link}
              to="/"
              sx={{
                display: "inline-block",
                mb: 1.5,
                textDecoration: "none",
              }}
            >
              <Box
                component="img"
                src={pawBuddyLogo}
                alt="PawBuddy Logo"
                sx={{
                  height: {
                    xs: 45,
                    sm: 52,
                  },
                  width: "auto",
                }}
              />
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.7,
              }}
            >
              Helping pets find loving homes and connecting adopters with their
              perfect companions.
            </Typography>
          </Box>

          <Stack
            spacing={1.2}
            sx={{
              textAlign: {
                xs: "center",
                md: "left",
              },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                mb: 0.5,
              }}
            >
              Quick Links
            </Typography>

            <Typography
              component={Link}
              to="/"
              variant="body2"
              sx={{
                color: "text.secondary",
                textDecoration: "none",

                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Home
            </Typography>

            <Typography
              component={Link}
              to="/pets"
              variant="body2"
              sx={{
                color: "text.secondary",
                textDecoration: "none",

                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Pets
            </Typography>

            <Typography
              component={Link}
              to="/login"
              variant="body2"
              sx={{
                color: "text.secondary",
                textDecoration: "none",

                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Login
            </Typography>

            <Typography
              component={Link}
              to="/register"
              variant="body2"
              sx={{
                color: "text.secondary",
                textDecoration: "none",

                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Register
            </Typography>
          </Stack>
        </Box>

        <Divider />

        <Box
          sx={{
            py: 2.5,
            textAlign: "center",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            © {new Date().getFullYear()} PawBuddy. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;