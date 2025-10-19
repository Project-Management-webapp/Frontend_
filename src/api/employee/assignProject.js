import api from "../index";

// Get all my assignments (with optional filters)
export const getMyAssignments = async () => {
  try {
    const response = await api.get(`employee/project-assignments/my-assignments`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get assignments" };
  }
};

// Get pending assignments (need to accept/reject)
export const getPendingAssignments = async () => {
  try {
    const response = await api.get(`employee/project-assignments/pending`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch pending assignments" };
  }
};

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

// Get all accepted projects (both ongoing and completed)
export const getAcceptedProjects = async () => {
  try {
    const response = await api.get(`employee/project-assignments/accepted`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch accepted projects" };
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

// Accept assignment
export const acceptAssignment = async (assignmentId) => {
  try {
    const response = await api.post(`employee/project-assignments/${assignmentId}/accept`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to accept assignment" };
  }
};

// Reject assignment
export const rejectAssignment = async (assignmentId, reason) => {
  try {
    const payload = { rejectedReason: reason };
    const response = await api.post(`employee/project-assignments/${assignmentId}/reject`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to reject assignment" };
  }
};

// Submit work
export const submitWork = async (assignmentId, workDetails) => {
  try {
    const response = await api.post(`employee/project-assignments/${assignmentId}/submit-work`, workDetails);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to submit work" };
  }
};
