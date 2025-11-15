import React, { useState, useRef, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import './GoogleAuthVerification.css';

const GoogleAuthVerification = ({ 
  isOpen, 
  onClose, 
  onVerify
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) {
        newCode[index] = char;
      }
    });
    setCode(newCode);

    // Focus last filled input or last input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const codeString = code.join('');
    if (codeString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onVerify(codeString);
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="google-auth-overlay">
      <div className="google-auth-modal">
        <button className="google-auth-close" onClick={onClose} disabled={isLoading}>
          <IoMdClose size={24} />
        </button>

        <div className="google-auth-content">
          <div className="google-auth-icon">🔐</div>
          
          <h2 className="google-auth-title">Google Authenticator</h2>
          
          <p className="google-auth-description">
            Enter the 6-digit code from your Google Authenticator app
          </p>

          <form onSubmit={handleSubmit} className="google-auth-form">
            <div className="code-inputs" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="code-input"
                  disabled={isLoading}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && <div className="google-auth-error">{error}</div>}

            <button
              type="submit"
              className="google-auth-submit"
              disabled={isLoading || code.join('').length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <p className="google-auth-note">
              📱 Open your authenticator app to get the code
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthVerification;
