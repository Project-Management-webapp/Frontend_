import React, { useState } from "react";
import { employeeSignup } from "../../api/employee/auth"; 
import Toaster from "../../components/Toaster"; 

const EmployeeSignup = ({ handleSignup }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [toaster, setToaster] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToaster({ show: false, message: "", type: "success" });

    try {
      const response = await employeeSignup(formData);

      setToaster({
        show: true,
        message: response.message || "Signup successful! Please check your email.",
        type: "success",
      });

      if (handleSignup) handleSignup(response);
      setFormData({
        email: "",
        password: "",
      });

    } catch (error) {
      setToaster({
        show: true,
        message: error.message || "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto relative">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        Employee Signup
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
      
        <div>
          <label className="block text-gray-200 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            placeholder="Enter your email"
            required
          />
        </div>

    
        <div>
          <label className="block text-gray-200 text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input"
            placeholder="Create a strong password"
            required
            minLength={6} 
          />
        </div>

        <button type="submit" className="btn w-full" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default EmployeeSignup;