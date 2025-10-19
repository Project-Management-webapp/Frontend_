import React, { useState } from 'react';

const ManagerSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Employee Signup Data:', formData);
    // You can add your API call here
  };

  return (
    <div className="max-w-md mx-auto">
  <h2 className="text-2xl font-bold mb-6 text-center text-white">
    Employee Signup
  </h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    {/* Name Input */}
    <div>
      <label className="block text-gray-200 text-sm font-bold mb-2">
        Name
      </label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="input"
        placeholder="Enter your full name"
        required
      />
    </div>

    {/* Phone Number Input */}
    <div>
      <label className="block text-gray-200 text-sm font-bold mb-2">
        Phone Number
      </label>
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        className="input"
        placeholder="Enter your phone number"
        required
      />
    </div>

    {/* Date of Birth Input */}
    <div>
      <label className="block text-gray-200 text-sm font-bold mb-2">
        Date of Birth
      </label>
      <input
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        className="input"
        required
      />
    </div>

    {/* Email Input */}
    <div>
      <label className="block text-gray-200 text-sm font-bold mb-2">
        Email
      </label>
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

    {/* Password Input */}
    <div>
      <label className="block text-gray-200 text-sm font-bold mb-2">
        Password
      </label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        className="input"
        placeholder="Create a strong password"
        required
      />
    </div>

    {/* Sign Up Button */}
    <button
      type="submit"
      className="btn w-full"
    >
      Sign Up
    </button>
  </form>
</div>
  );
};

export default ManagerSignup;
