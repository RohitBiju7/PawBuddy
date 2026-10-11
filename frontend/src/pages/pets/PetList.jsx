import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
} from "@mui/material";

import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

import { getAllPets } from "../../services/petService";

const defaultFilters = {
  search: "",
  species: "",
  gender: "",
  status: "available",
};

const formatLabel = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "Not specified";

const getStatusAppearance = (status) => {
  if (status === "available") {
    return {
      label: "Available",
      background: "#E3F3E9",
      foreground: "#246A52",
    };
  }

  if (status === "pending") {
    return {
      label: "Reserved",
      background: "#FFF0DC",
      foreground: "#9A601E",
    };
  }

  return {
    label: formatLabel(status),
    background: "#F0F2F2",
    foreground: "#5A6D65",
  };
};

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(defaultFilters);

  const fetchPets = async (activeFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (activeFilters.search) {
        params.search = activeFilters.search;
      }

      if (activeFilters.species) {
        params.species = activeFilters.species;
      }

      if (activeFilters.gender) {
        params.gender = activeFilters.gender;
      }

      if (activeFilters.status) {
        params.status = activeFilters.status;
      }

      const data = await getAllPets(params);
      setPets(data.pets || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load pets. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [filters.species, filters.gender, filters.status]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchPets();
  };

  const handleClearFilters = () => {
    const categoryChanged =
      filters.species !== "" ||
      filters.gender !== "" ||
      filters.status !== "available";

    setFilters({ ...defaultFilters });

    // Dropdown changes trigger the effect;
    // clearing only search does not.
    if (!categoryChanged) {
      fetchPets(defaultFilters);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 78px)",
        backgroundColor: "background.default",
        pb: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
        {/* Page Introduction */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 3, sm: 4, md: 5 },
            pb: { xs: 5, md: 6 },
            borderRadius: { xs: "22px", md: "28px" },
            background:
              "linear-gradient(118deg, #EAF5EF 0%, #F4FAF6 57%, #FFF5ED 100%)",
            border: "1px solid #DCEBE2",
          }}
        >
          <PetsRoundedIcon
            aria-hidden="true"
            sx={{
              position: "absolute",
              fontSize: { xs: 155, md: 240 },
              right: { xs: -42, md: 28 },
              top: { xs: -55, md: -50 },
              color: "rgba(47,125,109,0.065)",
              transform: "rotate(-18deg)",
              pointerEvents: "none",
            }}
          />

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              maxWidth: 680,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 2 }}
            >
              <PetsRoundedIcon
                sx={{
                  fontSize: 19,
                  color: "primary.main",
                }}
              />

              <Typography
                variant="overline"
                sx={{
                  color: "primary.main",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                }}
              >
                MEET YOUR MATCH
              </Typography>
            </Stack>

            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.15,
                color: "text.primary",
                fontSize: {
                  xs: "2.1rem",
                  sm: "2.7rem",
                  md: "3.2rem",
                },
                mb: 2,
              }}
            >
              Find your new
              <Box component="span" sx={{ color: "primary.main" }}>
                {" "}
                best friend.
              </Box>
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                maxWidth: 550,
                lineHeight: 1.8,
                fontSize: {
                  xs: "0.97rem",
                  sm: "1.06rem",
                },
              }}
            >
              A loving companion could be just a few clicks away. Explore pet
              profiles and find the right buddy for your home.
            </Typography>
          </Box>
        </Box>

        {/* Search and Filters */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            position: "relative",
            zIndex: 2,
            mt: -2.5,
            mx: { xs: 1, sm: 2.5 },
            mb: 4.5,
            p: { xs: 2.25, sm: 3 },
            backgroundColor: "#FFFFFF",
            border: "1px solid #E3EBE7",
            borderRadius: "20px",
            boxShadow: "0 12px 32px rgba(36,79,62,0.08)",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mb: 2.5 }}
          >
            <TuneRoundedIcon
              sx={{
                fontSize: 20,
                color: "primary.main",
              }}
            />

            <Typography
              sx={{
                fontWeight: 750,
                color: "text.primary",
              }}
            >
              Find the right companion
            </Typography>
          </Stack>

          <Grid container spacing={2} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Name or breed"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon
                          sx={{
                            color: "#8BA79A",
                            fontSize: 21,
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 6, md: 2 }}>
              <TextField
                select
                label="Species"
                name="species"
                value={filters.species}
                onChange={handleFilterChange}
                fullWidth
              >
                <MenuItem value="">All species</MenuItem>
                <MenuItem value="dog">Dogs</MenuItem>
                <MenuItem value="cat">Cats</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 6, md: 2 }}>
              <TextField
                select
                label="Gender"
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                fullWidth
              >
                <MenuItem value="">All genders</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </TextField>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 2,
              }}
            >
              <TextField
                select
                label="Status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                fullWidth
              >
                <MenuItem value="">All statuses</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="pending">Reserved</MenuItem>
                <MenuItem value="adopted">Adopted</MenuItem>
              </TextField>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 2,
              }}
            >
              <Stack
                direction={{
                  xs: "row",
                  md: "column",
                }}
                spacing={1}
              >
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={<SearchRoundedIcon />}
                  sx={{
                    minHeight: 43,
                    borderRadius: "11px",
                  }}
                >
                  Search
                </Button>

                <Button
                  type="button"
                  variant="text"
                  fullWidth
                  onClick={handleClearFilters}
                  sx={{ minHeight: 35 }}
                >
                  Clear
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Results heading */}
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          spacing={1}
          sx={{ mb: 2.5 }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                mb: 0.5,
              }}
            >
              Meet the pets
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Discover the personalities waiting to meet you.
            </Typography>
          </Box>

          {!loading && !error && (
            <Chip
              label={`${pets.length} ${
                pets.length === 1 ? "pet" : "pets"
              } found`}
              sx={{
                fontWeight: 700,
                backgroundColor: "#E5F3EC",
                color: "#2F7D6D",
              }}
            />
          )}
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ minHeight: 300 }}
          >
            <CircularProgress />

            <Typography color="text.secondary" variant="body2">
              Finding your future companion...
            </Typography>
          </Stack>
        ) : (
          <Grid container spacing={3}>
            {pets.map((pet) => {
              const status = getStatusAppearance(pet.status);

              const fee = Number(pet.adoptionFee || 0);

              return (
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                  }}
                  key={pet._id}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "21px",
                      overflow: "hidden",
                      border: "1px solid #E2ECE6",
                      boxShadow: "0 6px 20px rgba(39,81,62,0.05)",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",

                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 15px 30px rgba(39,81,62,0.12)",
                      },

                      "&:hover .pet-photo": {
                        transform: "scale(1.04)",
                      },
                    }}
                  >
                    {/* Pet Photo */}
                    <Box
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        height: 238,
                        backgroundColor: "#E9F3EF",
                      }}
                    >
                      {pet.image ? (
                        <Box
                          component="img"
                          className="pet-photo"
                          src={`/uploads/${pet.image}`}
                          alt={pet.name}
                          loading="lazy"
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.4s ease",
                          }}
                        />
                      ) : (
                        <Stack
                          alignItems="center"
                          justifyContent="center"
                          spacing={1}
                          sx={{
                            height: "100%",
                            color: "#86B4A4",
                          }}
                        >
                          <PetsRoundedIcon sx={{ fontSize: 66 }} />

                          <Typography variant="body2" color="text.secondary">
                            No Image Available
                          </Typography>
                        </Stack>
                      )}

                      {/* Availability */}
                      <Chip
                        label={status.label}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 16,
                          left: 16,
                          fontWeight: 750,
                          bgcolor: status.background,
                          color: status.foreground,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                        }}
                      />
                    </Box>

                    {/* Pet Information */}
                    <CardContent
                      sx={{
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                        "&:last-child": {
                          pb: 3,
                        },
                      }}
                    >
                      <Typography
                        component="h2"
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          color: "text.primary",
                          mb: 0.25,
                        }}
                      >
                        {pet.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2.5 }}
                      >
                        {formatLabel(pet.species)}
                        {" · "}
                        {pet.breed || "Mixed breed"}
                      </Typography>

                      {/* Details */}
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: 2,
                          mb: 2.5,
                        }}
                      >
                        {[
                          ["Age", pet.age ?? "Not specified"],
                          ["Gender", formatLabel(pet.gender)],
                        ].map(([label, value]) => (
                          <Box key={label}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: "block",
                                mb: 0.5,
                              }}
                            >
                              {label}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 750,
                                color: "text.primary",
                              }}
                            >
                              {value}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      <Divider
                        sx={{
                          mt: "auto",
                          mb: 2,
                        }}
                      />

                      {/* Adoption Fee */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        sx={{
                          mb: 2,
                          width: "100%",
                          gap: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ flexGrow: 1 }}
                        >
                          Adoption fee
                        </Typography>

                        <Typography
                          sx={{
                            fontWeight: 800,
                            color: "primary.main",
                            ml: "auto",
                            whiteSpace: "nowrap",
                            textAlign: "right",
                          }}
                        >
                          {fee === 0
                            ? "Free"
                            : `₹${fee.toLocaleString("en-IN")}`}
                        </Typography>
                      </Stack>

                      <Button
                        component={Link}
                        to={`/pets/${pet._id}`}
                        variant="contained"
                        fullWidth
                        endIcon={<ArrowForwardRoundedIcon />}
                        sx={{
                          py: 1.25,
                          borderRadius: "11px",
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}

            {pets.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    py: {
                      xs: 7,
                      md: 9,
                    },
                    px: 3,
                    textAlign: "center",
                    backgroundColor: "#FFFFFF",
                    border: "1px dashed #C7DCD1",
                    borderRadius: "22px",
                  }}
                >
                  <PetsRoundedIcon
                    sx={{
                      fontSize: 54,
                      color: "#A0C9B8",
                      mb: 1.5,
                    }}
                  />

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 750,
                      mb: 1,
                    }}
                  >
                    No pets found
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Try changing the search term or filters to explore more
                    pets.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default PetList;
