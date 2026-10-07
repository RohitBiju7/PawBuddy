import React, { useEffect, useState } from "react";

import {
  getAllPets,
  addPet,
  updatePet,
  deletePet,
} from "../../services/petService";

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";

const ManagePets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [open, setOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const initialFormData = {
    name: "",
    species: "dog",
    breed: "",
    age: "",
    gender: "male",
    description: "",
    healthStatus: "",
    vaccinationStatus: "not vaccinated",
    adoptionFee: "",
    status: "available",
  };

  const [formData, setFormData] = useState(initialFormData);

  const fetchPets = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllPets();

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
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddOpen = () => {
    setEditingPet(null);
    setFormData(initialFormData);
    setImage(null);
    setImagePreview("");
    setError("");
    setSuccess("");
    setOpen(true);
  };

  const handleEditOpen = (pet) => {
    setEditingPet(pet);

    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      description: pet.description,
      healthStatus: pet.healthStatus,
      vaccinationStatus: pet.vaccinationStatus,
      adoptionFee: pet.adoptionFee,
      status: pet.status,
    });

    setImage(null);

    setImagePreview(
      pet.image ? `http://localhost:5000/uploads/${pet.image}` : "",
    );

    setError("");
    setSuccess("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPet(null);
    setFormData(initialFormData);
    setImage(null);
    setImagePreview("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const petData = new FormData();

      petData.append("name", formData.name);
      petData.append("species", formData.species);
      petData.append("breed", formData.breed);
      petData.append("age", formData.age);
      petData.append("gender", formData.gender);
      petData.append("description", formData.description);
      petData.append("healthStatus", formData.healthStatus);
      petData.append("vaccinationStatus", formData.vaccinationStatus);
      petData.append("adoptionFee", formData.adoptionFee);

      if (editingPet) {
        petData.append("status", formData.status);
      }

      if (image) {
        petData.append("image", image);
      }

      if (editingPet) {
        await updatePet(editingPet._id, petData);
        setSuccess("Pet updated successfully.");
      } else {
        await addPet(petData);
        setSuccess("Pet added successfully.");
      }

      handleClose();
      await fetchPets();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to save pet. Please try again.",
      );
    }
  };

  const handleDelete = async (petId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this pet?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deletePet(petId);

      setPets((currentPets) => currentPets.filter((pet) => pet._id !== petId));

      setSuccess("Pet deleted successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete pet.");
    }
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                mb: 1,
              }}
            >
              Manage Pets
            </Typography>

            <Typography color="text.secondary">
              Add, update and remove pets available for adoption.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={handleAddOpen}
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Add Pet
          </Button>
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

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
            }}
          >
            {success}
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
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                  }}
                >
                  {pet.image && (
                    <Box
                      component="img"
                      src={`http://localhost:5000/uploads/${pet.image}`}
                      alt={pet.name}
                      sx={{
                        width: "100%",
                        height: 220,
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "primary.main",
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      {pet.name}
                    </Typography>

                    <Stack spacing={1.2}>
                      <Typography color="text.secondary">
                        <strong>Species:</strong> {pet.species}
                      </Typography>

                      <Typography color="text.secondary">
                        <strong>Breed:</strong> {pet.breed}
                      </Typography>

                      <Typography color="text.secondary">
                        <strong>Age:</strong> {pet.age}
                      </Typography>

                      <Typography color="text.secondary">
                        <strong>Gender:</strong> {pet.gender}
                      </Typography>

                      <Typography color="text.secondary">
                        <strong>Health:</strong> {pet.healthStatus}
                      </Typography>

                      <Typography color="text.secondary">
                        <strong>Vaccination:</strong> {pet.vaccinationStatus}
                      </Typography>

                      <Typography color="text.secondary">
                        <strong>Adoption Fee:</strong> ₹{pet.adoptionFee}
                      </Typography>

                      <Box>
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
                      </Box>

                      <Typography
                        color="text.secondary"
                        sx={{
                          pt: 1,
                        }}
                      >
                        {pet.description}
                      </Typography>
                    </Stack>

                    <Stack
                      direction={{
                        xs: "column",
                        sm: "row",
                      }}
                      spacing={1.5}
                      sx={{
                        mt: 3,
                      }}
                    >
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleEditOpen(pet)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() => handleDelete(pet._id)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {pets.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Typography
                  align="center"
                  color="text.secondary"
                  sx={{
                    py: 5,
                  }}
                >
                  No pets have been added yet.
                </Typography>
              </Grid>
            )}
          </Grid>
        )}

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <Box component="form" onSubmit={handleSubmit}>
            <DialogTitle>{editingPet ? "Edit Pet" : "Add Pet"}</DialogTitle>

            <DialogContent>
              <Stack
                spacing={2.5}
                sx={{
                  mt: 1,
                }}
              >
                <TextField
                  label="Pet Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <TextField
                  select
                  label="Species"
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  required
                  fullWidth
                >
                  <MenuItem value="dog">Dog</MenuItem>
                  <MenuItem value="cat">Cat</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>

                <TextField
                  label="Breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <TextField
                  label="Age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  inputProps={{
                    min: 0,
                  }}
                  required
                  fullWidth
                />

                <TextField
                  select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  fullWidth
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </TextField>

                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    textTransform: "none",
                    py: 1.4,
                  }}
                >
                  {image ? image.name : "Choose Pet Image (Optional)"}

                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                  />
                </Button>

                {imagePreview && (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Pet preview"
                    sx={{
                      width: "100%",
                      maxHeight: 250,
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />
                )}

                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  required
                  fullWidth
                />

                <TextField
                  label="Health Status"
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleChange}
                  placeholder="Example: Healthy"
                  required
                  fullWidth
                />

                <TextField
                  select
                  label="Vaccination Status"
                  name="vaccinationStatus"
                  value={formData.vaccinationStatus}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="vaccinated">Vaccinated</MenuItem>

                  <MenuItem value="not vaccinated">Not Vaccinated</MenuItem>

                  <MenuItem value="partial">Partial</MenuItem>
                </TextField>

                <TextField
                  label="Adoption Fee"
                  type="number"
                  name="adoptionFee"
                  value={formData.adoptionFee}
                  onChange={handleChange}
                  inputProps={{
                    min: 0,
                  }}
                  required
                  fullWidth
                />

                {editingPet && (
                  <TextField
                    select
                    label="Adoption Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value="available">Available</MenuItem>

                    <MenuItem value="pending">Pending</MenuItem>

                    <MenuItem value="adopted">Adopted</MenuItem>
                  </TextField>
                )}
              </Stack>
            </DialogContent>

            <DialogActions
              sx={{
                p: 3,
              }}
            >
              <Button
                onClick={handleClose}
                color="inherit"
                sx={{
                  textTransform: "none",
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {editingPet ? "Update Pet" : "Add Pet"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ManagePets;
