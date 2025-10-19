import api from '../index'

export const getProject = async () => {
  try {
    const response = await api.get('employee/projects/my-projects');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get project' };
  }
};

export const getProjectById = async (projectId) => {
  try {
    const response = await api.get(`employee/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch project' };
  }
};


export const completedProject = async (projectId) => {
  try {
    const response = await api.get(`employee/project-assignments/completed`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch completed project' };
  }
};


