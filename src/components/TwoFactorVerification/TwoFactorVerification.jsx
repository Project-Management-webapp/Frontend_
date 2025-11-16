import React, { useState, useRef, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

const TwoFactorVerification = ({
  isOpen,
  onClose,
  onVerify,
  onResend,
  userEmail,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    const arr = pasted.split("");
    const newOtp = [...otp];

    arr.forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });

    setOtp(newOtp);
    inputRefs.current[Math.min(arr.length - 1, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      await onVerify(otpCode);
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setOtp(["", "", "", "", "", ""]);
    setError("");
    setIsLoading(true);

    try {
      await onResend();
      setResendCooldown(60);
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl">
      <div className="relative w-full max-w-md p-8 bg-white/10 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl overflow-hidden">

        {/* Glow Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#ac51fc]/30 via-purple-600/20 to-blue-500/20 blur-2xl opacity-40"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-white hover:text-purple-300 transition"
        >
          <IoMdClose size={26} />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-[#ac51fc] to-purple-600 text-white shadow-lg">
          🔐
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Two-Factor Verification
        </h2>

        {/* Description */}
        <p className="text-center text-gray-300 text-sm mb-6">
          A 6-digit verification code has been sent to:<br />
          <span className="text-white font-semibold">{userEmail}</span>
        </p>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* OTP Inputs */}
          <div
            className="flex justify-between gap-2"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold text-white bg-white/10 border border-white/30 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-inner"
                disabled={isLoading}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Error */}
          {error && <div className="text-red-400 text-center text-sm">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || otp.join("").length !== 6}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#ac51fc] to-purple-600 hover:opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify & Login"}
          </button>

          {/* Resend Section */}
          <div className="text-center text-sm mt-4">
            {resendCooldown > 0 ? (
              <span className="text-gray-400">
                Resend code in {resendCooldown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                className="text-purple-300 hover:text-white font-semibold"
              >
                Resend Code
              </button>
            )}
          </div>

          {/* Note */}
          <p className="text-center text-gray-400 text-xs mt-2">
            ⏱️ Code expires in 5 minutes
          </p>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorVerification;
