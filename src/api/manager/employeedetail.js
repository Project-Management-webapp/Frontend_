import api from '../index'

export const getAllEmployees = async () => {
  try {
    const response = await api.get('/user/manager/employees');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch employees' };
  }
};

export const addEmployee = async (formData) => {
  try {
    const response = await api.post('/auth/employee/signup', formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

// export const getEmployeeDetails = async (employeeId) => {
//   try {
//     const response = await api.get(`/user/manager/employees/${employeeId}`);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Failed to fetch employee details' };
//   }
// };

// export const updateEmployeeDetails = async (employeeId, updateData) => {
//   try {
//     const response = await api.put(`/user/manager/employees/${employeeId}`, updateData);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Failed to update employee details' };
//   }
// };

// export const getEmployeeStats = async () => {
//   try {
//     const response = await api.get('/user/manager/employee-stats');
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Failed to fetch employee statistics' };
//   }
// };
