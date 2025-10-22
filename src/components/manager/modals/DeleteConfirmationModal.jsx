import React, { useState } from 'react';
import { deleteProject } from '../../../api/manager/project';

const DeleteConfirmationModal = ({ project, onClose, onSuccess, setToast }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleModalContentClick = (e) => e.stopPropagation();

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await deleteProject(project.id);
      if (response.success) {
        setToast?.({ show: true, message: 'Project deleted successfully!', type: 'success' });
        onSuccess();
        setTimeout(onClose, 1500);
      } else {
        setToast?.({ show: true, message: response.message || 'Failed to delete project.', type: 'error' });
        setIsLoading(false);
      }
    } catch (error) {
      setToast?.({ show: true, message: error.message || 'An error occurred.', type: 'error' });
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-md border border-red-500/30"
        onClick={handleModalContentClick}
      >
        <div className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-red-400">Are you sure?</h3>
          <p className="text-gray-300 mb-8">
            You are about to delete the project: <strong className="font-semibold text-white">{project.name}</strong>. This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-6 py-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DeleteConfirmationModal;
