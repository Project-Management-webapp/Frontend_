import React, { useState } from 'react';
import { FiX, FiClock, FiPackage, FiBox, FiPlus, FiTrash2 } from 'react-icons/fi';

const FinishWorkModal = ({ isOpen, onClose, assignment, onSubmit }) => {
  const [actualHours, setActualHours] = useState('');
  const [actualConsumables, setActualConsumables] = useState(['']);
  const [actualMaterials, setActualMaterials] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddConsumable = () => {
    setActualConsumables([...actualConsumables, '']);
  };

  const handleRemoveConsumable = (index) => {
    setActualConsumables(actualConsumables.filter((_, i) => i !== index));
  };

  const handleConsumableChange = (index, value) => {
    const updated = [...actualConsumables];
    updated[index] = value;
    setActualConsumables(updated);
  };

  const handleAddMaterial = () => {
    setActualMaterials([...actualMaterials, '']);
  };

  const handleRemoveMaterial = (index) => {
    setActualMaterials(actualMaterials.filter((_, i) => i !== index));
  };

  const handleMaterialChange = (index, value) => {
    const updated = [...actualMaterials];
    updated[index] = value;
    setActualMaterials(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty strings
    const filteredConsumables = actualConsumables.filter(item => item.trim() !== '');
    const filteredMaterials = actualMaterials.filter(item => item.trim() !== '');

    const payload = {
      actualHours: parseFloat(actualHours) || 0,
      actualConsumables: filteredConsumables,
      actualMaterials: filteredMaterials,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
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
            <input
              type="number"
              step="0.5"
              min="0"
              value={actualHours}
              onChange={(e) => setActualHours(e.target.value)}
              placeholder="Enter actual hours worked"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Estimated: {assignment?.estimatedHours || 0} hours
            </p>
          </div>

          {/* Actual Consumables */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FiPackage className="text-yellow-400" />
              Actual Consumables Used
            </label>
            <div className="space-y-2">
              {actualConsumables.map((consumable, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={consumable}
                    onChange={(e) => handleConsumableChange(index, e.target.value)}
                    placeholder="e.g., Printer ink, Paper, etc."
                    className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  {actualConsumables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveConsumable(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddConsumable}
                className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20 rounded-lg transition-colors"
              >
                <FiPlus size={16} />
                Add Consumable
              </button>
            </div>
            {assignment?.estimatedConsumables && assignment.estimatedConsumables.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Estimated: {JSON.stringify(assignment.estimatedConsumables)}
              </p>
            )}
          </div>

          {/* Actual Materials */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FiBox className="text-green-400" />
              Actual Materials Used
            </label>
            <div className="space-y-2">
              {actualMaterials.map((material, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => handleMaterialChange(index, e.target.value)}
                    placeholder="e.g., Steel, Wood, Concrete, etc."
                    className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {actualMaterials.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddMaterial}
                className="flex items-center gap-2 px-4 py-2 text-sm text-green-400 hover:text-green-300 hover:bg-green-900/20 rounded-lg transition-colors"
              >
                <FiPlus size={16} />
                Add Material
              </button>
            </div>
            {assignment?.estimatedMaterials && assignment.estimatedMaterials.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Estimated: {JSON.stringify(assignment.estimatedMaterials)}
              </p>
            )}
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
