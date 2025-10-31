import React, { useState } from 'react';
import { FiX, FiDollarSign } from 'react-icons/fi';
import { FormInput } from '../../atoms/FormFields';

const EditRateModal = ({ isOpen, onClose, employee, onUpdateRate }) => {
  const [rate, setRate] = useState(employee?.rate || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rate || parseFloat(rate) <= 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdateRate({ rate: parseFloat(rate) });
      onClose();
    } catch (error) {
      console.error('Error updating rate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Edit Employee Rate</h2>
            <p className="text-gray-400 text-sm mt-1">
              Update rate for: <span className="text-purple-400 font-medium">{employee?.fullName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isSubmitting}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FiDollarSign className="text-green-400" />
              Hourly Rate <span className="text-red-400">*</span>
            </label>
            <FormInput
              type="number"
              step="0.01"
              min="0"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="Enter hourly rate"
            />
            <p className="text-xs text-gray-400 mt-1">
              Current rate: ${employee?.rate || 'N/A'}/hr
            </p>
          </div>

          

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !rate || parseFloat(rate) <= 0}
              className="btn"
            >
              {isSubmitting ? 'Updating...' : 'Update Rate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRateModal;
