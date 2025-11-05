import api from "../index";

// Get ongoing projects (currently working on)
export const getOngoingProjects = async () => {
  try {
    const response = await api.get(`employee/project-assignments/ongoing`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch ongoing projects" };
  }
};

// Get completed projects (verified work)
export const getCompletedProjects = async () => {
  try {
    const response = await api.get(`employee/project-assignments/completed`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch completed projects" };
  }
};

// Get a specific assignment by ID
export const getMyAssignmentById = async (assignmentId) => {
  try {
    const response = await api.get(`employee/project-assignments/${assignmentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get assignment details" };
  }
};

// Get teammates for a project
export const getProjectTeammates = async (projectId) => {
  try {
    const response = await api.get(`employee/project-assignments/project/${projectId}/teammates`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch teammates" };
  }
};

// Submit work with actual hours, consumables, and materials
export const submitWork = async (assignmentId, payload) => {
  try {
    const response = await api.post(`employee/project-assignments/${assignmentId}/submit-work`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to submit work" };
  }
};

// Update assignment details (actualHours, actualConsumables, actualMaterials)
// Note: This is a manager endpoint and should not be used by employees for submitting work
// Employees should use submitWork instead
export const updateAssignmentDetails = async (assignmentId, payload) => {
  try {
    const response = await api.put(`manager/project-assignments/${assignmentId}/role`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update assignment details" };
  }
};

