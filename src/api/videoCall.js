import api from '../index';

// Get all participants for a project video call
export const getProjectParticipants = async (projectId) => {
  try {
    const response = await api.get(`/video-call/project/${projectId}/participants`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get project participants' };
  }
};
