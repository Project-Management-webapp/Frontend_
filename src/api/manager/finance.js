import api from "../index";

// Get financial overview
export const getFinancialOverview = async () => {
  try {
    const response = await api.get("/manager/finance/overview");
    return response.data;
  } catch (error) {
    console.error("Error fetching financial overview:", error);
    throw error.response?.data || error;
  }
};

// Get project profit/loss
export const getProjectProfitLoss = async (projectId) => {
  try {
    const response = await api.get(`/manager/finance/projects/${projectId}/profit-loss`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project profit/loss:", error);
    throw error.response?.data || error;
  }
};

// Get income summary
export const getIncomeSummary = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.projectType) params.append('projectType', filters.projectType);
    if (filters.status) params.append('status', filters.status);
    
    const queryString = params.toString();
    const url = `/manager/finance/income-summary${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching income summary:", error);
    throw error.response?.data || error;
  }
};

// Get employee allocations
export const getEmployeeAllocations = async () => {
  try {
    const response = await api.get("/manager/finance/employee-allocations");
    return response.data;
  } catch (error) {
    console.error("Error fetching employee allocations:", error);
    throw error.response?.data || error;
  }
};
