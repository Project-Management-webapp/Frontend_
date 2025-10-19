import api from '../index';
export const getPendingApprovals = async () => {
  try {
    const response = await api.get('/user/manager/pending');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch pending approvals' };
  }
};

export const approveEmployee = async (employeeId) => {
  try {
    const response = await api.post(`/user/manager/approve/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to approve employee' };
  }
};

export const rejectEmployee = async (employeeId) => {
  try {
    const response = await api.post(`/user/manager/reject/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reject employee' };
  }
};
