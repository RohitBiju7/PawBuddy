import React, { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Stack,
  Typography,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import pawBuddyLogo from "../assets/pawbuddy-logo.png";

const Navbar = () => {
  const navigate = useNavigate();
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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [navigationAnchor, setNavigationAnchor] =
    useState(null);
  const [accountAnchor, setAccountAnchor] =
    useState(null);

  const handleCloseMenus = () => {
    setNavigationAnchor(null);
    setAccountAnchor(null);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    handleCloseMenus();
    navigate("/login");
  };

  const isActive = (path) => {
    if (
      path === "/" ||
      path === "/admin" ||
      path === "/staff"
    ) {
      return location.pathname === path;
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const profileName = user?.name?.trim() || "My Account";
  const profileInitial =
    profileName.charAt(0).toUpperCase();

  const roleLabel =
    user?.role === "admin"
      ? "Administrator"
      : user?.role === "staff"
        ? "Shelter Staff"
        : "Adopter";

  const publicLinks = [
    {
      label: "Home",
      path: "/",
      icon: <HomeRoundedIcon />,
    },
    {
      label: "Find Pets",
      path: "/pets",
      icon: <PetsRoundedIcon />,
    },
  ];

  const workspaceLinks =
    user?.role === "adopter"
      ? [
          {
            label: "My Applications",
            path: "/my-applications",
            icon: <AssignmentRoundedIcon />,
          },
          {
            label: "My Appointments",
            path: "/my-appointments",
            icon: <EventAvailableRoundedIcon />,
          },
          {
            label: "My Feedback",
            path: "/my-complaints",
            icon: <ChatBubbleOutlineRoundedIcon />,
          },
        ]
      : user?.role === "admin"
        ? [
            {
              label: "User Management",
              path: "/admin/users",
              icon: <PeopleOutlineRoundedIcon />,
            },
            {
              label: "Create Staff",
              path: "/admin/create-staff",
              icon: <PersonAddAltRoundedIcon />,
            },
            {
              label: "Manage Pets",
              path: "/staff/pets",
              icon: <PetsRoundedIcon />,
            },
            {
              label: "Adoption Applications",
              path: "/manage-adoptions",
              icon: <AssignmentRoundedIcon />,
            },
            {
              label: "Manage Appointments",
              path: "/manage-appointments",
              icon: <EventAvailableRoundedIcon />,
            },
            {
              label: "Manage Feedback",
              path: "/admin/complaints",
              icon: <ChatBubbleOutlineRoundedIcon />,
            },
          ]
        : user?.role === "staff"
          ? [
              {
                label: "Manage Pets",
                path: "/staff/pets",
                icon: <PetsRoundedIcon />,
              },
              {
                label: "Adoption Applications",
                path: "/manage-adoptions",
                icon: <AssignmentRoundedIcon />,
              },
              {
                label: "Manage Appointments",
                path: "/manage-appointments",
                icon: <EventAvailableRoundedIcon />,
              },
            ]
          : [];

  const dashboardPath =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "staff"
        ? "/staff"
        : null;

  const workspaceTitle =
    user?.role === "adopter"
      ? "My Activity"
      : "Management";

  const workspaceActive = workspaceLinks.some(
    (item) => isActive(item.path),
  );

  const navButtonStyle = (active) => ({
    color: active ? "#205D51" : "#52665F",
    backgroundColor: active
      ? "#E5F3ED"
      : "transparent",
    fontWeight: active ? 750 : 650,
    fontSize: "0.88rem",
    px: 2,
    py: 1.1,
    borderRadius: "11px",
    whiteSpace: "nowrap",
    minWidth: "auto",

    "&:hover": {
      backgroundColor: "#EDF6F1",
      color: "#205D51",
    },
  });

  const desktopMenuItemStyle = (active) => ({
    mx: 1,
    my: 0.35,
    px: 1.5,
    py: 1.2,
    borderRadius: "10px",
    gap: 1.5,
    color: active ? "#2F7D6D" : "#344941",
    backgroundColor: active
      ? "#EAF4EF"
      : "transparent",
    fontWeight: active ? 700 : 550,
    fontSize: "0.9rem",

    "&:hover": {
      backgroundColor: "#F0F7F3",
    },

    "& .MuiSvgIcon-root": {
      fontSize: 20,
      color: active ? "#2F7D6D" : "#82958B",
    },
  });

  const drawerLinkStyle = (active) => ({
    borderRadius: "12px",
    mb: 0.5,
    py: 1.3,
    px: 2,
    color: active ? "#205D51" : "#475B53",
    backgroundColor: active
      ? "#E5F3ED"
      : "transparent",

    "&:hover": {
      backgroundColor: "#EDF6F1",
    },

    "& .MuiListItemIcon-root": {
      minWidth: 40,
      color: active ? "#2F7D6D" : "#83968B",
    },

    "& .MuiListItemText-primary": {
      fontSize: "0.94rem",
      fontWeight: active ? 750 : 600,
    },
  });

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid #E3EBE7",
          boxShadow:
            "0 4px 24px rgba(34, 83, 65, 0.035)",
          color: "text.primary",
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: {
                xs: 70,
                md: 78,
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              onClick={handleCloseMenus}
              sx={{
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                textDecoration: "none",
              }}
            >
              <Box
                component="img"
                src={pawBuddyLogo}
                alt="PawBuddy Home"
                sx={{
                  width: {
                    xs: 145,
                    sm: 165,
                    lg: 177,
                  },
                  height: "auto",
                  objectFit: "contain",
                  transition: "transform 0.2s ease",

                  "&:hover": {
                    transform: "scale(1.025)",
                  },
                }}
              />
            </Box>

            {/* Desktop Navigation */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
                ml: "auto",
              }}
            >
              {publicLinks.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={navButtonStyle(isActive(item.path))}
                >
                  {item.label}
                </Button>
              ))}

              {isLoggedIn &&
                user.role === "adopter" && (
                  <Button
                    component={Link}
                    to="/donate"
                    startIcon={
                      <VolunteerActivismRoundedIcon />
                    }
                    sx={{
                      ...navButtonStyle(isActive("/donate")),
                      color: "#C96E5D",

                      "&:hover": {
                        color: "#B45A4B",
                        backgroundColor: "#FFF1ED",
                      },
                    }}
                  >
                    Donate
                  </Button>
                )}

              {isLoggedIn && dashboardPath && (
                <Button
                  component={Link}
                  to={dashboardPath}
                  sx={navButtonStyle(
                    isActive(dashboardPath),
                  )}
                >
                  Dashboard
                </Button>
              )}

              {isLoggedIn && workspaceLinks.length > 0 && (
                <Button
                  onClick={(event) =>
                    setNavigationAnchor(
                      event.currentTarget,
                    )
                  }
                  endIcon={
                    <KeyboardArrowDownRoundedIcon
                      sx={{
                        transform: navigationAnchor
                          ? "rotate(180deg)"
                          : "rotate(0)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  }
                  sx={navButtonStyle(workspaceActive)}
                  aria-haspopup="true"
                  aria-expanded={
                    Boolean(navigationAnchor)
                      ? "true"
                      : undefined
                  }
                >
                  {workspaceTitle}
                </Button>
              )}
            </Stack>

            {/* Desktop Authentication / Account */}
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
                alignItems: "center",
                ml: {
                  md: 0,
                  lg: 1.5,
                },
                flexShrink: 0,
              }}
            >
              {isLoggedIn ? (
                <Button
                  onClick={(event) =>
                    setAccountAnchor(event.currentTarget)
                  }
                  aria-haspopup="true"
                  aria-expanded={
                    Boolean(accountAnchor)
                      ? "true"
                      : undefined
                  }
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    px: 1.2,
                    py: 0.8,
                    border: "1px solid #E3EBE7",
                    borderRadius: "13px",
                    backgroundColor: "#F7FAF9",
                    color: "text.primary",
                    textTransform: "none",
                    minWidth: 0,

                    "&:hover": {
                      backgroundColor: "#EFF7F3",
                      borderColor: "#A8D5C5",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "#D9EEE5",
                      color: "#2F7D6D",
                      fontWeight: 800,
                      fontSize: "0.95rem",
                    }}
                  >
                    {profileInitial}
                  </Avatar>

                  <Box
                    sx={{
                      display: {
                        md: "none",
                        lg: "block",
                      },
                      textAlign: "left",
                      maxWidth: 135,
                    }}
                  >
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{
                        fontWeight: 750,
                        color: "#283D34",
                        lineHeight: 1.25,
                      }}
                    >
                      {profileName}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.2,
                      }}
                    >
                      {roleLabel}
                    </Typography>
                  </Box>

                  <KeyboardArrowDownRoundedIcon
                    sx={{
                      color: "#81958A",
                      fontSize: 20,
                    }}
                  />
                </Button>
              ) : (
                <Stack
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                >
                  <Button
                    component={Link}
                    to="/login"
                    sx={navButtonStyle(isActive("/login"))}
                  >
                    Log In
                  </Button>

                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    sx={{
                      borderRadius: "11px",
                      px: 2.5,
                      py: 1.1,
                      fontWeight: 750,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Join PawBuddy
                  </Button>
                </Stack>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },
                width: 44,
                height: 44,
                borderRadius: "12px",
                backgroundColor: "#EFF6F2",
                color: "primary.main",

                "&:hover": {
                  backgroundColor: "#E1F0E8",
                },
              }}
            >
              <MenuRoundedIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Desktop Workspace Menu */}
      <Menu
        anchorEl={navigationAnchor}
        open={Boolean(navigationAnchor)}
        onClose={() => setNavigationAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.3,
              minWidth: 245,
              maxHeight: "70vh",
              borderRadius: "17px",
              border: "1px solid #E3EBE7",
              boxShadow:
                "0 16px 45px rgba(25, 65, 49, 0.12)",
              py: 0.8,
            },
          },
        }}
      >
        <Typography
          variant="overline"
          sx={{
            display: "block",
            px: 2.6,
            py: 0.5,
            color: "text.secondary",
            fontWeight: 800,
            letterSpacing: "0.12em",
            fontSize: "0.65rem",
          }}
        >
          {workspaceTitle}
        </Typography>

        {workspaceLinks.map((item) => (
          <MenuItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleCloseMenus}
            sx={desktopMenuItemStyle(
              isActive(item.path),
            )}
          >
            {item.icon}
            {item.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Desktop Account Menu */}
      <Menu
        anchorEl={accountAnchor}
        open={Boolean(accountAnchor)}
        onClose={() => setAccountAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.3,
              minWidth: 230,
              borderRadius: "17px",
              border: "1px solid #E3EBE7",
              boxShadow:
                "0 16px 45px rgba(25, 65, 49, 0.12)",
              py: 0.8,
            },
          },
        }}
      >
        <Box sx={{ px: 2.5, py: 1.3 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 750 }}
          >
            {profileName}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            {roleLabel}
          </Typography>
        </Box>

        <Divider sx={{ my: 0.7 }} />

        <MenuItem
          component={Link}
          to="/profile"
          onClick={handleCloseMenus}
          sx={desktopMenuItemStyle(
            isActive("/profile"),
          )}
        >
          <PersonOutlineRoundedIcon />
          My Profile
        </MenuItem>

        <Divider sx={{ my: 0.7 }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            ...desktopMenuItemStyle(false),
            color: "#C75C59",

            "& .MuiSvgIcon-root": {
              color: "#C75C59",
            },

            "&:hover": {
              backgroundColor: "#FFF1F0",
            },
          }}
        >
          <LogoutRoundedIcon />
          Log Out
        </MenuItem>
      </Menu>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: {
                xs: "min(340px, 88vw)",
                sm: 360,
              },
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
              border: "none",
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            component={Link}
            to="/"
            onClick={handleCloseMenus}
          >
            <Box
              component="img"
              src={pawBuddyLogo}
              alt="PawBuddy"
              sx={{
                width: 155,
                height: "auto",
              }}
            />
          </Box>

          <IconButton
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            sx={{
              backgroundColor: "#F0F6F2",
              color: "primary.main",
              borderRadius: "10px",
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Scrollable Drawer Links */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
          }}
        >
          {isLoggedIn && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                mb: 2.5,
                borderRadius: "15px",
                backgroundColor: "#F0F7F3",
                border: "1px solid #E1EEE6",
              }}
            >
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: "#D5EBDF",
                  color: "primary.main",
                  fontWeight: 800,
                }}
              >
                {profileInitial}
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ fontWeight: 750 }}
                >
                  {profileName}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {roleLabel}
                </Typography>
              </Box>
            </Box>
          )}

          <Typography
            variant="overline"
            sx={{
              px: 2,
              color: "text.secondary",
              fontWeight: 800,
              letterSpacing: "0.13em",
              fontSize: "0.66rem",
            }}
          >
            Explore
          </Typography>

          <List disablePadding sx={{ mt: 1 }}>
            {publicLinks.map((item) => (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                onClick={handleCloseMenus}
                sx={drawerLinkStyle(
                  isActive(item.path),
                )}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                />
              </ListItemButton>
            ))}

            {isLoggedIn &&
              user.role === "adopter" && (
                <ListItemButton
                  component={Link}
                  to="/donate"
                  onClick={handleCloseMenus}
                  sx={drawerLinkStyle(
                    isActive("/donate"),
                  )}
                >
                  <ListItemIcon>
                    <VolunteerActivismRoundedIcon />
                  </ListItemIcon>

                  <ListItemText primary="Donate" />
                </ListItemButton>
              )}

            {isLoggedIn && dashboardPath && (
              <ListItemButton
                component={Link}
                to={dashboardPath}
                onClick={handleCloseMenus}
                sx={drawerLinkStyle(
                  isActive(dashboardPath),
                )}
              >
                <ListItemIcon>
                  <DashboardRoundedIcon />
                </ListItemIcon>

                <ListItemText primary="Dashboard" />
              </ListItemButton>
            )}
          </List>

          {isLoggedIn && workspaceLinks.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />

              <Typography
                variant="overline"
                sx={{
                  px: 2,
                  color: "text.secondary",
                  fontWeight: 800,
                  letterSpacing: "0.13em",
                  fontSize: "0.66rem",
                }}
              >
                {workspaceTitle}
              </Typography>

              <List disablePadding sx={{ mt: 1 }}>
                {workspaceLinks.map((item) => (
                  <ListItemButton
                    key={item.path}
                    component={Link}
                    to={item.path}
                    onClick={handleCloseMenus}
                    sx={drawerLinkStyle(
                      isActive(item.path),
                    )}
                  >
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.label}
                    />
                  </ListItemButton>
                ))}
              </List>
            </>
          )}

          {isLoggedIn && (
            <>
              <Divider sx={{ my: 2 }} />

              <Typography
                variant="overline"
                sx={{
                  px: 2,
                  color: "text.secondary",
                  fontWeight: 800,
                  letterSpacing: "0.13em",
                  fontSize: "0.66rem",
                }}
              >
                Account
              </Typography>

              <List disablePadding sx={{ mt: 1 }}>
                <ListItemButton
                  component={Link}
                  to="/profile"
                  onClick={handleCloseMenus}
                  sx={drawerLinkStyle(
                    isActive("/profile"),
                  )}
                >
                  <ListItemIcon>
                    <PersonOutlineRoundedIcon />
                  </ListItemIcon>

                  <ListItemText primary="My Profile" />
                </ListItemButton>
              </List>
            </>
          )}
        </Box>

        {/* Drawer Footer */}
        <Box
          sx={{
            p: 2.5,
            borderTop: "1px solid #E3EBE7",
            backgroundColor: "#FFFFFF",
          }}
        >
          {isLoggedIn ? (
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<LogoutRoundedIcon />}
              onClick={handleLogout}
              sx={{
                py: 1.3,
                borderRadius: "12px",
                fontWeight: 750,
              }}
            >
              Log Out
            </Button>
          ) : (
            <Stack spacing={1.5}>
              <Button
                component={Link}
                to="/register"
                onClick={handleCloseMenus}
                variant="contained"
                fullWidth
                sx={{
                  py: 1.25,
                  borderRadius: "12px",
                }}
              >
                Join PawBuddy
              </Button>

              <Button
                component={Link}
                to="/login"
                onClick={handleCloseMenus}
                variant="outlined"
                fullWidth
                sx={{
                  py: 1.25,
                  borderRadius: "12px",
                }}
              >
                Log In
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;