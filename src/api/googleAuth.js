import api from './index';

/**
 * Setup Google Authenticator - Get QR code
 */
export const setupGoogleAuth = async () => {
  try {
    const response = await api.post('/google-auth/setup');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Verify and enable Google Authenticator
 */
export const verifyAndEnableGoogleAuth = async (token) => {
  try {
    const response = await api.post('/google-auth/verify-and-enable', {
      token
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Verify Google Authenticator code (for login)
 */
export const verifyGoogleAuthCode = async (userId, token) => {
  try {
    const response = await api.post('/google-auth/verify-code', {
      userId,
      token
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Disable Google Authenticator
 */
export const disableGoogleAuth = async () => {
  try {
    const response = await api.post('/google-auth/disable');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get Google Authenticator status
 */
export const getGoogleAuthStatus = async () => {
  try {
    const response = await api.get('/google-auth/status');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
