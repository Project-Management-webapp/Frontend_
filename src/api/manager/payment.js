import api from "../index";

// Get all payments
export const getAllPayments = async () => {
  try {
    const response = await api.get("/manager/payments/");
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error.response?.data || error;
  }
};

// Get payment by ID
export const getPaymentById = async (paymentId) => {
  try {
    const response = await api.get(`/manager/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw error.response?.data || error;
  }
};

// Approve payment request
export const approvePayment = async (paymentId, approvalData) => {
  try {
    const response = await api.post(`/manager/payments/${paymentId}/approve`, approvalData);
    return response.data;
  } catch (error) {
    console.error("Error approving payment:", error);
    throw error.response?.data || error;
  }
};

// Reject payment request
export const rejectPayment = async (paymentId, rejectionData) => {
  try {
    const response = await api.post(`/manager/payments/${paymentId}/reject`, rejectionData);
    return response.data;
  } catch (error) {
    console.error("Error rejecting payment:", error);
    throw error.response?.data || error;
  }
};
