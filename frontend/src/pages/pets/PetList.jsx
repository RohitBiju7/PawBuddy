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
} from "@mui/material";

import { getAllPets } from "../../services/petService";

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    species: "",
    gender: "",
    status: "available",
  });

  const fetchPets = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.species) {
        params.species = filters.species;
      }

      if (filters.gender) {
        params.gender = filters.gender;
      }

      if (filters.status) {
        params.status = filters.status;
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

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPets();
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      species: "",
      gender: "",
      status: "available",
    });
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
            textAlign: {
              xs: "center",
              sm: "left",
            },
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
            Find Your New Best Friend
          </Typography>

          <Typography color="text.secondary">
            Browse pets looking for loving forever homes.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            backgroundColor: "#FFFFFF",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            p: {
              xs: 2,
              sm: 3,
            },
            mb: 4,
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Search by name or breed"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
              <TextField
                select
                label="Species"
                name="species"
                value={filters.species}
                onChange={handleFilterChange}
                fullWidth
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="dog">Dogs</MenuItem>
                <MenuItem value="cat">Cats</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
              <TextField
                select
                label="Gender"
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                fullWidth
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
              <TextField
                select
                label="Status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                fullWidth
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="adopted">Adopted</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Stack spacing={1}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    minHeight: 44,
                  }}
                >
                  Search
                </Button>

                <Button
                  type="button"
                  variant="text"
                  onClick={handleClearFilters}
                  fullWidth
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Clear
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
            }}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              minHeight: 300,
            }}
          >
            <CircularProgress />
          </Stack>
        ) : (
          <Grid container spacing={3}>
            {pets.map((pet) => (
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
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                    transition: "0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  {pet.image ? (
                    <Box
                      component="img"
                      src={`http://localhost:5000/uploads/${pet.image}`}
                      alt={pet.name}
                      sx={{
                        width: "100%",
                        height: 240,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 240,
                        backgroundColor: "#EAF4F1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography color="text.secondary">
                        No Image Available
                      </Typography>
                    </Box>
                  )}

                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={1}
                      sx={{
                        mb: 1.5,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "primary.main",
                          fontWeight: 700,
                        }}
                      >
                        {pet.name}
                      </Typography>

                      <Chip
                        label={pet.status}
                        size="small"
                        color={
                          pet.status === "available"
                            ? "success"
                            : pet.status === "pending"
                              ? "warning"
                              : "default"
                        }
                        sx={{
                          textTransform: "capitalize",
                          fontWeight: 600,
                        }}
                      />
                    </Stack>

                    <Stack spacing={0.7}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Species:</strong> {pet.species}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        <strong>Breed:</strong> {pet.breed}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        <strong>Age:</strong> {pet.age}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        <strong>Gender:</strong> {pet.gender}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        <strong>Adoption Fee:</strong> ₹{pet.adoptionFee}
                      </Typography>
                    </Stack>

                    <Button
                      component={Link}
                      to={`/pets/${pet._id}`}
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: "auto",
                        pt: 1.1,
                        pb: 1.1,
                        top: 20,
                        mb: 2,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {pets.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    py: 8,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                    }}
                  >
                    No pets found
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Try changing your search or filters.
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