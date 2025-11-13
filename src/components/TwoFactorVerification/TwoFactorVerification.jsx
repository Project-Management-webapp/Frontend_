import React, { useState, useRef, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import './TwoFactorVerification.css';

const TwoFactorVerification = ({ 
  isOpen, 
  onClose, 
  onVerify, 
  onResend,
  userEmail 
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    // Focus last filled input or last input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onVerify(otpString);
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    setError('');
    setOtp(['', '', '', '', '', '']);

    try {
      await onResend();
      setResendCooldown(60); // 60 second cooldown
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="two-factor-overlay">
      <div className="two-factor-modal">
        <button className="two-factor-close" onClick={onClose} disabled={isLoading}>
          <IoMdClose size={24} />
        </button>

        <div className="two-factor-content">
          <div className="two-factor-icon">🔐</div>
          
          <h2 className="two-factor-title">Two-Factor Authentication</h2>
          
          <p className="two-factor-description">
            We've sent a 6-digit verification code to
            <br />
            <strong>{userEmail}</strong>
          </p>

          <form onSubmit={handleSubmit} className="two-factor-form">
            <div className="otp-inputs" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-input"
                  disabled={isLoading}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && <div className="two-factor-error">{error}</div>}

            <button
              type="submit"
              className="two-factor-submit"
              disabled={isLoading || otp.join('').length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <div className="two-factor-resend">
              {resendCooldown > 0 ? (
                <span className="resend-cooldown">
                  Resend code in {resendCooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="resend-button"
                  disabled={isLoading}
                >
                  Resend Code
                </button>
              )}
            </div>

            <p className="two-factor-note">
              ⏱️ Code expires in 5 minutes
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorVerification;
