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

// Submit work
export const submitWork = async (assignmentId) => {
  try {
    const response = await api.post(`employee/project-assignments/${assignmentId}/submit-work`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to submit work" };
  }
};

