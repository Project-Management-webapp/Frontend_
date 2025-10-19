import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Toaster from "../../components/Toaster";
import { resetPassword } from "../../api/employee/auth";
import logo from "/login_logo.png";
const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "info", loading: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setToast({ show: true, message: "Passwords do not match", type: "error", loading: false });
      return;
    }

    setToast({ show: true, message: "Resetting password...", type: "info", loading: true });

    try {
      const response = await resetPassword(token, formData.password);
      setToast({ show: true, message: response.message || "Password reset successful!", type: "success", loading: false });

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Reset password error:", error);
      const msg = error.response?.data?.message || error.message || "Failed to reset password.";
      setToast({ show: true, message: msg, type: "error", loading: false });
      setFormData({ password: "", confirmPassword: "" });
    }
  };


  return (

    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 -left-1/3 w-96 h-96 bg-blue-400/50 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 -right-1/4 w-96 h-96 bg-purple-300/50 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-1/4 left-20 w-96 h-96 bg-blue-300/50 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 flex flex-col items-center w-full px-4">
        <img src={logo} alt="Logo" className="w-64 mb-0" />
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-lg p-6 sm:p-10 lg:py-10 lg:px-14 lg:mb-9 border border-white/20">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Reset Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-gray-200 text-sm font-semibold mb-1">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="input"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[2.3rem] text-gray-400 cursor-pointer"
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </span>
            </div>

            <div className="relative">
              <label className="block text-gray-200 text-sm font-semibold mb-1">Confirm Password</label>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="input"
                required
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-[2.3rem] text-gray-400 cursor-pointer"
              >
                {showConfirm ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full btn"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>

      {toast.show && (
        <Toaster message={toast.message} type={toast.type} loading={toast.loading} onClose={() => setToast({ ...toast, show: false })} />
      )}
    </div>



  );
};

export default ResetPassword;
