import api from "../index";

// Get all support tickets (manager view)
export const getAllTickets = async () => {
  try {
    const response = await api.get("/manager/support-tickets/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error.response?.data || error;
  }
};

// Get ticket by ID
export const getTicketById = async (ticketId) => {
  try {
    const response = await api.get(`/manager/support-tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw error.response?.data || error;
  }
};

// Add response to ticket with attachments
export const addTicketResponse = async (ticketId, responseData) => {
  try {
    const formData = new FormData();
    formData.append("message", responseData.message);
    if (responseData.attachments && responseData.attachments.length > 0) {
      responseData.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const response = await api.post(
      `/manager/support-tickets/${ticketId}/response`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding response:", error);
    throw error.response?.data || error;
  }
};

// Update ticket status
export const updateTicketStatus = async (ticketId, updateData) => {
  try {
    const response = await api.put(`/manager/support-tickets/${ticketId}`, updateData);
    console.log(response)
    return response.data;
    
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error.response?.data || error;
  }
};
