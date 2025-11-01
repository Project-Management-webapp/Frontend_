import React, { useState } from 'react';
import { FiX, FiClock, FiPackage, FiBox } from 'react-icons/fi';
import {FormInput} from "../../atoms/FormFields";

const FinishWorkModal = ({ isOpen, onClose, assignment, onSubmit }) => {
  const [actualHours, setActualHours] = useState('');
  const [actualConsumables, setActualConsumables] = useState('');
  const [actualMaterials, setActualMaterials] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      actualHours: actualHours ? parseFloat(actualHours) : 0,
      actualConsumables: actualConsumables ? parseFloat(actualConsumables) : 0,
      actualMaterials: actualMaterials ? parseFloat(actualMaterials) : 0,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Finish Work</h2>
            <p className="text-gray-400 text-sm mt-1">
              Submit final details for: <span className="text-purple-400 font-medium">{assignment?.project?.name}</span>
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
          {/* Actual Hours */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FiClock className="text-blue-400" />
              Actual Hours Worked <span className="text-red-400">*</span>
            </label>
            <FormInput
              type="number"
              step="0.5"
              min="0"
              value={actualHours}
              onChange={(e) => setActualHours(e.target.value)}
              placeholder="Enter actual hours worked"
              onWheel={(e) => e.target.blur()}

            />
            
          </div>

          {/* Actual Consumables */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FiPackage className="text-yellow-400" />
              Actual Consumables Cost
            </label>
            <FormInput
              type="number"
              step="0.01"
              min="0"
              value={actualConsumables}
              onChange={(e) => setActualConsumables(e.target.value)}
              placeholder="0.00"
              onWheel={(e) => e.target.blur()}
            />
          </div>

          {/* Actual Materials */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FiBox className="text-green-400" />
              Actual Materials Cost
            </label>
            <FormInput
              type="number"
              step="0.01"
              min="0"
              value={actualMaterials}
              onChange={(e) => setActualMaterials(e.target.value)}
              placeholder="0.00"
              onWheel={(e) => e.target.blur()}
            />
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
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Work'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinishWorkModal;
