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

export const createDonationOrder = async (amount) => {
  const response = await axiosInstance.post(
    "/payments/donation/create-order",
    {
      amount,
    },
  );

  return response.data;
};

export const verifyDonationPayment = async (
  paymentData,
) => {
  const response = await axiosInstance.post(
    "/payments/donation/verify",
    paymentData,
  );

  return response.data;
};

export const getMyDonations = async () => {
  const response = await axiosInstance.get(
    "/payments/donation/my",
  );

  return response.data;
};

export const getAllDonations = async () => {
  const response = await axiosInstance.get(
    "/payments/donation",
  );

  return response.data;
};