import api from '../index';

// Send a message (uses same endpoint as employee)
export const sendmessage = async (formData) => {
  try {
    const response = await api.post('/messages/send', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to send message' };
  }
};

// Get messages for a project (uses same endpoint as employee)
export const getmessage = async (projectId) => {
  try {
    const response = await api.get(`/messages/project/${projectId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get messages' };
  }
};

// Update/Edit a message (uses same endpoint as employee)
export const updatemessage = async (messageId, content) => {
  try {
    const response = await api.put(`/messages/${messageId}`, { content });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update message' };
  }
};

// Delete a message (uses same endpoint as employee)
export const deletemessage = async (messageId) => {
  try {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete message' };
  }
};

// Reply to a message (uses same endpoint as employee)
export const replymessage = async (formData, messageId) => {
  try {
    const response = await api.post(`/messages/${messageId}/reply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to send reply' };
  }
};

// Get projects with unread mentions
export const getProjectsWithMentions = async () => {
  try {
    const response = await api.get('/messages/mentions/projects');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get mentions' };
  }
};

// Mark mentions as viewed
export const markMentionsAsViewed = async (projectId) => {
  try {
    const response = await api.post(`/messages/mentions/viewed/${projectId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark mentions as viewed' };
  }
};

// Improve text with AI
export const improveText = async (description) => {
  try {
    const response = await api.post('/ai/improve-text', { description });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to improve text' };
  }
};
