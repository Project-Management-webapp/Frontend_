import React, { useState, useEffect } from 'react';
import { FiShield } from 'react-icons/fi';
import GoogleAuthSetup from '../GoogleAuthSetup/GoogleAuthSetup';
import { getGoogleAuthStatus, disableGoogleAuth } from '../../api/googleAuth';
import './GoogleAuthToggle.css';

const GoogleAuthToggle = ({ onToast }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showConfirmDisable, setShowConfirmDisable] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const response = await getGoogleAuthStatus();
      setIsEnabled(response.googleAuthEnabled || false);
    } catch (error) {
      console.error('Failed to fetch Google Auth status:', error);
      onToast?.('Failed to load Google Authenticator status', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async () => {
    if (isEnabled) {
      // Show confirmation modal instead of browser confirm
      setShowConfirmDisable(true);
    } else {
      // Enable Google Auth - show setup modal
      setShowSetupModal(true);
    }
  };

  const handleConfirmDisable = async () => {
    try {
      setIsDisabling(true);
      await disableGoogleAuth();
      setIsEnabled(false);
      setShowConfirmDisable(false);
      onToast?.('Google Authenticator disabled successfully', 'success');
    } catch (error) {
      setShowConfirmDisable(false);
      onToast?.(error.message || 'Failed to disable Google Authenticator', 'error');
    } finally {
      setIsDisabling(false);
    }
  };

  const handleCancelDisable = () => {
    if (!isDisabling) {
      setShowConfirmDisable(false);
    }
  };

  const handleSetupComplete = () => {
    setIsEnabled(true);
    setShowSetupModal(false);
    onToast?.('Google Authenticator enabled successfully', 'success');
  };

  const handleSetupCancel = () => {
    setShowSetupModal(false);
  };

  if (isLoading) {
    return (
      <div className="google-auth-toggle-container">
        <div className="google-auth-toggle-header">
          <div className="google-auth-toggle-title-section">
            <div className="skeleton-icon"></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton-title"></div>
              <div className="skeleton-description"></div>
            </div>
          </div>
          <div className="skeleton-toggle"></div>
        </div>
        <div className="google-auth-toggle-status">
          <div className="skeleton-badge"></div>
          <div className="skeleton-info"></div>
          <div className="skeleton-info-short"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="google-auth-toggle-container">
        <div className="google-auth-toggle-header">
          <div className="google-auth-toggle-title-section">
            <FiShield className="google-auth-toggle-icon" />
            <div>
              <h3 className="google-auth-toggle-title">Google Authenticator</h3>
              <p className="google-auth-toggle-description">
                Add an extra layer of security using Google Authenticator app
              </p>
            </div>
          </div>
          
          <label className="google-auth-toggle-switch">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={handleToggle}
              className="google-auth-toggle-checkbox"
            />
            <span className="google-auth-toggle-slider"></span>
          </label>
        </div>

        <div className="google-auth-toggle-status">
          <div className={`google-auth-toggle-badge ${isEnabled ? 'enabled' : 'disabled'}`}>
            {isEnabled ? '🔐 Active' : '🔓 Inactive'}
          </div>
          <p className="google-auth-toggle-info">
            {isEnabled 
              ? 'Google Authenticator is protecting your account. You\'ll need to enter a code from your authenticator app when logging in.'
              : 'Enable Google Authenticator to add time-based one-time password (TOTP) protection to your account.'
            }
          </p>
        </div>
      </div>

      {showSetupModal && (
        <GoogleAuthSetup
          isOpen={showSetupModal}
          onClose={handleSetupCancel}
          onComplete={handleSetupComplete}
          onToast={onToast}
        />
      )}

      {showConfirmDisable && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3 className="confirm-title">Disable Google Authenticator?</h3>
            <p className="confirm-message">
              Are you sure you want to disable Google Authenticator? You will need to set it up again if you want to re-enable it.
            </p>
            <div className="confirm-buttons">
              <button 
                className="confirm-btn cancel" 
                onClick={handleCancelDisable}
                disabled={isDisabling}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn disable" 
                onClick={handleConfirmDisable}
                disabled={isDisabling}
              >
                {isDisabling ? 'Disabling...' : 'Disable'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleAuthToggle;
