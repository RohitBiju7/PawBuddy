import React from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Divider,
} from "@mui/material";

import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import pawBuddyLogo from "../assets/pawbuddy-logo.png";

const Footer = () => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    user = null;
  }

  const isLoggedIn = Boolean(token && user);

  const exploreLinks = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Find Pets",
      path: "/pets",
    },
    ...(isLoggedIn && user.role === "adopter"
      ? [
          {
            label: "Make a Donation",
            path: "/donate",
          },
        ]
      : []),
  ];

  const accountLinks = !isLoggedIn
    ? [
        {
          label: "Log In",
          path: "/login",
        },
        {
          label: "Create Account",
          path: "/register",
        },
      ]
    : user.role === "admin"
      ? [
          {
            label: "Admin Dashboard",
            path: "/admin",
          },
          {
            label: "Manage Users",
            path: "/admin/users",
          },
          {
            label: "Adoption Applications",
            path: "/manage-adoptions",
          },
          {
            label: "Manage Feedback",
            path: "/admin/complaints",
          },
        ]
      : user.role === "staff"
        ? [
            {
              label: "Staff Dashboard",
              path: "/staff",
            },
            {
              label: "Manage Pets",
              path: "/staff/pets",
            },
            {
              label: "Adoption Applications",
              path: "/manage-adoptions",
            },
            {
              label: "Manage Appointments",
              path: "/manage-appointments",
            },
          ]
        : [
            {
              label: "My Profile",
              path: "/profile",
            },
            {
              label: "My Applications",
              path: "/my-applications",
            },
            {
              label: "My Appointments",
              path: "/my-appointments",
            },
            {
              label: "My Feedback",
              path: "/my-complaints",
            },
          ];

  const isActive = (path) =>
    location.pathname === path;

  const footerLinkStyle = (path) => ({
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    gap: 0.7,
    color: isActive(path)
      ? "#2F7D6D"
      : "#61756C",
    fontWeight: isActive(path) ? 750 : 550,
    textDecoration: "none",
    fontSize: "0.9rem",
    transition:
      "color 0.2s ease, transform 0.2s ease",

    "&:hover": {
      color: "#2F7D6D",
      transform: "translateX(3px)",
    },

    "&:focus-visible": {
      outline: "2px solid #2F7D6D",
      outlineOffset: 4,
      borderRadius: 1,
    },
  });

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        mt: "auto",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #F0F8F4 0%, #FAFCFA 55%, #FFF8F5 100%)",
        borderTop: "1px solid #DDEAE3",
      }}
    >
      {/* Top brand accent */}
      <Box
        sx={{
          height: 4,
          background:
            "linear-gradient(90deg, #2F7D6D 0%, #A8D5C5 55%, #F28C7A 100%)",
        }}
      />

      {/* Decorative background paw */}
      <PetsRoundedIcon
        aria-hidden="true"
        sx={{
          position: "absolute",
          right: {
            xs: -45,
            md: 35,
          },
          bottom: {
            xs: 30,
            md: 25,
          },
          fontSize: {
            xs: 180,
            md: 240,
          },
          color: "rgba(47,125,109,0.045)",
          transform: "rotate(-20deg)",
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <Grid
          container
          spacing={{
            xs: 5,
            md: 6,
          }}
          sx={{
            pt: {
              xs: 6,
              md: 8,
            },
            pb: {
              xs: 5,
              md: 7,
            },
          }}
        >
          {/* Brand Section */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Box
              sx={{
                maxWidth: 385,
              }}
            >
              <Box
                component={Link}
                to="/"
                aria-label="PawBuddy Home"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  mb: 2.5,
                  textDecoration: "none",
                }}
              >
                <Box
                  component="img"
                  src={pawBuddyLogo}
                  alt="PawBuddy"
                  sx={{
                    width: {
                      xs: 165,
                      sm: 185,
                    },
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "#243A32",
                  letterSpacing: "-0.02em",
                  mb: 1.5,
                  lineHeight: 1.4,
                }}
              >
                Every paw deserves a
                <Box
                  component="span"
                  sx={{
                    color: "primary.main",
                  }}
                >
                  {" "}place to belong.
                </Box>
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  maxWidth: 350,
                  lineHeight: 1.9,
                }}
              >
                PawBuddy brings loving adopters and
                shelter pets together. Discover a
                companion, manage your adoption
                journey, and help more animals find
                their forever homes.
              </Typography>

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  mt: 3,
                  color: "primary.main",
                }}
              >
                <Box
                  sx={{
                    width: 31,
                    height: 31,
                    borderRadius: "10px",
                    backgroundColor: "#DFEFE7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FavoriteRoundedIcon
                    sx={{
                      fontSize: 17,
                      color: "#E78070",
                    }}
                  />
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    color: "#51776A",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  }}
                >
                  Little paws. Big love. Forever homes.
                </Typography>
              </Stack>
            </Box>
          </Grid>

          {/* Explore Links */}
          <Grid
            size={{
              xs: 6,
              md: 3,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                color: "#243A32",
                mb: 2.5,
              }}
            >
              Explore
            </Typography>

            <Stack
              component="nav"
              aria-label="Explore PawBuddy"
              spacing={2}
            >
              {exploreLinks.map((item) => (
                <Typography
                  key={item.path}
                  component={Link}
                  to={item.path}
                  variant="body2"
                  sx={footerLinkStyle(item.path)}
                >
                  {item.label}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Account / Management Links */}
          <Grid
            size={{
              xs: 6,
              md: 3,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                color: "#243A32",
                mb: 2.5,
              }}
            >
              {!isLoggedIn
                ? "Get Started"
                : user.role === "adopter"
                  ? "My PawBuddy"
                  : "Management"}
            </Typography>

            <Stack
              component="nav"
              aria-label="Account navigation"
              spacing={2}
            >
              {accountLinks.map((item) => (
                <Typography
                  key={item.path}
                  component={Link}
                  to={item.path}
                  variant="body2"
                  sx={footerLinkStyle(item.path)}
                >
                  {item.label}
                </Typography>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Footer Bottom */}
        <Divider
          sx={{
            borderColor:
              "rgba(47,125,109,0.12)",
          }}
        />

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems="center"
          spacing={1.5}
          sx={{
            py: 3,
            textAlign: {
              xs: "center",
              sm: "left",
            },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: "0.82rem",
            }}
          >
            © {new Date().getFullYear()} PawBuddy.
            All rights reserved.
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            spacing={0.8}
            sx={{
              color: "#65857A",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.82rem",
              }}
            >
              Connecting paws with people
            </Typography>

            <ArrowForwardRoundedIcon
              sx={{
                fontSize: 16,
                color: "primary.main",
              }}
            />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;