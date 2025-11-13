import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaLock, FaUnlock } from 'react-icons/fa';
import { get2FAStatus, enable2FA, disable2FA } from '../../api/twoFactor';
import './TwoFactorToggle.css';

const TwoFactorToggle = ({ onToast }) => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await get2FAStatus();
      setIs2FAEnabled(response.twoFactorEnabled);
    } catch (error) {
      console.error('Error fetching 2FA status:', error);
      if (onToast) {
        onToast('Failed to load 2FA status', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async () => {
    setIsToggling(true);

    try {
      if (is2FAEnabled) {
        await disable2FA();
        setIs2FAEnabled(false);
        if (onToast) {
          onToast('Two-Factor Authentication has been disabled', 'success');
        }
      } else {
        await enable2FA();
        setIs2FAEnabled(true);
        if (onToast) {
          onToast('Two-Factor Authentication has been enabled', 'success');
        }
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      if (onToast) {
        onToast(
          error.message || `Failed to ${is2FAEnabled ? 'disable' : 'enable'} 2FA`,
          'error'
        );
      }
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="twofa-toggle-card">
        <div className="twofa-loading">Loading 2FA settings...</div>
      </div>
    );
  }

  return (
    <div className="twofa-toggle-card">
      <div className="twofa-header">
        <div className="twofa-icon-wrapper">
          <FaShieldAlt size={28} className="twofa-icon" />
        </div>
        <div className="twofa-text">
          <h3 className="twofa-title">Two-Factor Authentication</h3>
          <p className="twofa-description">
            Add an extra layer of security to your account
          </p>
        </div>
      </div>

      <div className="twofa-body">
        <div className="twofa-status">
          <div className={`twofa-badge ${is2FAEnabled ? 'enabled' : 'disabled'}`}>
            {is2FAEnabled ? (
              <>
                <FaLock size={16} />
                <span>Enabled</span>
              </>
            ) : (
              <>
                <FaUnlock size={16} />
                <span>Disabled</span>
              </>
            )}
          </div>
        </div>

        <div className="twofa-info">
          {is2FAEnabled ? (
            <>
              <p className="twofa-info-text">
                ✅ Your account is protected with 2FA. You'll receive a verification code via email each time you log in.
              </p>
            </>
          ) : (
            <>
              <p className="twofa-info-text">
                ⚠️ Enable 2FA to add an extra layer of security. You'll receive a verification code via email each time you log in.
              </p>
            </>
          )}
        </div>

        <button
          className={`twofa-toggle-btn ${is2FAEnabled ? 'disable' : 'enable'}`}
          onClick={handleToggle}
          disabled={isToggling}
        >
          {isToggling ? (
            'Processing...'
          ) : is2FAEnabled ? (
            'Disable 2FA'
          ) : (
            'Enable 2FA'
          )}
        </button>

        {is2FAEnabled && (
          <div className="twofa-note">
            <strong>Note:</strong> If you disable 2FA, you'll only need your password to log in. This reduces your account security.
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorToggle;
