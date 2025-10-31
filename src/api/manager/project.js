import api from '../index'

export const createProject = async (payload) => {
  try {
    const response = await api.post('/manager/projects/create', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create project' };
  }
};

export const updateProject = async (projectId, payload) => {
  try {
    const response = await api.put(`/manager/projects/${projectId}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update project' };
  }
};

export const getAllProject = async () => {
  try {
    const response = await api.get('/manager/projects');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch project' };
  }
};

export const getProjectById = async (projectId) => {
  try {
    const response = await api.get(`/manager/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch project' };
  }
};

export const deleteProject = async (id) => {
  try {
    const response = await api.delete(`/manager/projects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete project' };
  }
};

export const markProjectAsCompleted = async (projectId) => {
  try {
    const response = await api.patch(`/manager/projects/${projectId}/mark-completed`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark project as completed' };
  }
};