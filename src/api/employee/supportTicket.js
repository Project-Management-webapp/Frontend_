import api from "../index";

// Get my support tickets
export const getMyTickets = async () => {
  try {
    const response = await api.get("/employee/support-tickets/my-tickets");
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error.response?.data || error;
  }
};

// Get ticket by ID
export const getTicketById = async (ticketId) => {
  try {
    const response = await api.get(`/employee/support-tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw error.response?.data || error;
  }
};

// Create new support ticket with attachments
export const createTicket = async (ticketData) => {
  try {
    const formData = new FormData();
    formData.append("subject", ticketData.subject);
    formData.append("description", ticketData.description);
    formData.append("priority", ticketData.priority);
    formData.append("category", ticketData.category);

    // Add attachments if any
    if (ticketData.attachments && ticketData.attachments.length > 0) {
      ticketData.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const response = await api.post("/employee/support-tickets/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error.response?.data || error;
  }
};
