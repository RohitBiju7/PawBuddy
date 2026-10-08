import axiosInstance from "./axiosInterceptor";

export const getAllPets = async (params = {}) => {
  const response = await axiosInstance.get("/pets", { params });
  return response.data;
};

export const getPetById = async (id) => {
  const response = await axiosInstance.get(`/pets/${id}`);
  return response.data;
};

export const addPet = async (petData) => {
  const response = await axiosInstance.post("/pets", petData);
  return response.data;
};

export const updatePet = async (id, petData) => {
  const response = await axiosInstance.patch(`/pets/${id}`, petData);
  return response.data;
};

export const deletePet = async (id) => {
  const response = await axiosInstance.delete(`/pets/${id}`);
  return response.data;
};