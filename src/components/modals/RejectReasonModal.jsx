import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FormTextarea } from '../atoms/FormFields'; 

const RejectReasonModal = ({ isOpen, onClose, onSubmit,toast }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return;
    
    setIsSubmitting(true);
    await onSubmit(reason); 
    setIsSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[60] p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-md border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Reason for Rejection</h2>
            <p className="text-sm text-gray-400">Please provide a reason for rejecting this project.</p>
            <button
              type="button"
              onClick={onClose}
              className="absolute cursor-pointer top-6 right-6 text-gray-400 hover:text-white"
            >
              <IoMdClose size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <FormTextarea
              id="rejectionReason"
              label="Rejection Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., I do not have bandwidth for this project..."
              required
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-4 p-6 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason || isSubmitting}
              className="btn" 
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rejection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectReasonModal;