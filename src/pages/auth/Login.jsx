import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { FiUser, FiBriefcase } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import logo from "/login_logo.png";
import { employeeLogin, forgotPassword } from "../../api/employee/auth";
import { managerLogin } from "../../api/manager/auth";
import Toaster from "../../components/Toaster";
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

  const [forgotEmail, setForgotEmail] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "info", loading: false });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    </div>
  );
};

export default Login;