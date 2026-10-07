import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

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
          <Typography
            component={Link}
            to="/"
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              textDecoration: "none",
            }}
          >
            PawBuddy
          </Typography>

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

                {user.role === "admin" && (
                  <>
                    <Button component={Link} to="/admin" color="inherit">
                      Admin Dashboard
                    </Button>

                    <Button
                      component={Link}
                      to="/admin/users"
                      color="inherit"
                    >
                      Users
                    </Button>
                  </>
                )}

                {user.role === "staff" && (
                  <>
                    <Button component={Link} to="/staff" color="inherit">
                      Staff Dashboard
                    </Button>

                    <Button
                      component={Link}
                      to="/staff/pets"
                      color="inherit"
                    >
                      Manage Pets
                    </Button>
                  </>
                )}

                <Button
                  onClick={handleLogout}
                  variant="contained"
                  color="secondary"
                  sx={{
                    color: "#FFFFFF",
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

                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="primary"
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>

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
              <MenuItem
                component={Link}
                to="/"
                onClick={handleMenuClose}
              >
                Home
              </MenuItem>

              <MenuItem
                component={Link}
                to="/pets"
                onClick={handleMenuClose}
              >
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