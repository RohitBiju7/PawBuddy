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
  Divider,
} from "@mui/material";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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
};
const formatLabel = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not specified";
  }
  const text = String(value);
  return text.charAt(0).toUpperCase() + text.slice(1);
};
const getStatusAppearance = (status) => {
  if (status === "available") {
    return {
      label: "Available",
      background: "#E0F3E7",
      color: "#246A52",
    };
  }
  if (status === "pending") {
    return {
      label: "Reserved",
      background: "#FFF0DC",
      color: "#95621F",
    };
  }
  if (status === "adopted") {
    return {
      label: "Adopted",
      background: "#E7F0F8",
      color: "#397A98",
    };
  }
  return {
    label: formatLabel(status),
    background: "#EDF1EF",
    color: "#60746D",
  };
};
const ManagePets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
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
  // Release temporary image previews after replacement or dialog closure.
  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };
  const handleAddOpen = () => {
    setEditingPet(null);
    setFormData({ ...initialFormData });
    setImage(null);
    setImagePreview("");
    setError("");
    setSuccess("");
    setOpen(true);
  };
  const handleEditOpen = (pet) => {
    if (pet.status !== "available") {
      setError(
        "This pet cannot be edited because its adoption process has already started.",
      );
      return;
    }
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
    });
    setImage(null);
    setImagePreview(
      pet.image
        ? `/uploads/${pet.image}`
        : "",
    );
    setError("");
    setSuccess("");
    setOpen(true);
  };
  const handleClose = () => {
    if (submitting) return;
    setOpen(false);
    setEditingPet(null);
    setFormData({ ...initialFormData });
    setImage(null);
    setImagePreview("");
    setError("");
  };
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setError("");
    setSuccess("");
    setSubmitting(true);
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
      if (image) {
        petData.append("image", image);
      }
      if (editingPet) {
        await updatePet(editingPet._id, petData);
      } else {
        await addPet(petData);
      }
      setOpen(false);
      setEditingPet(null);
      setFormData({ ...initialFormData });
      setImage(null);
      setImagePreview("");
      await fetchPets();
      setSuccess(
        editingPet
          ? "Pet updated successfully."
          : "Pet added successfully.",
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to save pet. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async (pet) => {
    let confirmationMessage =
      `Are you sure you want to permanently delete ${pet.name}?`;
    if (pet.status === "pending") {
      confirmationMessage =
        `${pet.name} currently has an adoption in progress. ` +
        "Deleting it may cancel affected applications and notify adopters. Continue?";
    }
    if (pet.status === "adopted") {
      confirmationMessage =
        `${pet.name} has already been adopted. ` +
        "Are you sure you want to permanently remove this pet from PawBuddy?";
    }
    if (!window.confirm(confirmationMessage)) return;
    try {
      setDeletingId(pet._id);
      setError("");
      setSuccess("");
      const data = await deletePet(pet._id);
      setPets((currentPets) =>
        currentPets.filter((currentPet) => currentPet._id !== pet._id),
      );
      setSuccess(data?.message || "Pet deleted successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to delete pet.",
      );
    } finally {
      setDeletingId(null);
    }
  };
  const summary = [
    {
      label: "Total Pets",
      count: pets.length,
      icon: <PetsRoundedIcon />,
      background: "#E9F4EF",
      color: "#2F7D6D",
    },
    {
      label: "Available",
      count: pets.filter((pet) => pet.status === "available").length,
      icon: <CheckCircleRoundedIcon />,
      background: "#E0F3E7",
      color: "#2F7D6D",
    },
    {
      label: "Reserved",
      count: pets.filter((pet) => pet.status === "pending").length,
      icon: <HourglassTopRoundedIcon />,
      background: "#FFF0DC",
      color: "#B37B33",
    },
    {
      label: "Adopted",
      count: pets.filter((pet) => pet.status === "adopted").length,
      icon: <FavoriteRoundedIcon />,
      background: "#E7F0F8",
      color: "#397A98",
    },
  ];
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 78px)",
        backgroundColor: "background.default",
        pb: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
        {/* Introduction */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: { xs: "22px", md: "28px" },
            background:
              "linear-gradient(120deg, #E8F5EE 0%, #F7FBF8 58%, #FFF4EC 100%)",
            border: "1px solid #DDEBE3",
            mb: 4,
          }}
        >
          <PetsRoundedIcon
            aria-hidden="true"
            sx={{
              position: "absolute",
              right: { xs: -45, md: 22 },
              top: -60,
              fontSize: { xs: 170, md: 245 },
              color: "rgba(47,125,109,0.07)",
              transform: "rotate(-20deg)",
              pointerEvents: "none",
            }}
          />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box sx={{ maxWidth: 590 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <PetsRoundedIcon sx={{ fontSize: 19, color: "primary.main" }} />
                <Typography
                  variant="overline"
                  sx={{ color: "primary.main", fontWeight: 800, letterSpacing: "0.12em" }}
                >
                  SHELTER WORKSPACE
                </Typography>
              </Stack>
              <Typography
                component="h1"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.15,
                  color: "text.primary",
                  fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.1rem" },
                  mb: 1.5,
                }}
              >
                Manage <Box component="span" sx={{ color: "primary.main" }}>Pets</Box>
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Keep every pet's profile up to date and help more animals find
                their forever homes.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={handleAddOpen}
              sx={{
                alignSelf: { xs: "stretch", sm: "center" },
                flexShrink: 0,
                py: 1.4,
                px: 3,
                borderRadius: "12px",
                fontWeight: 800,
                whiteSpace: "nowrap",
              }}
            >
              Add New Pet
            </Button>
          </Stack>
        </Box>
        {error && !open && (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>
        )}
        {loading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ minHeight: 340 }}
          >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading pet listings...
            </Typography>
          </Stack>
        ) : (
          <>
            {/* Inventory overview */}
            <Grid container spacing={2} sx={{ mb: 4.5 }}>
              {summary.map((item) => (
                <Grid key={item.label} size={{ xs: 6, md: 3 }}>
                  <Card sx={{ height: "100%", borderRadius: "18px" }}>
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 }, "&:last-child": { pb: { xs: 2, sm: 2.5 } } }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 600, mb: 0.5 }}
                          >
                            {item.label}
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 800 }}>
                            {item.count}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: { xs: 39, sm: 48 },
                            height: { xs: 39, sm: 48 },
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "14px",
                            backgroundColor: item.background,
                            color: item.color,
                          }}
                        >
                          {item.icon}
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Your Pet Listings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Edit available pets or manage listings that are reserved or adopted.
                </Typography>
              </Box>
              <Button
                onClick={fetchPets}
                variant="outlined"
                startIcon={<RefreshRoundedIcon />}
                sx={{ borderRadius: "11px", flexShrink: 0 }}
              >
                Refresh
              </Button>
            </Stack>
            {/* Pet cards */}
            <Grid container spacing={3}>
              {pets.map((pet) => {
                const status = getStatusAppearance(pet.status);
                const canEdit = pet.status === "available";
                const fee = Number(pet.adoptionFee || 0);
                return (
                  <Grid key={pet._id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        borderRadius: "22px",
                        border: "1px solid #E2ECE6",
                        boxShadow: "0 7px 22px rgba(39,81,62,0.05)",
                        transition: "transform 0.25s ease, box-shadow 0.25s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 15px 32px rgba(39,81,62,0.11)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          height: 226,
                          backgroundColor: "#E9F3EF",
                          overflow: "hidden",
                        }}
                      >
                        {pet.image ? (
                          <Box
                            component="img"
                            src={`/uploads/${pet.image}`}
                            alt={pet.name}
                            loading="lazy"
                            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <Stack
                            justifyContent="center"
                            alignItems="center"
                            spacing={1}
                            sx={{ height: "100%", color: "#8ABBA8" }}
                          >
                            <PetsRoundedIcon sx={{ fontSize: 64 }} />
                            <Typography variant="body2" color="text.secondary">
                              No image available
                            </Typography>
                          </Stack>
                        )}
                        <Chip
                          label={status.label}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 15,
                            left: 15,
                            fontWeight: 800,
                            backgroundColor: status.background,
                            color: status.color,
                            boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                          }}
                        />
                      </Box>
                      <CardContent
                        sx={{
                          p: { xs: 2.5, sm: 3 },
                          display: "flex",
                          flexDirection: "column",
                          flexGrow: 1,
                          "&:last-child": { pb: { xs: 2.5, sm: 3 } },
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                          {pet.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                          {formatLabel(pet.species)} · {pet.breed || "Mixed breed"}
                        </Typography>
                        <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                          {[
                            ["Age", pet.age],
                            ["Gender", formatLabel(pet.gender)],
                            ["Health", pet.healthStatus],
                            ["Vaccination", formatLabel(pet.vaccinationStatus)],
                          ].map(([label, value]) => (
                            <Grid key={label} size={{ xs: 6 }}>
                              <Box
                                sx={{
                                  height: "100%",
                                  p: 1.5,
                                  borderRadius: "12px",
                                  backgroundColor: "#F7FAF9",
                                  border: "1px solid #E8F0EA",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ display: "block", mb: 0.5 }}
                                >
                                  {label}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 750, overflowWrap: "anywhere" }}
                                >
                                  {value === "" || value == null ? "Not specified" : value}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                        <Box
                          sx={{
                            p: 2,
                            mb: 2,
                            borderRadius: "13px",
                            backgroundColor: "#EAF5EF",
                            border: "1px solid #DDEDE3",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 650 }}>
                            Adoption fee
                          </Typography>
                          <Typography sx={{ color: "primary.main", fontWeight: 800 }}>
                            {fee === 0 ? "Free" : `₹${fee.toLocaleString("en-IN")}`}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap", overflowWrap: "anywhere", mb: 2.5 }}
                        >
                          {pet.description || "No description provided."}
                        </Typography>
                        <Divider sx={{ mt: "auto", mb: 2 }} />
                        {!canEdit && (
                          <Alert
                            icon={<LockOutlinedIcon fontSize="inherit" />}
                            severity={pet.status === "pending" ? "warning" : "info"}
                            sx={{ mb: 2, fontSize: "0.8rem" }}
                          >
                            {pet.status === "pending"
                              ? "Adoption in progress. Pet details are locked."
                              : "This pet has been adopted. Pet details are locked."}
                          </Alert>
                        )}
                        <Stack direction="row" spacing={1.5}>
                          {canEdit && (
                            <Button
                              variant="outlined"
                              fullWidth
                              startIcon={<EditRoundedIcon />}
                              onClick={() => handleEditOpen(pet)}
                              sx={{ borderRadius: "11px", minWidth: 0 }}
                            >
                              Edit
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            startIcon={<DeleteOutlineRoundedIcon />}
                            disabled={deletingId === pet._id}
                            onClick={() => handleDelete(pet)}
                            sx={{ borderRadius: "11px", minWidth: 0 }}
                          >
                            {deletingId === pet._id
                              ? "Deleting..."
                              : pet.status === "adopted"
                                ? "Remove Pet"
                                : "Delete"}
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
              {pets.length === 0 && (
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      p: { xs: 4, md: 8 },
                      textAlign: "center",
                      borderRadius: "22px",
                      border: "1px dashed #BDD9CA",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <Box
                      sx={{
                        width: 84,
                        height: 84,
                        mx: "auto",
                        mb: 2.5,
                        borderRadius: "23px",
                        backgroundColor: "#E5F3EB",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <PetsRoundedIcon sx={{ fontSize: 45, color: "primary.main" }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                      No pets listed yet
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
                      Add your first pet to help them find a loving home.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddRoundedIcon />}
                      onClick={handleAddOpen}
                    >
                      Add a Pet
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </>
        )}
        {/* Add / edit pet dialog */}
        <Dialog
          open={open}
          onClose={submitting ? undefined : handleClose}
          fullWidth
          maxWidth="md"
          scroll="paper"
          slotProps={{
            paper: {
              component: "form",
              onSubmit: handleSubmit,
              sx: { borderRadius: "22px", overflow: "hidden" },
            },
          }}
        >
            <Box
              sx={{
                background: "linear-gradient(115deg, #E8F5EE 0%, #FFF5ED 100%)",
                p: { xs: 3, sm: 4 },
                flexShrink: 0,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 49,
                    height: 49,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "15px",
                    backgroundColor: "#D9EEE3",
                    color: "primary.main",
                    flexShrink: 0,
                  }}
                >
                  {editingPet ? <EditRoundedIcon /> : <AddRoundedIcon />}
                </Box>
                <Box>
                  <DialogTitle sx={{ p: 0, fontWeight: 800, fontSize: "1.5rem" }}>
                    {editingPet ? "Edit Pet" : "Add New Pet"}
                  </DialogTitle>
                  <Typography variant="body2" color="text.secondary">
                    {editingPet
                      ? "Update this pet's profile and photograph."
                      : "Create a profile for a pet ready for adoption."}
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <DialogContent
              sx={{ p: { xs: 3, sm: 4 }, minHeight: 0, overflowY: "auto" }}
            >
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
                Basic Information
              </Typography>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Pet Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
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
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    inputProps={{ min: 0 }}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
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
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Adoption Fee (₹)"
                    type="number"
                    name="adoptionFee"
                    value={formData.adoptionFee}
                    onChange={handleChange}
                    inputProps={{ min: 0 }}
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
                Health & Description
              </Typography>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Health Status"
                    name="healthStatus"
                    value={formData.healthStatus}
                    onChange={handleChange}
                    placeholder="Example: Healthy"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
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
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                Pet Photograph
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Upload a JPEG, PNG or WebP image. You can leave this blank.
              </Typography>
              <Box
                sx={{
                  border: "1.5px dashed #BEDBCB",
                  backgroundColor: "#F7FBF8",
                  borderRadius: "16px",
                  p: 2.5,
                }}
              >
                <Stack spacing={2} alignItems="center">
                  {imagePreview ? (
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Pet image preview"
                      sx={{
                        width: "100%",
                        maxHeight: 235,
                        objectFit: "contain",
                        borderRadius: "12px",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "18px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#E3F2E8",
                        color: "primary.main",
                      }}
                    >
                      <ImageOutlinedIcon sx={{ fontSize: 34 }} />
                    </Box>
                  )}
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadOutlinedIcon />}
                    sx={{ borderRadius: "11px", maxWidth: "100%" }}
                  >
                    {image
                      ? "Change Selected Image"
                      : editingPet
                        ? "Choose New Image (Optional)"
                        : "Choose Pet Image (Optional)"}
                    <input
                      type="file"
                      hidden
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                    />
                  </Button>
                  {image && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ overflowWrap: "anywhere", textAlign: "center" }}
                    >
                      {image.name}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </DialogContent>
            <DialogActions
              sx={{
                borderTop: "1px solid #E7EEE9",
                p: { xs: 2.5, sm: 3 },
                flexShrink: 0,
                gap: 1,
              }}
            >
              <Button onClick={handleClose} color="inherit" disabled={submitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={17} color="inherit" /> : undefined}
                sx={{ borderRadius: "11px", px: 3, py: 1.2, fontWeight: 800 }}
              >
                {submitting
                  ? "Saving..."
                  : editingPet
                    ? "Update Pet"
                    : "Add Pet"}
              </Button>
            </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};
export default ManagePets;
