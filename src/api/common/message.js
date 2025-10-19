import api from "../index";

// Send message with attachments
export const sendMessage = async (messageData) => {
  try {
    const formData = new FormData();
    formData.append("projectId", messageData.projectId);
    formData.append("content", messageData.content);

    // Add attachments if any
    if (messageData.attachments && messageData.attachments.length > 0) {
      messageData.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const response = await api.post("/messages/send", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error.response?.data || error;
  }
};

// Get project messages
export const getProjectMessages = async (projectId) => {
  try {
    const response = await api.get(`/messages/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error.response?.data || error;
  }
};

// Update message
export const updateMessage = async (messageId, content) => {
  try {
    const response = await api.put(`/messages/${messageId}`, { content });
    return response.data;
  } catch (error) {
    console.error("Error updating message:", error);
    throw error.response?.data || error;
  }
};

// Delete message
export const deleteMessage = async (messageId) => {
  try {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error.response?.data || error;
  }
};

// Reply to message with attachments
export const replyToMessage = async (messageId, replyData) => {
  try {
    const formData = new FormData();
    formData.append("content", replyData.content);

    // Add attachments if any
    if (replyData.attachments && replyData.attachments.length > 0) {
      replyData.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const response = await api.post(`/messages/${messageId}/reply`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error replying to message:", error);
    throw error.response?.data || error;
  }
};
