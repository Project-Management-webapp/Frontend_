import React, { useState, useEffect } from 'react';
import { FiX, FiSend, FiFileText } from 'react-icons/fi';
// Import your API function
import { submitWork } from '../../api/employee/assignProject'; 

const SubmitWorkModal = ({ isOpen, onClose, assignment, onSuccess, setToast }) => {
  const [formData, setFormData] = useState({
    workSubmissionNotes: '',
    actualDeliverables: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens or assignment changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        workSubmissionNotes: '',
        actualDeliverables: ''
      });
      setError('');
    }
  }, [isOpen]);

  if (!isOpen || !assignment) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.workSubmissionNotes.trim()) {
      setError('Please provide submission notes describing your work.');
      return;
    }
    if (!formData.actualDeliverables.trim()) {
      setError('Please describe or link to your deliverables.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Build the workDetails object based on your required JSON
      const workDetails = {
        workSubmissionNotes: formData.workSubmissionNotes.trim(),
        actualDeliverables: formData.actualDeliverables.trim(),
      };

      // Call the API
      await submitWork(assignment.id, workDetails);
      
      // Success
      if (onSuccess) onSuccess(); // This is handled by the parent
      onClose(); // Close the modal
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to submit work';
      setError(errorMessage);
      // Optionally use the toaster from the parent
      if (setToast) {
        setToast({ show: true, message: errorMessage, type: 'error' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FiSend className="text-purple-400" />
              Submit Work
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              For: {assignment.project?.name || 'Project'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Work Submission Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <FiFileText size={16} />
              Submission Notes <span className="text-red-400">*</span>
            </label>
            <textarea
              name="workSubmissionNotes"
              value={formData.workSubmissionNotes}
              onChange={handleChange}
              placeholder="Describe what you have completed (e.g., 'i have completed my assigned work')..."
              rows={5}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Provide a detailed description of your completed work.
            </p>
          </div>

          {/* Actual Deliverables */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <FiFileText size={16} />
              Deliverables <span className="text-red-400">*</span>
            </label>
            <textarea
              name="actualDeliverables"
              value={formData.actualDeliverables}
              onChange={handleChange}
              placeholder="Provide links or a description of your deliverables (e.g., 'all are completed', 'GitHub PR: https://...', 'Figma link: https://...')"
              rows={4}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Provide all links, files, or a summary of your deliverables.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700 bg-gray-800/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-started"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit} // Use onClick to trigger form submission
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <FiSend size={16} />
                Submit Work
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitWorkModal;