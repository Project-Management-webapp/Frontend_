import api from '../index';
export const sendmessage = async (credentials) => {
  try {
    const response = await api.post('/messages/send', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong while sending message' };
  }
};

export const replymessage = async (credentials, id) => {
  try {
    const response = await api.post(`messages/${id}/reply`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong while replying to message' };
  }
};

export const updatemessage = async (credentials, id) => {
  try {
    const response = await api.put(`messages/${id}`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong while updating message' };
  }
};

export const deletemessage = async (id) => {
  try {
    const response = await api.delete(`messages/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong while deleting message' };
  }
};
export const getmessage = async (id) => {
  try {
    const response = await api.get(`messages/project/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong while fetching messages' };
  }
};

export const getProjectsWithMentions = async () => {
  try {
    const response = await api.get('/messages/mentions/projects');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong while fetching mentions' };
  }
};

export const markMentionsAsViewed = async (projectId) => {
  try {
    const response = await api.post(`/messages/mentions/viewed/${projectId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong while marking mentions as viewed' };
  }
};