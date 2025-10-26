import React, { use } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiLogOut } from 'react-icons/fi';
import { managerLogout } from '../../api/manager/auth';
import { employeeLogout } from '../../api/employee/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const LogoutModal = ({ isOpen, onClose, role, onShowToast }) => {
  const handleModalContentClick = (e) => e.stopPropagation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
  try {
    if (role === 'admin') {
      console.log('Admin logged out');
    } else if (role === 'manager') {
      await managerLogout();
      console.log('Manager logged out');
    } else {
      await employeeLogout();
      console.log('Employee logged out');
    }

    // Clear persisted view states
    localStorage.removeItem('managerActiveView');
    localStorage.removeItem('employeeActiveView');
    
    // localStorage.removeItem('token');
    // localStorage.removeItem('userRole');
    // localStorage.removeItem('userId');
    // localStorage.clear(); 
    logout();


    onShowToast({ show: true, message: 'Logged out successfully', type: 'success' });
    onClose();

    setTimeout(() => {
      navigate('/');
    }, 50); 
  } catch (error) {
    console.error(error);
    onShowToast({ show: true, message: 'Logout failed', type: 'error' });
  }
};

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-gray-800 p-6 text-white shadow-xl border border-white/20"
        onClick={handleModalContentClick}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close modal"
        >
          <IoMdClose size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-500">
            <FiLogOut size={24} />
          </div>

          <h2 className="mb-2 text-2xl font-bold">Confirm Logout</h2>
          <p className="mb-6 text-gray-400">Are you sure you want to log out of your account?</p>

          <div className="flex w-full gap-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-md bg-gray-600 px-4 py-2 font-semibold hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 rounded-md bg-red-600 px-4 py-2 font-semibold hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;