import axiosInstance from "./axiosInterceptor";

export const loginUser = async (loginData) => {
  const response = await axiosInstance.post("/users/login", loginData);
  return response.data;
};