import React, { useState, useEffect } from "react";
import { FaShieldAlt, FaLock, FaUnlock } from "react-icons/fa";
import { get2FAStatus, enable2FA, disable2FA } from "../../api/twoFactor";

const TwoFactorToggle = ({ onToast, disabled = false, onStatusChange }) => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    onStatusChange?.(is2FAEnabled);
  }, [is2FAEnabled]);

  const fetchStatus = async () => {
    try {
      const response = await get2FAStatus();
      setIs2FAEnabled(response.twoFactorEnabled);
    } catch (error) {
      onToast?.("Failed to load 2FA status", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async () => {
    if (disabled && !is2FAEnabled) {
      onToast?.("Please disable Google Authenticator first", "warning");
      return;
    }

    setIsToggling(true);

    try {
      if (is2FAEnabled) {
        await disable2FA();
        setIs2FAEnabled(false);
        onToast?.("Two-Factor Authentication disabled", "success");
      } else {
        await enable2FA();
        setIs2FAEnabled(true);
        onToast?.("Two-Factor Authentication enabled", "success");
      }
    } catch (error) {
      onToast?.("Failed to toggle 2FA", "error");
    } finally {
      setIsToggling(false);
    }
  };

  /* ---------------------- SKELETON LOADER ---------------------- */
  if (isLoading) {
    return (
      <div className="w-full bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl overflow-hidden relative animate-pulse">

        {/* Glow */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#ac51fc]/20 via-purple-500/10 to-blue-500/20 blur-3xl opacity-40"></div>

        {/* Header Skeleton */}
        <div className="flex items-start gap-4 mb-4">
          <div className="h-12 w-12 rounded-xl bg-white/20"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/20 rounded w-1/3"></div>
            <div className="h-3 bg-white/10 rounded w-2/3"></div>
          </div>
        </div>

        {/* Status Skeleton */}
        <div className="h-7 w-28 bg-white/20 rounded-full mb-4"></div>

        {/* Text Skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-white/10 rounded w-full"></div>
          <div className="h-3 bg-white/10 rounded w-5/6"></div>
          <div className="h-3 bg-white/10 rounded w-2/3"></div>
        </div>

        {/* Button Skeleton */}
        <div className="mt-6 h-11 w-full bg-white/20 rounded-xl"></div>
      </div>
    );
  }

  /* ---------------------- MAIN CARD ---------------------- */
  return (
    <div className="relative w-full bg-blue-950/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl overflow-hidden">

      {/* Neon Glow Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#ac51fc]/20 via-purple-500/10 to-blue-500/20 blur-2xl opacity-40"></div>

      {/* Header */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-br from-[#ac51fc] to-purple-600 rounded-xl text-white shadow-lg">
          <FaShieldAlt size={22} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">Two-Factor Authentication</h3>
          <p className="text-gray-300 text-sm">Protect your account using verification codes</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center mb-4">
        <span
          className={`px-3 py-1.5 flex items-center gap-2 rounded-full text-sm font-semibold ${
            is2FAEnabled
              ? "bg-green-500/20 text-green-400 border border-green-400/20"
              : "bg-red-500/20 text-red-400 border border-red-400/20"
          }`}
        >
          {is2FAEnabled ? <FaLock size={14} /> : <FaUnlock size={14} />}
          {is2FAEnabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      {/* Info */}
      <p className="text-gray-300 text-sm leading-relaxed mb-4">
        {is2FAEnabled ? (
          <>
            Your account is secured with <strong>Two-Factor Authentication</strong>.
            You will get a <strong>verification code via email</strong> at every login.
          </>
        ) : (
          <>
            Enable <strong>Email OTP-based 2FA</strong> for additional protection.
          </>
        )}
      </p>

      {/* Button */}
      <button
        onClick={handleToggle}
        disabled={isToggling || (disabled && !is2FAEnabled)}
        className={`btn w-full${
          (disabled && !is2FAEnabled) ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isToggling
          ? "Please wait..."
          : disabled && !is2FAEnabled
            ? "Disabled (Google Auth Active)"
            : is2FAEnabled
              ? "Disable 2FA (Email OTP)"
              : "Enable 2FA (Email OTP)"}
      </button>

      {is2FAEnabled && (
        <p className="mt-4 text-xs text-gray-400">
          <strong>Note:</strong> disabling 2FA reduces your account security.
        </p>
      )}
    </div>
  );
};

export default TwoFactorToggle;
