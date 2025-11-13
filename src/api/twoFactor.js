import api from './index';

/**
 * Send OTP to user's email
 */
export const sendOTP = async (userId, email) => {
  try {
    const response = await api.post('/2fa/send-otp', {
      userId,
      email
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (userId, otp) => {
  try {
    const response = await api.post('/2fa/verify-otp', {
      userId,
      otp
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Complete login after 2FA verification
 */
export const completeLogin = async (userId) => {
  try {
    const response = await api.post('/2fa/complete-login', {
      userId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get 2FA status
 */
export const get2FAStatus = async () => {
  try {
    const response = await api.get('/2fa/status');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Enable 2FA
 */
export const enable2FA = async () => {
  try {
    const response = await api.post('/2fa/enable');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Disable 2FA
 */
export const disable2FA = async () => {
  try {
    const response = await api.post('/2fa/disable');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
