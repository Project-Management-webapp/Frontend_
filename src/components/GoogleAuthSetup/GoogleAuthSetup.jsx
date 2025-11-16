import React, { useState, useRef, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { setupGoogleAuth, verifyAndEnableGoogleAuth } from '../../api/googleAuth';

const GoogleAuthSetup = ({ isOpen, onClose, onComplete, onToast }) => {
  const [step, setStep] = useState('loading');
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
      <div className="relative w-full max-w-lg bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 p-8 shadow-2xl overflow-visible">

        {/* Glow Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-600/30 via-[#ac51fc]/20 to-blue-600/30 blur-3xl opacity-60"></div>

        {/* Close Button */}
        {step !== "success" && (
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-gray-300 hover:text-white transition"
          >
            <IoMdClose size={28} />
          </button>
        )}

        <div className="relative z-10 max-h-[80vh] overflow-y-auto pr-2">
          {/* Loading */}
          {step === "loading" && (
            <div className="flex flex-col items-center py-10">
              <div className="w-14 h-14 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <p className="text-gray-300 mt-4">Generating QR code...</p>
            </div>
          )}

          {/* QR Setup */}
          {step === "qrcode" && (
            <>
              <h2 className="text-3xl font-bold text-white text-center mb-6">
                Google Authenticator Setup
              </h2>

              {/* Steps */}
              <div className="space-y-8 mb-10">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-purple-600 shadow-md shadow-purple-500/30 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg text-white font-bold">Download App</h3>
                    <p className="text-gray-300 text-sm">Install Google Authenticator.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-purple-600 shadow-md shadow-purple-500/30 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg text-white font-bold">Scan QR Code</h3>
                    <p className="text-gray-300 text-sm">Open the app and scan the QR below.</p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-52 h-52 rounded-xl p-3 bg-white/20 border border-white/20"
                  />
                </div>

                {/* Secret Key */}
                <div className="text-center">
                  <p className="text-gray-300 text-sm mb-2">Can't scan?</p>

                  <div className="bg-white/10 py-3 px-4 rounded-xl border border-white/20 w-full break-words whitespace-pre-wrap text-center min-h-[60px]">
                    <code className="text-purple-300 text-lg leading-relaxed break-all">
                      {secret}
                    </code>
                  </div>
                </div>


                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-purple-600 text-white shadow-md flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg text-white font-bold">Enter 6-digit Code</h3>
                    <p className="text-gray-300 text-sm">Enter the code from the app.</p>
                  </div>
                </div>
              </div>

              {/* OTP Inputs */}
              <form onSubmit={handleVerify} className="space-y-6 mb-4">
                <div className="flex justify-center gap-3" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 bg-white/10 text-white text-center text-xl border border-white/20 rounded-xl focus:border-purple-500 outline-none transition shadow-md"
                    />
                  ))}
                </div>

                {error && <p className="text-red-400 text-center">{error}</p>}

                <button
                  disabled={isLoading || code.join("").length !== 6}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ac51fc] to-purple-600 hover:opacity-90 text-white font-bold transition disabled:opacity-50"
                >
                  {isLoading ? "Verifying..." : "Verify & Enable"}
                </button>
              </form>
            </>
          )}

          {/* Success */}
          {step === "success" && (
            <div className="flex flex-col items-center py-10">
              <div className="h-20 w-20 rounded-full bg-green-500/20 border border-green-400/30 flex justify-center items-center text-4xl text-green-400">
                ✓
              </div>
              <h2 className="text-2xl font-bold text-white mt-4">Success!</h2>
              <p className="text-gray-300 mt-2">
                Google Authenticator is now enabled.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>


  );
};

export default GoogleAuthSetup;
