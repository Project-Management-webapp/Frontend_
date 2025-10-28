import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { updateManagerProfile } from "../../../api/manager/auth";
import {FormInput,FormSelect,FormTextarea} from '../../atoms/FormFields' 

const ManagerProfileEditModal = ({ isOpen, onClose, userData, onSave, onShowToast }) => {
  const [formData, setFormData] = useState(userData);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const formattedData = {
      ...userData,
      joiningDate: userData.joiningDate ? new Date(userData.joiningDate).toLocaleDateString('en-CA') : '',
      dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString('en-CA') : '',
    };
    setFormData(formattedData);
  }, [userData]);

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
      position: formData.position,
      phone: formData.phone,
      alternatePhone: formData.alternatePhone,
      alternateEmail: formData.alternateEmail,
      
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zipCode: formData.zipCode,

      department: formData.department,
      joiningDate: formData.joiningDate,
      status: formData.status,
      timezone: formData.timezone,
      
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      languages: formData.languages,

      skills: formData.skills,

      emergencyContactName: formData.emergencyContactName,
      emergencyContactPhone: formData.emergencyContactPhone,
      emergencyContactRelation: formData.emergencyContactRelation,
      
      bio: formData.bio,
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
        className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-3xl border border-white/20 max-h-[90vh] flex flex-col"
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
          
          {/* --- Section 1: Core Info --- */}
          <h3 className="text-lg font-semibold text-purple-300">Core Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput id="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} />
            <FormInput id="position" label="Position / Job Title" value={formData.position} onChange={handleChange} />
          </div>

          {/* --- Section 2: Contact --- */}
          <h3 className="text-lg font-semibold text-purple-300">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput id="phone" label="Phone Number" value={formData.phone} onChange={handleChange} />
            <FormInput id="alternatePhone" label="Alternate Phone" value={formData.alternatePhone} onChange={handleChange} />
            <FormInput id="alternateEmail" label="Alternate Email" value={formData.alternateEmail} onChange={handleChange} type="email" />
          </div>

          {/* --- Section 3: Address --- */}
          <h3 className="text-lg font-semibold text-purple-300">Address</h3>
          <FormTextarea id="address" label="Address" value={formData.address} onChange={handleChange} rows={2} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormInput id="city" label="City" value={formData.city} onChange={handleChange} />
            <FormInput id="state" label="State" value={formData.state} onChange={handleChange} />
            <FormInput id="country" label="Country" value={formData.country} onChange={handleChange} />
            <FormInput id="zipCode" label="Zip Code" value={formData.zipCode} onChange={handleChange} />
          </div>

          {/* --- Section 4: Professional --- */}
          <h3 className="text-lg font-semibold text-purple-300">Professional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormInput id="department" label="Department" value={formData.department} onChange={handleChange} />
            <FormInput id="joiningDate" label="Joining Date" value={formData.joiningDate} onChange={handleChange} type="date" />
            <FormSelect id="status" label="Status" value={formData.status} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </FormSelect>
            <FormInput id="timezone" label="Timezone" value={formData.timezone} onChange={handleChange} />
          </div>

          {/* --- Section 5: Personal --- */}
          <h3 className="text-lg font-semibold text-purple-300">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormInput id="dateOfBirth" label="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} type="date" />
            <FormSelect id="gender" label="Gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </FormSelect>
           
            <FormInput id="languages" label="Languages (comma-separated)" value={formData.languages} onChange={handleChange} />
          </div>

          {/* --- Section 6: Qualifications --- */}
          <h3 className="text-lg font-semibold text-purple-300">Qualifications</h3>
          <FormTextarea id="skills" label="Skills (comma-separated)" value={formData.skills} onChange={handleChange} rows={2} />

          {/* --- Section 7: Emergency Contact --- */}
          <h3 className="text-lg font-semibold text-purple-300">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput id="emergencyContactName" label="Contact Name" value={formData.emergencyContactName} onChange={handleChange} />
            <FormInput id="emergencyContactPhone" label="Contact Phone" value={formData.emergencyContactPhone} onChange={handleChange} />
            <FormInput id="emergencyContactRelation" label="Relation" value={formData.emergencyContactRelation} onChange={handleChange} />
          </div>

          {/* --- Section 8: Bio --- */}
          <h3 className="text-lg font-semibold text-purple-300">Bio</h3>
          <FormTextarea id="bio" label="About Me" value={formData.bio} onChange={handleChange} rows={4} />

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