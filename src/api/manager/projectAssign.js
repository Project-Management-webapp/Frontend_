import api from '../index'

// Assign a project to an employee
export const assignProject = async (payload) => {
  try {
    const response = await api.post('/manager/project-assignments/assign', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get all assignments for a project
export const getProjectAssignments = async (projectId) => {
  try {
    const response = await api.get(`/manager/project-assignments/project/${projectId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get assign project' };
  }
};

// Update employee role on project
export const updateAssignmentRole = async (assignmentId, roleData) => {
  try {
    const response = await api.put(`/manager/project-assignments/${assignmentId}/role`, roleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update assign role' };
  }
};

// Remove employee from project
export const removeEmployeeFromProject = async (assignmentId) => {
  try {
    const response = await api.delete(`/manager/project-assignments/${assignmentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to remove employee from project' };
  }
};
