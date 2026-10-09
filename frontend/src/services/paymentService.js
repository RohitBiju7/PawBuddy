import axiosInstance from "./axiosInterceptor";

export const createAdoptionFeeOrder = async (adoptionId) => {
  const response = await axiosInstance.post(
    "/payments/adoption/create-order",
    {
      adoptionId,
    },
  );

  return response.data;
};

export const verifyAdoptionFeePayment = async (
  paymentData,
) => {
  const response = await axiosInstance.post(
    "/payments/adoption/verify",
    paymentData,
  );

  return response.data;
};

export const getAdoptionPaymentStatus = async (
  adoptionId,
) => {
  const response = await axiosInstance.get(
    `/payments/adoption/${adoptionId}`,
  );

  return response.data;
};

export const getAdoptionPaymentStatusForStaff = async (
  adoptionId,
) => {
  const response = await axiosInstance.get(
    `/payments/adoption/${adoptionId}/staff`,
  );

  return response.data;
};