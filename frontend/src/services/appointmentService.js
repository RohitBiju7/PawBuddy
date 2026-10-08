import axiosInstance from "./axiosInterceptor";

export const requestAppointment = async (appointmentData) => {
  const response = await axiosInstance.post(
    "/appointments",
    appointmentData,
  );

  return response.data;
};

export const getMyAppointments = async () => {
  const response = await axiosInstance.get(
    "/appointments/my",
  );

  return response.data;
};

export const getAllAppointments = async () => {
  const response = await axiosInstance.get(
    "/appointments",
  );

  return response.data;
};

export const updateAppointmentStatus = async (
  id,
  status,
) => {
  const response = await axiosInstance.patch(
    `/appointments/${id}/status`,
    {
      status,
    },
  );

  return response.data;
};

export const completeAppointment = async (id) => {
  const response = await axiosInstance.patch(
    `/appointments/${id}/complete`,
  );

  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await axiosInstance.delete(
    `/appointments/${id}`,
  );

  return response.data;
};

export const cancelAppointment = async (id) => {
  const response = await axiosInstance.patch(
    `/appointments/${id}/cancel`,
  );

  return response.data;
};