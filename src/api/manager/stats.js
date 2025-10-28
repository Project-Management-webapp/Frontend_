import api from "../index";

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await api.get("/manager/stats/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error.response?.data || error;
  }
};

// Get project distribution
export const getProjectDistribution = async () => {
  try {
    const response = await api.get("/manager/stats/project-distribution");
    return response.data;
  } catch (error) {
    console.error("Error fetching project distribution:", error);
    throw error.response?.data || error;
  }
};

// Get payment trends
export const getPaymentTrends = async () => {
  try {
    const response = await api.get("/manager/stats/payment-trends");
    return response.data;
  } catch (error) {
    console.error("Error fetching payment trends:", error);
    throw error.response?.data || error;
  }
};

// Get team performance
export const getTeamPerformance = async () => {
  try {
    const response = await api.get("/manager/stats/team-performance");
    return response.data;
  } catch (error) {
    console.error("Error fetching team performance:", error);
    throw error.response?.data || error;
  }
};

// Get project progress
export const getProjectProgress = async () => {
  try {
    const response = await api.get("/manager/stats/project-progress");
    return response.data;
  } catch (error) {
    console.error("Error fetching project progress:", error);
    throw error.response?.data || error;
  }
};

// Get budget utilization
export const getBudgetUtilization = async () => {
  try {
    const response = await api.get("/manager/stats/budget-utilization");
    return response.data;
  } catch (error) {
    console.error("Error fetching budget utilization:", error);
    throw error.response?.data || error;
  }
};

// Get assignment trends
export const getAssignmentTrends = async () => {
  try {
    const response = await api.get("/manager/stats/assignment-trends");
    return response.data;
  } catch (error) {
    console.error("Error fetching assignment trends:", error);
    throw error.response?.data || error;
  }
};

// Get ticket resolution stats
export const getTicketResolutionStats = async () => {
  try {
    const response = await api.get("/manager/stats/ticket-resolution");
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket resolution stats:", error);
    throw error.response?.data || error;
  }
};

// Get workload distribution
export const getWorkloadDistribution = async () => {
  try {
    const response = await api.get("/manager/stats/workload-distribution");
    return response.data;
  } catch (error) {
    console.error("Error fetching workload distribution:", error);
    throw error.response?.data || error;
  }
};

// Get activity summary
export const getActivitySummary = async () => {
  try {
    const response = await api.get("/manager/stats/activity-summary");
    return response.data;
  } catch (error) {
    console.error("Error fetching activity summary:", error);
    throw error.response?.data || error;
  }
};

// Get payment queue
export const getPaymentQueue = async () => {
  try {
    const response = await api.get("/manager/stats/payment-queue");
    return response.data;
  } catch (error) {
    console.error("Error fetching payment queue:", error);
    throw error.response?.data || error;
  }
};
