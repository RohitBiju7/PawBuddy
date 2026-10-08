import axiosInstance from "./axiosInterceptor";

export const applyForAdoption = async (applicationData) => {
  const response = await axiosInstance.post("/adoptions", applicationData);
  return response.data;
};

export const getMyApplications = async () => {
  const response = await axiosInstance.get("/adoptions/my");
  return response.data;
};

export const getAllApplications = async () => {
  const response = await axiosInstance.get("/adoptions");
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/adoptions/${id}/status`, {
    status,
  });

  return response.data;
};

export const cancelAdoption = async (id) => {
  const response = await axiosInstance.delete(`/adoptions/${id}`);
  return response.data;
};