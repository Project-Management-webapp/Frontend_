import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { updateManagerProfile } from "../../api/manager/auth";

// Helper components (unchanged)
const FormInput = ({ id, label, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      type="text"
      id={id}
      name={id}
      value={value || ""}
      onChange={onChange}
      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
    />
  </div>
);

const FormTextarea = ({ id, label, value, onChange, rows = 3 }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <textarea
      id={id}
      name={id}
      rows={rows}
      value={value || ""}
      onChange={onChange}
      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
    />
  </div>
);

// Main component (MODIFIED)
const ManagerProfileEditModal = ({ isOpen, onClose, userData, onSave, onShowToast }) => {
  const [formData, setFormData] = useState(userData);
  const [saving, setSaving] = useState(false);

  useEffect(() => setFormData(userData), [userData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const profileUpdatePayload = {
      fullName: formData.fullName,
      phone: formData.phone,
      alternatePhone: formData.alternatePhone,
      address: formData.address,
      department: formData.department,
      maritalStatus: formData.maritalStatus,
      bloodGroup: formData.bloodGroup,
      languages: formData.languages,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactPhone: formData.emergencyContactPhone,
      emergencyContactRelation: formData.emergencyContactRelation,
    };

    try {
      const apiResponse = await updateManagerProfile(profileUpdatePayload);

      if (apiResponse && apiResponse.data) {
        onSave(apiResponse.data);
        onShowToast({ show: true, message: 'Profile updated successfully!', type: 'success' });
        onClose();
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      const errorMessage = error.message || 'Failed to update profile';
      onShowToast({ show: true, message: errorMessage, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleModalContentClick = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-xl border border-white/20 max-h-[90vh] flex flex-col"
        onClick={handleModalContentClick}
      >
        <div className="relative p-6 pb-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-6 right-6 text-gray-400 hover:text-white"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
          <h3 className="text-lg font-semibold text-purple-300">Contact & Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput id="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} />
            <FormInput id="phone" label="Phone Number" value={formData.phone} onChange={handleChange} />
            <FormInput id="alternatePhone" label="Alternate Phone Number" value={formData.alternatePhone} onChange={handleChange} />
          </div>
          <FormTextarea id="address" label="Address" value={formData.address} onChange={handleChange} rows={2} />

          <h3 className="text-lg font-semibold text-purple-300">Professional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput id="department" label="Department" value={formData.department} onChange={handleChange} />
          </div>

          <h3 className="text-lg font-semibold text-purple-300">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-300 mb-1">Marital Status</label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus || ""}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select...</option>
                <option>Single</option>
                <option>Married</option>
                <option>Divorced</option>
                <option>Widowed</option>
              </select>
            </div>
            <div>
              <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-300 mb-1">Blood Group</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup || ""}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select...</option>
                <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
              </select>
            </div>
          </div>
          <FormInput id="languages" label="Languages (comma-separated)" value={formData.languages} onChange={handleChange} />

          <h3 className="text-lg font-semibold text-purple-300">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput id="emergencyContactName" label="Contact Name" value={formData.emergencyContactName} onChange={handleChange} />
            <FormInput id="emergencyContactPhone" label="Contact Phone" value={formData.emergencyContactPhone} onChange={handleChange} />
          </div>
          <FormInput id="emergencyContactRelation" label="Relation" value={formData.emergencyContactRelation} onChange={handleChange} />

        </form>

        <div className="flex justify-end space-x-4 p-6 pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={onClose}
             disabled={saving}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={saving}
            className="btn"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfileEditModal;