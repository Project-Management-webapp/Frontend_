import React, { useState, useRef, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { setupGoogleAuth, verifyAndEnableGoogleAuth } from '../../api/googleAuth';
import './GoogleAuthSetup.css';

const GoogleAuthSetup = ({ isOpen, onClose, onComplete, onToast }) => {
  const [step, setStep] = useState('loading'); // loading, qrcode, verifying, success
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      initializeSetup();
    }
  }, [isOpen]);

  const initializeSetup = async () => {
    try {
      setStep('loading');
      const response = await setupGoogleAuth();
      setQrCodeUrl(response.data.qrCode);
      setSecret(response.data.secret);
      setStep('qrcode');
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
      onToast?.('Failed to setup Google Authenticator', 'error');
      setTimeout(() => onClose(), 2000);
    }
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
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

    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    const codeString = code.join('');
    if (codeString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setStep('verifying');
    setError('');

    try {
      await verifyAndEnableGoogleAuth(codeString);
      setStep('success');
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.');
      setStep('qrcode');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="google-setup-overlay">
      <div className="google-setup-modal">
        {step !== 'success' && (
          <button className="google-setup-close" onClick={handleClose} disabled={isLoading}>
            <IoMdClose size={24} />
          </button>
        )}

        <div className="google-setup-content">
          {step === 'loading' && (
            <div className="google-setup-loading">
              <div className="spinner-large"></div>
              <p>Generating QR code...</p>
            </div>
          )}

          {step === 'qrcode' && (
            <>
              <h2 className="google-setup-title">Setup Google Authenticator</h2>
              
              <div className="google-setup-steps">
                <div className="setup-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Download the app</h3>
                    <p>Install Google Authenticator from your app store</p>
                  </div>
                </div>

                <div className="setup-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Scan QR code</h3>
                    <p>Open the app and scan this QR code</p>
                  </div>
                </div>

                <div className="qrcode-container">
                  <img src={qrCodeUrl} alt="QR Code" className="qrcode-image" />
                </div>

                <div className="manual-entry">
                  <p className="manual-label">Can't scan? Enter this code manually:</p>
                  <div className="secret-code">
                    <code>{secret}</code>
                  </div>
                </div>

                <div className="setup-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Enter verification code</h3>
                    <p>Enter the 6-digit code from the app</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleVerify} className="google-setup-form">
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
                    />
                  ))}
                </div>

                {error && <div className="google-setup-error">{error}</div>}

                <button
                  type="submit"
                  className="google-setup-submit"
                  disabled={isLoading || code.join('').length !== 6}
                >
                  {isLoading ? 'Verifying...' : 'Verify & Enable'}
                </button>
              </form>
            </>
          )}

          {step === 'verifying' && (
            <div className="google-setup-loading">
              <div className="spinner-large"></div>
              <p>Verifying code...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="google-setup-success">
              <div className="success-icon">✓</div>
              <h2>Successfully Enabled!</h2>
              <p>Google Authenticator has been activated for your account</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthSetup;
