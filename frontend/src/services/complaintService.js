import axiosInstance from "./axiosInterceptor";

export const createComplaint = async (complaintData) => {
  const response = await axiosInstance.post(
    "/complaints",
    complaintData,
  );

  return response.data;
};

export const getMyComplaints = async () => {
  const response = await axiosInstance.get(
    "/complaints/my",
  );

  return response.data;
};

export const getAllComplaints = async (filters = {}) => {
  const response = await axiosInstance.get(
    "/complaints",
    {
      params: filters,
    },
  );

  return response.data;
};

export const deleteOwnComplaint = async (
  complaintId,
) => {
  const response = await axiosInstance.delete(
    `/complaints/${complaintId}`,
  );

  return response.data;
};

export const deleteComplaintByAdmin = async (
  complaintId,
) => {
  const response = await axiosInstance.delete(
    `/complaints/${complaintId}/admin`,
  );

  return response.data;
};