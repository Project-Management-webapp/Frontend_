import api from "../index";

// Get my payments
export const getMyPayments = async () => {
  try {
    const response = await api.get("/employee/payments/my-payments");
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error.response?.data || error;
  }
};

// Get payment by ID
export const getPaymentById = async (paymentId) => {
  try {
    const response = await api.get(`/employee/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw error.response?.data || error;
  }
};

// Request payment
export const requestPayment = async (paymentData) => {
  try {
    const response = await api.post("/employee/payments/request", paymentData);
    return response.data;
  } catch (error) {
    console.error("Error requesting payment:", error);
    throw error.response?.data || error;
  }
};

// Confirm payment received
export const confirmPaymentReceived = async (paymentId) => {
  try {
    const response = await api.post(`/employee/payments/${paymentId}/confirm`);
    return response.data;
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error.response?.data || error;
  }
};
