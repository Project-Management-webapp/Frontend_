import api from "../index";

export const managerLogin = async (credentials) => {
  try {
    const response = await api.post("/auth/manager/login", credentials);

    if (response.data.success) {
      const { data } = response.data;
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("isLoggedIn", "true");
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};
export const managerLogout = async () => {
  try {
    const response = await api.post("/auth/manager/logout");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const getManagerProfile = async () => {
  try {
    const userId = localStorage.getItem("userId");
    const response = await api.get("/user/manager/profile");
    if (response.data.success) {
      localStorage.setItem(
        "managerProfile",
        JSON.stringify(response.data.data)
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching manager profile:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const updateManagerProfile = async (profileData) => {
  try {
    let response;
    if (profileData.profileImage instanceof File) {
      const formData = new FormData();

      Object.keys(profileData).forEach((key) => {
        formData.append(key, profileData[key]);
      });
      response = await api.put("/user/manager/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      response = await api.put("/user/manager/profile", profileData);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const updateManagerProfileImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('profileImage', imageFile); 

    const response = await api.put('/user/manager/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data; 

  } catch (error) {
    throw error.response?.data || { message: 'Image upload failed' };
  }
};

// export const managerChangePassword = async (oldPassword, newPassword) => {
//   try {
//     const response = await api.post('/manager/change-password', {
//       oldPassword,
//       newPassword
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Failed to change password' };
//   }
// };
