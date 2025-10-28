import api from "../index";

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await api.get("/employee/stats/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error.response?.data || error;
  }
};

// Get earnings over time
export const getEarningsOverTime = async () => {
  try {
    const response = await api.get("/employee/stats/earnings-over-time");
    return response.data;
  } catch (error) {
    console.error("Error fetching earnings over time:", error);
    throw error.response?.data || error;
  }
};

// Get assignment distribution
export const getAssignmentDistribution = async () => {
  try {
    const response = await api.get("/employee/stats/assignment-distribution");
    return response.data;
  } catch (error) {
    console.error("Error fetching assignment distribution:", error);
    throw error.response?.data || error;
  }
};

// Get project performance
export const getProjectPerformance = async () => {
  try {
    const response = await api.get("/employee/stats/project-performance");
    return response.data;
  } catch (error) {
    console.error("Error fetching project performance:", error);
    throw error.response?.data || error;
  }
};

// Get payment distribution
export const getPaymentDistribution = async () => {
  try {
    const response = await api.get("/employee/stats/payment-distribution");
    return response.data;
  } catch (error) {
    console.error("Error fetching payment distribution:", error);
    throw error.response?.data || error;
  }
};

// Get ticket trends
export const getTicketTrends = async () => {
  try {
    const response = await api.get("/employee/stats/ticket-trends");
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket trends:", error);
    throw error.response?.data || error;
  }
};

// Get activity summary
export const getActivitySummary = async () => {
  try {
    const response = await api.get("/employee/stats/activity-summary");
    return response.data;
  } catch (error) {
    console.error("Error fetching activity summary:", error);
    throw error.response?.data || error;
  }
};

// Get earnings by project
export const getEarningsByProject = async () => {
  try {
    const response = await api.get("/employee/stats/earnings-by-project");
    return response.data;
  } catch (error) {
    console.error("Error fetching earnings by project:", error);
    throw error.response?.data || error;
  }
};

// Get completion rate
export const getCompletionRate = async () => {
  try {
    const response = await api.get("/employee/stats/completion-rate");
    return response.data;
  } catch (error) {
    console.error("Error fetching completion rate:", error);
    throw error.response?.data || error;
  }
};

// Get tickets by priority
export const getTicketsByPriority = async () => {
  try {
    const response = await api.get("/employee/stats/tickets-by-priority");
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets by priority:", error);
    throw error.response?.data || error;
  }
};
