import React from 'react';
import PropTypes from 'prop-types';
import { IoMdClose } from 'react-icons/io';
import {
  FaBriefcase, FaSitemap, FaCalendarAlt, FaClock, FaTint, FaRing,
  FaLanguage, FaUser, FaHeartbeat, FaPhoneAlt, FaMapMarkerAlt, FaInfoCircle
} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const DetailItemWithIcon = ({ icon, label, value }) => {
  if (!value || value === '0000-00-00') return null;
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 text-purple-300">{icon}</span>
      <div>
        {label && <p className="font-semibold text-md text-white leading-tight">{label}</p>}
        <p className="text-gray-400 text-sm">{value}</p>
      </div>
    </div>
  );
};

const EmployeeDetailModal = ({ isOpen, onClose, employeeData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-3xl flex flex-col max-h-[90vh] text-white">
        {/* Header with close button */}
        <div className="relative p-6 border-b border-gray-700 flex justify-between items-center shrink-0">
          <h2 className="text-2xl font-bold">Employee Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {/* Top Profile Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <img
              src={employeeData.profileImage || "/default-profile.png"}
              alt={employeeData.fullName}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
            />
            <div className="text-center md:text-left flex-1">
              <div className="bg-gray-700/50 text-sm px-3 py-1 rounded inline-block mb-2">
                {employeeData.employeeId}
              </div>
              <h3 className="text-3xl font-bold mb-1">{employeeData.fullName}</h3>
              <p className="text-purple-300 font-bold text-xl mb-4">{employeeData.position}</p>
              <div className="space-y-2">
                <DetailItemWithIcon icon={<MdEmail size={18} />} value={employeeData.email} />
                <DetailItemWithIcon icon={<FaPhoneAlt size={16} />} value={employeeData.phone} />
                <DetailItemWithIcon icon={<FaMapMarkerAlt size={16} />} value={employeeData.address} />
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Professional Information */}
              <div>
                <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-3">
                  <FaBriefcase /> Professional Information
                </h4>
                <div className="space-y-3">
                  <DetailItemWithIcon icon={<FaSitemap />} label="Department" value={employeeData.department} />
                  <DetailItemWithIcon icon={<FaCalendarAlt />} label="Joining Date" value={employeeData.joiningDate} />
                  <DetailItemWithIcon icon={<FaMapMarkerAlt />} label="Work Location" value={employeeData.workLocation} />
                  <DetailItemWithIcon icon={<FaClock />} label="Schedule" value={employeeData.workSchedule} />
                  <DetailItemWithIcon icon={<FaPhoneAlt />} label="Alternate Phone" value={employeeData.alternatePhone} />
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-3">
                  <FaUser /> Personal Information
                </h4>
                <div className="space-y-3">
                  <DetailItemWithIcon icon={<FaTint />} label="Blood Group" value={employeeData.bloodGroup} />
                  <DetailItemWithIcon icon={<FaRing />} label="Marital Status" value={employeeData.maritalStatus} />
                  <DetailItemWithIcon icon={<FaLanguage />} label="Languages" value={employeeData.languages} />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Emergency Contact */}
              <div>
                <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-3">
                  <FaHeartbeat /> Emergency Contact
                </h4>
                <div className="space-y-3">
                  <DetailItemWithIcon icon={<FaUser />} label="Contact Name" value={employeeData.emergencyContactName} />
                  <DetailItemWithIcon icon={<FaPhoneAlt />} label="Contact Phone" value={employeeData.emergencyContactPhone} />
                  <DetailItemWithIcon icon={<FaSitemap />} label="Relation" value={employeeData.emergencyContactRelation} />
                </div>
              </div>

              {/* Bio Section */}
              {employeeData.bio && (
                <div>
                  <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-3">
                    <FaInfoCircle /> Bio
                  </h4>
                  <p className="text-gray-400 text-sm border-l-2 border-purple-400 pl-3">
                    {employeeData.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end bg-gray-800/95 backdrop-blur-sm shrink-0">
          <button
            onClick={onClose}
            className="cancel-btn"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

EmployeeDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employeeData: PropTypes.shape({
    fullName: PropTypes.string,
    position: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    employeeId: PropTypes.string,
    department: PropTypes.string,
    joiningDate: PropTypes.string,
    workLocation: PropTypes.string,
    workSchedule: PropTypes.string,
    bloodGroup: PropTypes.string,
    maritalStatus: PropTypes.string,
    languages: PropTypes.string,
    bio: PropTypes.string,
    alternatePhone: PropTypes.string,
    emergencyContactName: PropTypes.string,
    emergencyContactPhone: PropTypes.string,
    emergencyContactRelation: PropTypes.string,
    profileImage: PropTypes.string
  }).isRequired
};

DetailItemWithIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string,
  value: PropTypes.string
};

export default EmployeeDetailModal;
