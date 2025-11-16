import React, { useState, useEffect } from "react";
import { FiShield } from "react-icons/fi";
import GoogleAuthSetup from "../GoogleAuthSetup/GoogleAuthSetup";
import { getGoogleAuthStatus, disableGoogleAuth } from "../../api/googleAuth";
import { createPortal } from "react-dom";

const GoogleAuthToggle = ({ onToast, disabled = false, onStatusChange }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showConfirmDisable, setShowConfirmDisable] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(isEnabled);
    }
  }, [isEnabled, onStatusChange]);

  const fetchStatus = async () => {
    try {
      const response = await getGoogleAuthStatus();
      setIsEnabled(response.googleAuthEnabled || false);
    } catch (error) {
      onToast?.("Failed to load Google Authenticator status", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    if (disabled && !isEnabled) {
      onToast?.("Please disable Two-Factor Authentication first", "warning");
      return;
    }
    if (isEnabled) setShowConfirmDisable(true);
    else setShowSetupModal(true);
  };

  const handleConfirmDisable = async () => {
    try {
      setIsDisabling(true);
      await disableGoogleAuth();
      setIsEnabled(false);
      onToast?.("Google Authenticator disabled successfully", "success");
    } catch (error) {
      onToast?.("Failed to disable Google Authenticator", "error");
    } finally {
      setIsDisabling(false);
      setShowConfirmDisable(false);
    }
  };

  const handleSetupComplete = () => {
    setIsEnabled(true);
    setShowSetupModal(false);
    onToast?.("Google Authenticator enabled successfully", "success");
  };


  if (isLoading) {
    return (
      <div className="w-full bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-4 animate-pulse">
          <div className="h-12 w-12 rounded-xl bg-white/20"></div>

          <div className="flex-1 space-y-3">
            <div className="h-4 bg-white/20 rounded w-1/3"></div>
            <div className="h-3 bg-white/10 rounded w-2/3"></div>
          </div>

          <div className="h-7 w-14 bg-white/20 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Card UI */}
      <div className="relative w-full bg-blue-950/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl overflow-hidden group">

       

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          {/* Left Side */}
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl 
              bg-gradient-to-br from-[#ac51fc] to-purple-700 
              text-white shadow-lg ">
              <FiShield size={22} />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white tracking-wide">
                Google Authenticator
              </h3>
              <p className="text-gray-300 text-sm">
                Protect your account with time-based one-time passwords.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <label className={`relative inline-flex items-center ${
            (disabled && !isEnabled) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}>
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isEnabled}
              onChange={handleToggle}
              disabled={disabled && !isEnabled}
            />
            <div className="w-14 h-7 bg-white/20 rounded-full peer peer-checked:bg-purple-600 transition-all duration-300 relative">
              <div className="absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 peer-checked:left-8"></div>
            </div>
          </label>
        </div>

        {/* Status Badge */}
        <div className="my-4">
          <div
            className={`px-3 py-1.5 inline-flex items-center rounded-full text-sm font-semibold border
              ${isEnabled
                ? "text-green-400 bg-green-500/20 border-green-400/30"
                : "text-red-400 bg-red-500/20 border-red-400/30"
              }`}
          >
            {isEnabled ? " Active" : " Inactive"}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed">
          {isEnabled ? (
            <>
              Google Authenticator is <strong className="text-purple-300">actively protecting</strong> your account.
              You must enter a 6-digit TOTP code during login.
            </>
          ) : (
            <>
              Activate Google Authenticator to add <strong className="text-purple-300">advanced TOTP security</strong> to your account.
            </>
          )}
        </p>
      </div>

      {/* Setup Modal */}
      {showSetupModal &&
        createPortal(
          <GoogleAuthSetup
            isOpen={showSetupModal}
            onClose={() => setShowSetupModal(false)}
            onComplete={handleSetupComplete}
            onToast={onToast}
          />,
          document.getElementById("modal-root")
        )
      }

      {/* Disable Confirmation Modal */}
      {showConfirmDisable && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-xl flex items-center justify-center">
          <div className="relative bg-gray-700 border border-white/20 p-8 rounded-2xl w-full max-w-md ">

            {/* Glow */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-red-500/40 to-purple-500/40 blur-xl opacity-60"></div>

            <h3 className="text-2xl font-bold text-white mb-3">
              Disable Google Authenticator?
            </h3>

            <p className="text-gray-300 text-sm mb-6">
              You will need to set it up again if you want to re-enable TOTP protection.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => !isDisabling && setShowConfirmDisable(false)}
                className="px-4 py-2 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 transition"
                disabled={isDisabling}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDisable}
                className="px-4 py-2 rounded-xl bg-red-500/40 hover:bg-red-500/60 text-white transition disabled:opacity-50"
                disabled={isDisabling}
              >
                {isDisabling ? "Disabling..." : "Disable"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default GoogleAuthToggle;
