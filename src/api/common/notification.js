import api from "../index";

// Get my notifications
export const getMyNotifications = async () => {
  try {
    const response = await api.get("/notifications/");
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error.response?.data || error;
  }
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error.response?.data || error;
  }
};
