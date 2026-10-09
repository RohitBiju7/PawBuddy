import axiosInstance from "./axiosInterceptor";

export const getAdminDashboardStats = async () => {
  const response = await axiosInstance.get(
    "/dashboard/admin",
  );

  return response.data;
};