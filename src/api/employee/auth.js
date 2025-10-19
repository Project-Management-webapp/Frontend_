import api from '../index';

export const employeeSignup = async (formData) => {
  try {
    const response = await api.post('/auth/employee/signup', formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const employeeLogin = async (credentials) => {
  try {
    const response = await api.post('/auth/employee/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const employeeLogout = async () => {
  try {
    const response = await api.post('/auth/employee/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong' };
  }
};
export const getEmployeeProfile = async () => {
  try {
    const userId = localStorage.getItem("userId");
    const response = await api.get("/user/employee/profile");
    if (response.data.success) {
      localStorage.setItem(
        "employeeProfile",
        JSON.stringify(response.data.data)
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching employee profile:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const updateEmployeeProfile = async (profileData) => {
  try {
    let response;
    if (profileData.profileImage instanceof File) {
      const formData = new FormData();

      Object.keys(profileData).forEach((key) => {
        formData.append(key, profileData[key]);
      });
      response = await api.put("/user/employee/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      response = await api.put("/user/employee/profile", profileData);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const updateEmployeeProfileImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('profileImage', imageFile); 

    const response = await api.put('/user/employee/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data; 

  } catch (error) {
    throw error.response?.data || { message: 'Image upload failed' };
  }
};

export const forgotPassword = async (email) => {
  if (!email) throw { message: "Email is required" };

  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error("Forgot password API error:", error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, { newPassword });
    return response.data;
  } catch (error) {
    console.error("Reset password API error:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// export const checkAuth = async () => {
//   try {
//     const response = await api.get('/auth/employee/check-auth');
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Not authenticated' };
//   }
// };


