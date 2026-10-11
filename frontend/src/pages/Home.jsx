import React from "react";
import { Link } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

import pawBuddyHero from "../assets/pawbuddy-hero.svg";

const Home = () => {
  const token = localStorage.getItem("token");

  const adoptionSteps = [
    {
      number: "01",
      title: "Find your companion",
      description:
        "Explore pets looking for a loving home. Browse their profiles and discover your perfect match.",
      icon: <SearchRoundedIcon />,
      color: "#E3F2ED",
      iconColor: "#2F7D6D",
    },
    {
      number: "02",
      title: "Apply for adoption",
      description:
        "Found someone special? Submit an adoption application and follow its progress through PawBuddy.",
      icon: <AssignmentTurnedInRoundedIcon />,
      color: "#FFF0E6",
      iconColor: "#D97855",
    },
    {
      number: "03",
      title: "Meet & welcome",
      description:
        "Once approved, arrange an appointment and take the next steps toward welcoming your new friend.",
      icon: <EventAvailableRoundedIcon />,
      color: "#FCE9E6",
      iconColor: "#D77365",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        overflow: "hidden",
      }}
    >
      {/* HERO SECTION */}
      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: 2, md: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            position: "relative",
            minHeight: { md: 530, lg: 565 },
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            alignItems: "center",
            overflow: "hidden",
            backgroundColor: "#FFF8EE",
            borderRadius: {
              xs: "24px",
              md: "32px",
            },
            border: "1px solid #F0E9DE",
            boxShadow:
              "0 15px 50px rgba(49, 78, 64, 0.06)",
          }}
        >
          {/* Desktop Hero Illustration */}
          <Box
            component="img"
            src={pawBuddyHero}
            alt=""
            aria-hidden="true"
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />

          {/* Subtle text readability overlay */}
          <Box
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, #FFF8EE 0%, rgba(255,248,238,0.98) 25%, rgba(255,248,238,0.72) 40%, rgba(255,248,238,0) 66%)",
            }}
          />

          {/* Hero Content */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: {
                xs: "100%",
                md: 600,
              },
              p: {
                xs: 3,
                sm: 5,
                md: 6,
                lg: 7,
              },
              pt: {
                xs: 5,
                sm: 6,
                md: 6,
              },
            }}
          >
            {/* Eyebrow */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                width: "fit-content",
                mb: 3,
                px: 1.8,
                py: 0.9,
                borderRadius: "50px",
                backgroundColor:
                  "rgba(47,125,109,0.09)",
                border:
                  "1px solid rgba(47,125,109,0.09)",
              }}
            >
              <PetsRoundedIcon
                sx={{
                  fontSize: 17,
                  color: "primary.main",
                }}
              />

              <Typography
                variant="caption"
                sx={{
                  color: "primary.dark",
                  fontWeight: 800,
                  letterSpacing: "0.07em",
                  fontSize: "0.7rem",
                }}
              >
                A HOME FOR EVERY PAW
              </Typography>
            </Stack>

            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.045em",
                lineHeight: 1.12,
                fontSize: {
                  xs: "2.6rem",
                  sm: "3.35rem",
                  md: "3.6rem",
                  lg: "4rem",
                },
                color: "text.primary",
                mb: 3,
              }}
            >
              Every paw deserves
              <Box
                component="span"
                sx={{
                  display: "block",
                  color: "primary.main",
                }}
              >
                a loving home.
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                maxWidth: 450,
                color: "text.secondary",
                fontSize: {
                  xs: "1rem",
                  sm: "1.1rem",
                },
                lineHeight: 1.85,
                mb: 4,
              }}
            >
              Somewhere, a little companion is
              waiting to meet you. Discover
              wonderful pets, connect with
              shelters, and begin a beautiful
              adoption journey with PawBuddy.
            </Typography>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
              sx={{
                alignItems: {
                  xs: "stretch",
                  sm: "center",
                },
              }}
            >
              <Button
                component={Link}
                to="/pets"
                variant="contained"
                size="large"
                endIcon={
                  <ArrowForwardRoundedIcon />
                }
                sx={{
                  px: 3.5,
                  py: 1.5,
                  borderRadius: "12px",
                  fontSize: "0.98rem",
                  whiteSpace: "nowrap",
                }}
              >
                Find Your Buddy
              </Button>

              {!token && (
                <Button
                  component={Link}
                  to="/register"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 3.5,
                    py: 1.5,
                    borderRadius: "12px",
                    borderWidth: 1.5,
                    whiteSpace: "nowrap",
                    backgroundColor:
                      "rgba(255,255,255,0.55)",
                  }}
                >
                  Join PawBuddy
                </Button>
              )}
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mt: 4 }}
            >
              <FavoriteRoundedIcon
                sx={{
                  color: "secondary.main",
                  fontSize: 18,
                }}
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Little paws. Big love. Forever homes.
              </Typography>
            </Stack>
          </Box>

          {/* Mobile Hero Illustration */}
          <Box
            component="img"
            src={pawBuddyHero}
            alt="Illustration of a dog and cat in front of their home"
            sx={{
              display: {
                xs: "block",
                md: "none",
              },
              width: "100%",
              height: {
                xs: 260,
                sm: 350,
              },
              objectFit: "cover",
              objectPosition: "right center",
            }}
          />
        </Box>
      </Container>

      {/* ADOPTION PROCESS */}
      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: 9,
            md: 12,
          },
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            maxWidth: 650,
            mx: "auto",
            mb: 6,
          }}
        >
          <Typography
            variant="overline"
            sx={{
              color: "primary.main",
              fontWeight: 800,
              letterSpacing: "0.16em",
            }}
          >
            YOUR ADOPTION JOURNEY
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "text.primary",
              mt: 1,
              mb: 2,
              fontSize: {
                xs: "2rem",
                sm: "2.5rem",
                md: "2.8rem",
              },
              letterSpacing: "-0.035em",
            }}
          >
            Finding love is
            <Box
              component="span"
              sx={{
                color: "primary.main",
              }}
            >
              {" "}simple.
            </Box>
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
            }}
          >
            From the first hello to a forever home,
            PawBuddy helps you through every step
            of the adoption process.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {adoptionSteps.map((step) => (
            <Grid
              key={step.number}
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: "22px",
                  border: "1px solid #E3EBE7",
                  backgroundColor: "#FFFFFF",
                  transition:
                    "transform 0.25s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow:
                      "0 16px 32px rgba(47,125,109,0.1)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: {
                      xs: 3,
                      md: 3.5,
                    },
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
                        borderRadius: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                          step.color,
                        color: step.iconColor,
                        "& svg": {
                          fontSize: 30,
                        },
                      }}
                    >
                      {step.icon}
                    </Box>

                    <Typography
                      variant="h4"
                      sx={{
                        color: "#DCE9E3",
                        fontWeight: 800,
                        lineHeight: 1,
                      }}
                    >
                      {step.number}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 750,
                      mb: 1.5,
                      color: "text.primary",
                    }}
                  >
                    {step.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.85,
                    }}
                  >
                    {step.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CLOSING CALL TO ACTION */}
      <Container
        maxWidth="lg"
        sx={{
          pb: {
            xs: 9,
            md: 12,
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: {
              xs: "24px",
              md: "28px",
            },
            background:
              "linear-gradient(125deg, #205D51 0%, #2F7D6D 100%)",
            color: "#FFFFFF",
            px: {
              xs: 3,
              sm: 5,
              md: 7,
            },
            py: {
              xs: 6,
              md: 7,
            },
          }}
        >
          {/* Decorative circles */}
          <Box
            sx={{
              position: "absolute",
              width: 280,
              height: 280,
              borderRadius: "50%",
              backgroundColor:
                "rgba(168,213,197,0.11)",
              top: -170,
              right: -60,
              pointerEvents: "none",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: "50%",
              border:
                "35px solid rgba(168,213,197,0.08)",
              bottom: -135,
              left: -60,
              pointerEvents: "none",
            }}
          />

          <PetsRoundedIcon
            sx={{
              position: "absolute",
              right: {
                xs: -35,
                md: 60,
              },
              bottom: {
                xs: -30,
                md: -20,
              },
              fontSize: {
                xs: 160,
                md: 220,
              },
              color:
                "rgba(255,255,255,0.09)",
              transform: "rotate(-18deg)",
              pointerEvents: "none",
            }}
          />

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              maxWidth: 610,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "#BFE2D4",
                fontWeight: 800,
                letterSpacing: "0.13em",
              }}
            >
              YOUR NEW FRIEND IS WAITING
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mt: 1.5,
                mb: 2,
                letterSpacing: "-0.035em",
                fontSize: {
                  xs: "2rem",
                  sm: "2.5rem",
                  md: "3rem",
                },
              }}
            >
              A new chapter starts
              with a hello.
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.82)",
                lineHeight: 1.85,
                fontSize: "1.05rem",
                mb: 3.5,
              }}
            >
              Take the first step toward giving a
              pet the love and home they deserve.
              Your next best friend might be
              just a click away.
            </Typography>

            <Button
              component={Link}
              to="/pets"
              variant="contained"
              endIcon={
                <ArrowForwardRoundedIcon />
              }
              sx={{
                px: 3.5,
                py: 1.4,
                backgroundColor: "#FFFFFF",
                color: "#205D51",
                fontWeight: 800,
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: "#E3F2ED",
                },
              }}
            >
              Explore Available Pets
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;