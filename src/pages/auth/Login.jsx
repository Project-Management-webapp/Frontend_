import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { FiUser, FiBriefcase } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import logo from "/login_logo.png";
import { employeeLogin, forgotPassword } from "../../api/employee/auth";
import { managerLogin, managerRegister } from "../../api/manager/auth";
import { sendOTP, verifyOTP, completeLogin } from "../../api/twoFactor";
import { verifyGoogleAuthCode } from "../../api/googleAuth";
import Toaster from "../../components/Toaster";
import TwoFactorVerification from "../../components/TwoFactorVerification/TwoFactorVerification";
import GoogleAuthVerification from "../../components/GoogleAuthVerification/GoogleAuthVerification";
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    
    if (token && userRole) {
      if (userRole === "manager") {
        navigate("/manager", { replace: true });
      } else if (userRole === "employee") {
        navigate("/employee", { replace: true });
      }
    }
  }, [navigate]);
  const [view, setView] = useState("role-select");
  const [role, setRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ email: "", password: "" });

  const [forgotEmail, setForgotEmail] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "info", loading: false });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 2FA States
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showGoogleAuthModal, setShowGoogleAuthModal] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleManagerSignup = async (e) => {
    e.preventDefault();
    setToast({ show: true, message: "Creating your account...", type: "info", loading: true });

    try {
      const response = await managerRegister(signupData);
      if (response.success) {
        setToast({ show: false, message: "", type: "info", loading: false });
        setSignupData({ email: "", password: "" });
        setShowSuccessModal(true);
        
        // Redirect to home after 10 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate("/");
        }, 10000);
      } else {
        setToast({
          show: true,
          message: response.message || "Registration failed",
          type: "error",
          loading: false,
        });
      }
    } catch (error) {
      console.error("Manager signup error:", error);
      const msg = error.message || "Registration failed. Please try again.";
      setToast({ show: true, message: msg, type: "error", loading: false });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setToast({ show: true, message: "Logging in...", type: "info", loading: true });
    
    try {
      let response;
      if (role === "manager") {
        response = await managerLogin(formData);
      } else {
        response = await employeeLogin(formData);
      }
      
      if (response && response.data) {
        // Check if 2FA is required
        if (response.require2FA) {
          // Store user data for 2FA
          setTwoFactorData(response.data);
          
          // Check which 2FA method to use
          if (response.twoFactorMethod === 'google') {
            // Google Authenticator - no need to send OTP
            setToast({ show: true, message: "Please enter code from Google Authenticator", type: "info", loading: false });
            setShowGoogleAuthModal(true);
          } else {
            // Email OTP - send OTP to user's email
            setToast({ show: true, message: "Sending verification code...", type: "info", loading: false });
            await sendOTP(response.data.userId, response.data.email);
            setToast({ show: true, message: "Verification code sent to your email", type: "success", loading: false });
            setShow2FAModal(true);
          }
          return;
        }

        // Normal login without 2FA
        const { user, token } = response.data;
        login(user, token);

        setToast({ show: true, message: response.message || "Successfully logged in!", type: "success", loading: false });
        setTimeout(() => {
          if (user.role === "manager") {
            navigate("/manager");
          } else {
            navigate("/employee");
          }
        }, 500);
      } else {
        throw new Error("Invalid response from server.");
      }

    } catch (error) {
      setToast({ show: true, message: error.message || "Login failed. Check credentials.", type: "error", loading: false });
      setFormData({ email: "", password: "" });
    }
  };

  const handle2FAVerify = async (otp) => {
    try {
      // Verify OTP
      await verifyOTP(twoFactorData.userId, otp);
      
      // Complete login after successful verification
      const response = await completeLogin(twoFactorData.userId);
      
      if (response && response.data) {
        const { user, token } = response.data;
        login(user, token);

        setShow2FAModal(false);
        setToast({ show: true, message: "Successfully logged in!", type: "success", loading: false });
        
        setTimeout(() => {
          if (user.role === "manager") {
            navigate("/manager");
          } else {
            navigate("/employee");
          }
        }, 500);
      }
    } catch (error) {
      throw new Error(error.message || "Invalid OTP. Please try again.");
    }
  };

  const handle2FAResend = async () => {
    try {
      await sendOTP(twoFactorData.userId, twoFactorData.email);
      setToast({ show: true, message: "New verification code sent", type: "success", loading: false });
    } catch (error) {
      throw new Error(error.message || "Failed to resend code");
    }
  };

  const handle2FAClose = () => {
    setShow2FAModal(false);
    setTwoFactorData(null);
    setFormData({ email: "", password: "" });
  };

  const handleGoogleAuthVerify = async (code) => {
    try {
      // Verify Google Auth code
      await verifyGoogleAuthCode(twoFactorData.userId, code);
      
      // Complete login after successful verification
      const response = await completeLogin(twoFactorData.userId);
      
      if (response && response.data) {
        const { user, token } = response.data;
        login(user, token);

        setShowGoogleAuthModal(false);
        setToast({ show: true, message: "Successfully logged in!", type: "success", loading: false });
        
        setTimeout(() => {
          if (user.role === "manager") {
            navigate("/manager");
          } else {
            navigate("/employee");
          }
        }, 500);
      }
    } catch (error) {
      throw new Error(error.message || "Invalid code. Please try again.");
    }
  };

  const handleGoogleAuthClose = () => {
    setShowGoogleAuthModal(false);
    setTwoFactorData(null);
    setFormData({ email: "", password: "" });
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setToast({ show: true, message: "Sending reset link...", type: "info", loading: true });

    try {
      const response = await forgotPassword(forgotEmail);
      if (response.success) {
        setToast({
          show: true,
          message: response.message,
          type: "success",
          loading: false,
        });
        setForgotEmail("");
        setTimeout(() => setView("login"), 2000);
      } else {
        setToast({
          show: true,
          message: response.message || "Failed to send reset link",
          type: "error",
          loading: false,
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      const msg =
        error.response?.data?.message || error.message || "Failed to send reset link.";
      setToast({ show: true, message: msg, type: "error", loading: false });
      setFormData({ email: "", password: "" });
    }
  };


  const renderContent = () => {
    switch (view) {
      case "login":
        return (
          <>
            <div className="flex items-center mb-6">
              <button
                onClick={() => { setView("role-select"); setRole(null); }}
                className="text-gray-300 hover:text-white"
              >
                <span className="mr-2 text-lg cursor-pointer hover:text-purple-300"><FaArrowLeft /></span>
              </button>
              <h2 className="text-3xl font-extrabold text-center flex-1 text-white">Welcome Back!</h2>
            </div>
            <div className="text-center text-gray-300 mb-6">
              <span>Login as a <strong className="text-purple-400 capitalize">{role}</strong></span>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-200 text-sm font-bold mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input" placeholder="Enter your Email" required />
              </div>
              <div className="relative">
                <label className="block text-gray-200 text-sm font-bold mb-2">Password</label>
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} className="input" placeholder="Enter Password" required />
                <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[2.4rem] text-gray-400 text-lg cursor-pointer">
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </span>
              </div>
              <div className="flex items-center justify-end text-sm mt-2">
                <button type="button" onClick={() => setView("forgot")} className="text-gray-300 hover:text-white cursor-pointer">Forgot password?</button>
              </div>
              <button 
                type="submit" 
                className="btn w-full mt-4 disabled:opacity-70 disabled:cursor-not-allowed" 
                disabled={toast.loading}
              >
                {toast.loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            {role === "manager" && (
              <div className="mt-6 text-center">
                <p className="text-gray-300 text-sm">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setView("manager-signup")}
                    className="text-[#ac51fc] hover:text-purple-300 font-semibold"
                    disabled={toast.loading}
                  >
                    Sign up as Manager
                  </button>
                </p>
              </div>
            )}
          </>
        );
      
      case "manager-signup":
        return (
          <>
            <div className="flex items-center mb-6">
              <button
                onClick={() => { setView("login"); }}
                className="text-gray-300 hover:text-white"
              >
                <span className="mr-2 text-lg cursor-pointer hover:text-purple-300"><FaArrowLeft /></span>
              </button>
              <h2 className="text-3xl font-extrabold text-center flex-1 text-white">Manager Signup</h2>
            </div>
            <div className="text-center text-gray-300 mb-6">
              <p className="text-sm">Create your manager account and wait for admin approval</p>
            </div>
            <form onSubmit={handleManagerSignup} className="space-y-4">
              <div>
                <label className="block text-gray-200 text-sm font-bold mb-2">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={signupData.email} 
                  onChange={handleSignupInputChange} 
                  className="input" 
                  placeholder="Enter your Email" 
                  required 
                />
              </div>
              <div className="relative">
                <label className="block text-gray-200 text-sm font-bold mb-2">Password</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={signupData.password} 
                  onChange={handleSignupInputChange} 
                  className="input" 
                  placeholder="Create Password (min 6 characters)" 
                  minLength="6"
                  required 
                />
                <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[2.4rem] text-gray-400 text-lg cursor-pointer">
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </span>
              </div>
              <button 
                type="submit" 
                className="btn w-full mt-4 disabled:opacity-70 disabled:cursor-not-allowed" 
                disabled={toast.loading}
              >
                {toast.loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-[#ac51fc] hover:text-purple-300 font-semibold"
                  disabled={toast.loading}
                >
                  Sign in
                </button>
              </p>
            </div>
          </>
        );
      case "forgot":
        return (
          <div className="text-center">
            <h2 className="text-xl font-bold text-center mb-2 text-white">Reset Password</h2>
            <p className="text-gray-300 text-center mb-6">Enter your email to receive a reset link</p>
            <form onSubmit={handleForgot}>
              <div className="mb-6 text-left">
                <label className="block text-gray-200 text-sm font-bold mb-2">Email</label>
                <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="input" placeholder="Enter your Email" required />
              </div>
              <button 
                type="submit" 
                className="btn w-full disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={toast.loading}
              >
                {toast.loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            <button 
              onClick={() => setView("login")} 
              className="font-semibold text-[#ac51fc] hover:text-white text-sm mt-6 block mx-auto disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={toast.loading}
            >
              ← Back to Login
            </button>
          </div>
        );
      
      case "role-select":
        return (
          <>
            <h2 className="text-3xl font-extrabold text-center mb-6 text-white">Welcome!</h2>
            <div className="flex flex-col gap-4">
              <button onClick={() => { setRole("employee"); setView("login"); }} className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300">
                <FiUser className="text-xl" /> Continue as Employee
              </button>
              <button onClick={() => { setRole("manager"); setView("login"); }} className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300">
                <FiBriefcase className="text-xl" /> Continue as Manager
              </button>
            </div>
            
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 relative overflow-hidden">

      <div className="absolute top-0 -left-1/3 w-96 h-96 bg-blue-400/50 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 -right-1/4 w-96 h-96 bg-purple-300/50 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-1/4 left-20 w-96 h-96 bg-blue-300/50 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 flex flex-col items-center w-full px-4">
        <img src={logo} alt="Logo" className="w-40 mb-10" />
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-lg p-6 sm:p-10 lg:py-10 lg:px-14 lg:mb-9 border border-white/20">
          {renderContent()}
        </div>
      </div>

      {toast.show && (
        <Toaster message={toast.message} type={toast.type} loading={toast.loading} onClose={() => setToast({ ...toast, show: false })} />
      )}

      {/* Success Modal for Manager Registration */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-xl">
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-md w-full mx-4">
          
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Registration Successful!
            </h2>
            
            <p className="text-center text-gray-200 text-lg mb-4">
              Your manager account has been created successfully.
            </p>
            
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 mb-6">
              <p className="text-center text-blue-300 text-sm">
                ⏳ <strong>Please wait for admin approval</strong> to access your account.
              </p>
            </div>

            <p className="text-center text-gray-400 text-sm">
              You will be redirected to the home page in a few seconds...
            </p>

            {/* Progress Bar */}
            <div className="mt-6 w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#ac51fc] to-purple-600 rounded-full animate-progress"
                style={{ animation: 'progress 10s linear forwards' }}
              ></div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/");
              }}
              className="mt-6 w-full py-3 bg-gradient-to-r from-[#ac51fc] to-purple-600 rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              Go to Home Now
            </button>
          </div>
        </div>
      )}

      {/* Two-Factor Authentication Modal */}
      {twoFactorData && (
        <TwoFactorVerification
          isOpen={show2FAModal}
          onClose={handle2FAClose}
          onVerify={handle2FAVerify}
          onResend={handle2FAResend}
          userEmail={twoFactorData.email}
        />
      )}

      {/* Google Authenticator Verification Modal */}
      {twoFactorData && (
        <GoogleAuthVerification
          isOpen={showGoogleAuthModal}
          onClose={handleGoogleAuthClose}
          onVerify={handleGoogleAuthVerify}
        />
      )}
    </div>
  );
};

export default Login;