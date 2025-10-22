import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FormInput } from '../../atoms/FormFields';

const AddEmployeeModal = ({ isOpen, onClose, onAddEmployee }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; 
    
    setIsSubmitting(true);
    try {
      await onAddEmployee(formData);
      setFormData({ email: '', password: '' });
    } catch (error) {
        console.error('Error adding employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setFormData({ email: '', password: '' });
    setShowPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 border border-gray-700">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          disabled={isSubmitting}
        >
          <IoMdClose size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">Add New Employee</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Email"
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="employee@example.com"
            required
            className="input"
          />
          
          <div className="relative">
            <FormInput
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a secure password"
              required
              className="input" 
            />
            <span 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-[2.4rem] text-gray-400 text-lg cursor-pointer"
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </span>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn"
          >
            {isSubmitting ? 'Adding...' : 'Add Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;