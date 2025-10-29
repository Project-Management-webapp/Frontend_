import React from 'react';
import PropTypes from 'prop-types';
import { IoMdClose } from 'react-icons/io';
import {
  FaBriefcase, FaSitemap, FaCalendarAlt, FaClock, FaTint, FaRing,
  FaLanguage, FaUser, FaHeartbeat, FaPhoneAlt, FaMapMarkerAlt, FaInfoCircle,
  FaMoneyBillWave, FaFileContract, FaBirthdayCake, FaVenusMars, FaFlag, FaToggleOn
} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const DetailItemWithIcon = ({ icon, label, value, isDate = false }) => {
  if (!value || value === '0000-00-00') return null;

  let displayValue = value;
  if (isDate) {
    try {
      displayValue = new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      displayValue = value;
    }
  }

  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 text-purple-300">{icon}</span>
      <div>
        {label && <p className="font-semibold text-md text-white leading-tight">{label}</p>}
        <p className="text-gray-400 text-sm capitalize">{displayValue.replace(/_/g, ' ')}</p>
      </div>
    </div>
  );
};

const EmployeeDetailModal = ({ isOpen, onClose, employeeData }) => {
  if (!isOpen) return null;

  const hasProfessionalInfo =
    employeeData.department ||
    employeeData.joiningDate ||
    employeeData.workLocation ||
    employeeData.workSchedule ||
    employeeData.alternatePhone ||
    employeeData.contractType ||
    employeeData.status ||
    employeeData.rate;

  const hasPersonalInfo =
    employeeData.bloodGroup ||
    employeeData.maritalStatus ||
    employeeData.languages ||
    employeeData.dateOfBirth ||
    employeeData.gender ||
    employeeData.nationality;

  const hasEmergencyInfo =
    employeeData.emergencyContactName ||
    employeeData.emergencyContactPhone ||
    employeeData.emergencyContactRelation;



  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-3xl flex flex-col max-h-[90vh] text-white">

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left: Profile Image and Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
              <img
                src={employeeData.profileImage || "/default-profile.png"}
                alt={employeeData.fullName || "Employee"}
                className="w-25 h-25 rounded-full object-cover border-4 border-gray-700"
              />
              <div className="text-center md:text-left flex-1">
                <div className="bg-gray-700/50 text-sm px-3 py-1 rounded inline-block mb-2">
                  {employeeData.employeeId}
                </div>
                <h3 className="text-3xl font-bold mb-1">{employeeData.fullName || "Unnamed Employee"}</h3>
                <p className="text-purple-300 font-bold text-xl mb-4">{employeeData.position || employeeData.jobTitle || "No Position"}</p>
                <div className="space-y-2">
                  <DetailItemWithIcon icon={<MdEmail size={18} />} label="Email" value={employeeData.email} />
                  <DetailItemWithIcon icon={<MdEmail size={18} />} label="Alternate Email" value={employeeData.alternateEmail} />
                  <DetailItemWithIcon icon={<FaPhoneAlt size={16} />} label="Phone" value={employeeData.phone} />
                  <DetailItemWithIcon icon={<FaMapMarkerAlt size={16} />} label="Address" value={employeeData.address} />
                </div>
              </div>
            </div>

            {/* Right: Personal Information */}
            {hasPersonalInfo && (
              <div>
                <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-3">
                  <FaUser /> Personal Information
                </h4>
                <div className="space-y-3">
                  <DetailItemWithIcon icon={<FaBirthdayCake />} label="Date of Birth" value={employeeData.dateOfBirth} isDate={true} />
                  <DetailItemWithIcon icon={<FaVenusMars />} label="Gender" value={employeeData.gender} />
                  <DetailItemWithIcon icon={<FaTint />} label="Blood Group" value={employeeData.bloodGroup} />
                  <DetailItemWithIcon icon={<FaRing />} label="Marital Status" value={employeeData.maritalStatus} />
                  <DetailItemWithIcon icon={<FaFlag />} label="Nationality" value={employeeData.nationality} />
                  <DetailItemWithIcon icon={<FaLanguage />} label="Languages" value={employeeData.languages} />
                </div>
              </div>
            )}
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div className="space-y-6">


              {hasProfessionalInfo && (
                <div>
                  <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-3">
                    <FaBriefcase /> Professional Information
                  </h4>
                  <div className="space-y-3">

                    <DetailItemWithIcon icon={<FaMoneyBillWave />} label="Base Rate" value={`$${employeeData.rate}/hr`} />
                    <DetailItemWithIcon icon={<FaSitemap />} label="Department" value={employeeData.department} />
                    <DetailItemWithIcon icon={<FaCalendarAlt />} label="Joining Date" value={employeeData.joiningDate} isDate={true} />
                    <DetailItemWithIcon icon={<FaMapMarkerAlt />} label="Work Location" value={employeeData.workLocation} />
                    <DetailItemWithIcon icon={<FaClock />} label="Schedule" value={employeeData.workSchedule} />
                    <DetailItemWithIcon icon={<FaFileContract />} label="Contract Type" value={employeeData.contractType} />
                    <DetailItemWithIcon icon={<FaToggleOn />} label="Status" value={employeeData.status} />
                    <DetailItemWithIcon icon={<FaPhoneAlt />} label="Alternate Phone" value={employeeData.alternatePhone} />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* --- Emergency Contact (Conditional) --- */}
              {hasEmergencyInfo && (
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
              )}

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


      </div>
    </div>
  );
};

EmployeeDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employeeData: PropTypes.shape({
    id: PropTypes.number,
    employeeId: PropTypes.string,
    fullName: PropTypes.string,
    email: PropTypes.string,
    alternateEmail: PropTypes.string,
    role: PropTypes.string,
    position: PropTypes.string,
    department: PropTypes.string,
    jobTitle: PropTypes.string,
    phone: PropTypes.string,
    rate: PropTypes.string,
    alternatePhone: PropTypes.string,
    emergencyContactName: PropTypes.string,
    emergencyContactPhone: PropTypes.string,
    emergencyContactRelation: PropTypes.string,
    address: PropTypes.string,
    dateOfBirth: PropTypes.string,
    gender: PropTypes.string,
    maritalStatus: PropTypes.string,
    nationality: PropTypes.string,
    bloodGroup: PropTypes.string,
    joiningDate: PropTypes.string,
    contractType: PropTypes.string,
    workLocation: PropTypes.string,
    workSchedule: PropTypes.string,
    status: PropTypes.string,
    languages: PropTypes.string,
    profileImage: PropTypes.string,
    bio: PropTypes.string,
  }).isRequired
};

DetailItemWithIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  isDate: PropTypes.bool,
};

export default EmployeeDetailModal;