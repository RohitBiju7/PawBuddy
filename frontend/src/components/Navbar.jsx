import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Container,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

import pawBuddyLogo from "../assets/pawbuddy-logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    handleMenuClose();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: "70px",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Box
              component="img"
              src={pawBuddyLogo}
              alt="PawBuddy Logo"
              sx={{
                height: {
                  xs: 42,
                  sm: 48,
                },
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button component={Link} to="/" color="inherit">
              Home
            </Button>

            <Button component={Link} to="/pets" color="inherit">
              Pets
            </Button>

            {token && user && (
              <>
                <Button component={Link} to="/profile" color="inherit">
                  Profile
                </Button>

                {user.role === "adopter" && (
                  <Button
                    component={Link}
                    to="/my-applications"
                    color="inherit"
                  >
                    My Applications
                  </Button>
                )}

                {user.role === "admin" && (
                  <>
                    <Button component={Link} to="/admin" color="inherit">
                      Admin Dashboard
                    </Button>

                    <Button component={Link} to="/admin/users" color="inherit">
                      Users
                    </Button>
                  </>
                )}

                {user.role === "staff" && (
                  <>
                    <Button component={Link} to="/staff" color="inherit">
                      Staff Dashboard
                    </Button>

                    <Button component={Link} to="/staff/pets" color="inherit">
                      Manage Pets
                    </Button>
                  </>
                )}

                <Button
                  onClick={handleLogout}
                  variant="text"
                  color="inherit"
                  startIcon={<LogoutIcon />}
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Logout
                </Button>
              </>
            )}

            {!token && (
              <>
                <Button component={Link} to="/login" color="inherit">
                  Login
                </Button>

                <Button component={Link} to="/register" color="inherit">
                  Register
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Navigation */}
          <Box
            sx={{
              display: {
                xs: "block",
                md: "none",
              },
            }}
          >
            <IconButton
              onClick={handleMenuOpen}
              color="inherit"
              aria-label="open navigation menu"
            >
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                Home
              </MenuItem>

              <MenuItem component={Link} to="/pets" onClick={handleMenuClose}>
                Pets
              </MenuItem>

              {token && user && (
                <>
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleMenuClose}
                  >
                    Profile
                  </MenuItem>

                  {user.role === "adopter" && (
                    <MenuItem
                      component={Link}
                      to="/my-applications"
                      onClick={handleMenuClose}
                    >
                      My Applications
                    </MenuItem>
                  )}

                  {user.role === "admin" && (
                    <>
                      <MenuItem
                        component={Link}
                        to="/admin"
                        onClick={handleMenuClose}
                      >
                        Admin Dashboard
                      </MenuItem>

                      <MenuItem
                        component={Link}
                        to="/admin/users"
                        onClick={handleMenuClose}
                      >
                        Users
                      </MenuItem>
                    </>
                  )}

                  {user.role === "staff" && (
                    <>
                      <MenuItem
                        component={Link}
                        to="/staff"
                        onClick={handleMenuClose}
                      >
                        Staff Dashboard
                      </MenuItem>

                      <MenuItem
                        component={Link}
                        to="/staff/pets"
                        onClick={handleMenuClose}
                      >
                        Manage Pets
                      </MenuItem>
                    </>
                  )}

                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1.5 }} />
                    Logout
                  </MenuItem>
                </>
              )}

              {!token && (
                <>
                  <MenuItem
                    component={Link}
                    to="/login"
                    onClick={handleMenuClose}
                  >
                    Login
                  </MenuItem>

                  <MenuItem
                    component={Link}
                    to="/register"
                    onClick={handleMenuClose}
                  >
                    Register
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
