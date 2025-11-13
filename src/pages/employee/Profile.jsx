import React, { useState, useRef, useEffect } from "react";
import EmployeeProfileEditModal from "../../components/employee/modals/EmployeeProfileEditModal";
import Toaster from "../../components/Toaster";
import TwoFactorToggle from "../../components/TwoFactorToggle/TwoFactorToggle";
import { getEmployeeProfile, updateEmployeeProfileImage } from "../../api/employee/auth";
import { formatDate } from "../../components/atoms/FormatedDate";
import {
  FaPencilAlt, FaBriefcase, FaSitemap, FaCalendarAlt, FaClock, 
  FaLanguage, FaUser, FaHeartbeat, FaPhoneAlt, FaMapMarkerAlt, FaInfoCircle,
   FaBirthdayCake, FaVenusMars, FaFileContract, 
   FaTools, FaGraduationCap,  FaToggleOn, FaGlobe
, FaIdCard, FaTachometerAlt,  FaChevronLeft
} from 'react-icons/fa';
import { IoMdClose } from "react-icons/io";
import { MdEmail } from "react-icons/md";

const DetailItemWithIcon = ({ icon, label, value, isDate = false }) => {
  let displayValue = value;
  let valueClass = "text-gray-400 text-sm";

  if (!value || value === '0000-00-00') {
    displayValue = "N/A";
    valueClass = "text-gray-500 text-sm italic";
  } else if (isDate) {
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) throw new Error("Invalid Date");
      displayValue = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      displayValue = "N/A";
      valueClass = "text-gray-500 text-sm italic";
    }
  }

  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 text-purple-300">{icon}</span>
      <div>
        {label && <p className="font-semibold text-md text-white leading-tight">{label}</p>}
        <p className={valueClass}>{displayValue}</p>
      </div>
    </div>
  );
};

const Profile = ({ setActiveView }) => {

  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("/default-profile.png");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const fileInputRef = useRef(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getEmployeeProfile();
        const profile = response.data;


        setEmployeeData({
          // Core Info
          fullName: profile.fullName || 'Unnamed Employee',
          position: profile.position || profile.jobTitle || 'Employee',
          email: profile.email || 'N/A',
          employeeId: profile.employeeId || 'N/A',
          bio: profile.bio || null,
          profileImage: profile.profileImage || null,

          // Contact
          phone: profile.phone || null,
          alternatePhone: profile.alternatePhone || null,
          alternateEmail: profile.alternateEmail || null,

          // Address
          address: profile.address || null,
          city: profile.city || null,
          state: profile.state || null,
          country: profile.country || null,
          zipCode: profile.zipCode || null,

          // Professional
          department: profile.department || null,
          jobTitle: profile.jobTitle || null,
          joiningDate: profile.joiningDate || null,
          contractType: profile.contractType || null,
          workLocation: profile.workLocation || null,
          workSchedule: profile.workSchedule || null,
          status: profile.status || null,
          timezone: profile.timezone || null,
          rate: profile.rate || null,

          // Personal
          dateOfBirth: profile.dateOfBirth || null,
          gender: profile.gender || null,
          languages: profile.languages || null,

          // Emergency Contact
          emergencyContactName: profile.emergencyContactName || null,
          emergencyContactPhone: profile.emergencyContactPhone || null,
          emergencyContactRelation: profile.emergencyContactRelation || null,

          // Qualifications
          skills: profile.skills || null,
        });

        setProfileImage(profile.profileImage || "/default-profile.png");
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError(error.message || "Failed to load profile data.");
        setToast({ show: true, message: "Failed to load profile data.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);


  const handleProfileUpdate = (updatedData) => {
    setEmployeeData(prev => ({ ...prev, ...updatedData }));
    if (updatedData.profileImage) {
      setProfileImage(updatedData.profileImage);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const oldImage = profileImage;
    setIsUploadingImage(true);
    setProfileImage(URL.createObjectURL(file));

    try {
      const response = await updateEmployeeProfileImage(file);
      if (response && response.data) {
        const newImageUrl = response.data.profileImage;
        setProfileImage(newImageUrl);
        setEmployeeData(prev => ({ ...prev, profileImage: newImageUrl }));
        setToast({ show: true, message: "Image updated successfully!", type: "success" });
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      setToast({ show: true, message: error.message || "Image upload failed.", type: "error" });
      setProfileImage(oldImage);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleEditIconClick = () => fileInputRef.current.click();


  // Error/Not Found State
  if (error || (!loading && !employeeData)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-red-500/30 rounded-xl shadow-2xl p-8 text-center">
            <div className="bg-red-600/10 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <FaUser className="text-red-500 text-5xl" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Profile Not Found</h2>
            <p className="text-gray-400 mb-6 text-lg">
              {error || "We couldn't load your profile data. Please try again or contact support."}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry
              </button>
              <button
                onClick={() => setError(null)}
                className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Dismiss
              </button>
            </div>
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-300">
                <FaInfoCircle className="inline mr-2" />
                If the problem persists, please contact our support team.
              </p>
            </div>
          </div>
        </div>
        {toast.show && (
          <Toaster
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false, message: "", type: "" })}
          />
        )}
      </div>
    );
  }

  if (loading) {

    const SkeletonItem = () => (
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 bg-gray-600/50 rounded animate-pulse mt-1 shrink-0" />
        <div className="w-full">
          <div className="w-24 h-4 bg-gray-600/50 rounded animate-pulse" />
          <div className="w-20 h-3 bg-gray-600/50 rounded animate-pulse mt-2" />
        </div>
      </div>
    );


    const SkeletonSection = ({ titleWidth = "w-48", items = 2, cols = 2 }) => (
      <div>
        <div className={`${titleWidth} h-6 bg-gray-600/50 rounded animate-pulse mb-4`} />
        <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-x-6 gap-y-4`}>
          {[...Array(items)].map((_, i) => <SkeletonItem key={i} />)}
        </div>
      </div>
    );

    return (
      <div className="text-white space-y-6">
        <h2 className="text-4xl font-bold mb-4">Profile</h2>


        <div className="relative bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 flex flex-col md:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <div className="w-36 h-36 rounded-full bg-gray-600/50 animate-pulse" />
            <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-gray-600/50 animate-pulse" />
          </div>
          <div className="text-center md:text-left w-full">
            <div className="w-24 h-6 bg-gray-600/50 rounded animate-pulse md:absolute md:top-5 md:right-5" />
            <div className="w-48 h-10 bg-gray-600/50 rounded animate-pulse mt-2" />
            <div className="w-36 h-6 bg-gray-600/50 rounded animate-pulse mt-2" />
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-center md:justify-start gap-3">
                  <div className="w-5 h-5 bg-gray-600/50 rounded animate-pulse" />
                  <div className="w-36 h-4 bg-gray-600/50 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className="relative bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-600/50 animate-pulse" />
          <div className="pb-4 mb-4 border-b border-white/20">
            <div className="w-48 h-8 bg-gray-600/50 rounded animate-pulse" />
            <div className="w-72 h-4 bg-gray-600/50 rounded animate-pulse mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">


            <div className="space-y-6">
              <SkeletonSection titleWidth="w-56" items={11} cols={2} />
              <SkeletonSection titleWidth="w-48" items={6} cols={2} />
              <SkeletonSection titleWidth="w-40" items={3} cols={2} />
            </div>


            <div className="space-y-6">
              <SkeletonSection titleWidth="w-32" items={6} cols={2} />
              <SkeletonSection titleWidth="w-56" items={3} cols={2} />
              <SkeletonSection titleWidth="w-44" items={2} cols={2} />


              <div>
                <div className="w-20 h-5 bg-gray-600/50 rounded animate-pulse mb-2" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-600/50 rounded w-full" />
                  <div className="h-3 bg-gray-600/50 rounded w-full" />
                  <div className="h-3 bg-gray-600/50 rounded w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!employeeData) {
    return <div className="p-6 text-red-400">Could not load employee profile.</div>;
  }

  return (
    <>
      <div className="text-white space-y-6">
        <h2 className="text-4xl font-bold mb-4">Profile</h2>

        {/* --- Top Profile Card --- */}
        <div className="relative bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-36 h-36 shrink-0 group">
            <img
              src={profileImage}
              alt="Profile"
              className={`w-full h-full rounded-full object-cover border-4 border-gray-500/50 transition-opacity duration-300 ${isUploadingImage ? 'opacity-50' : 'opacity-100'}`}
              onClick={() => !isUploadingImage && setIsImageModalOpen(true)}
            />
            {isUploadingImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
              </div>
            )}
            {!isUploadingImage && (
              <button
                onClick={handleEditIconClick}
                className="absolute bottom-2 right-2 cursor-pointer bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700"
                aria-label="Edit profile picture"
              >
                <FaPencilAlt />
              </button>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
          </div>

          <div className="text-center md:text-left w-full">
            <div className="mt-2 text-sm font-semibold md:absolute md:top-5 md:right-5 md:mt-0 md:text-base bg-gray-600/70 text-white inline-block px-3 py-1 rounded-lg">
              {employeeData.employeeId}
            </div>
            <h3 className="text-4xl font-bold">{employeeData.fullName}</h3>
            <p className="text-purple-300 font-bold text-xl">{employeeData.position}</p>
            <div className="mt-4 space-y-2 text-sm text-gray-300">
              <DetailItemWithIcon icon={<MdEmail size={18} />} label="Email" value={employeeData.email} />
              <DetailItemWithIcon icon={<MdEmail size={18} />} label="Alternate Email" value={employeeData.alternateEmail} />
              <DetailItemWithIcon icon={<FaPhoneAlt size={16} />} label="Phone" value={employeeData.phone} />
            </div>
          </div>
        </div>

        {/* --- Employee Details Section --- */}
        <div className="relative bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <button onClick={() => setIsEditModalOpen(true)} className="absolute cursor-pointer top-4 right-4 bg-gray-500/50 text-white p-2 rounded-full hover:bg-gray-500/80">
            <FaPencilAlt size={16} />
          </button>
          <div className="pb-4 mb-4 border-b border-white/20">
            <h3 className="text-3xl font-bold text-white">Employee Details</h3>
            <p className="text-sm md:text-base text-gray-400">A comprehensive overview of your information.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">

            {/* --- LEFT COLUMN --- */}
            <div className="space-y-6">
              {/* Professional Info */}
              <div>
                <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-3"><FaBriefcase /> Professional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

                  <DetailItemWithIcon icon={<FaSitemap />} label="Department" value={employeeData.department} />
                  <DetailItemWithIcon icon={<FaIdCard />} label="Job Title" value={employeeData.jobTitle} />
                  <DetailItemWithIcon icon={<FaFileContract />} label="Contract Type" value={employeeData.contractType} />
                  <DetailItemWithIcon icon={<FaToggleOn />} label="Status" value={employeeData.status} />
                  <DetailItemWithIcon icon={<FaGlobe />} label="Timezone" value={employeeData.timezone} />
                  <DetailItemWithIcon icon={<FaMapMarkerAlt />} label="Work Location" value={employeeData.workLocation} />
                  <DetailItemWithIcon icon={<FaClock />} label="Schedule" value={employeeData.workSchedule} />
                 <DetailItemWithIcon 
  icon={<FaCalendarAlt />} 
  label="Joining Date" 
  value={formatDate(employeeData.createdAt)} 
/>
                  <DetailItemWithIcon
                    icon={<FaTachometerAlt />}
                    label="Rate"
                    value={`$${employeeData.rate} USD per hour`}
                  />

                </div>
              </div>

              <div>
                <h4 className="flex text-lg items-center gap-2 text-purple-300 font-semibold mb-3"><FaUser /> Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <DetailItemWithIcon icon={<FaBirthdayCake />} label="Date of Birth" value={employeeData.dateOfBirth} isDate={true} />
                  <DetailItemWithIcon icon={<FaVenusMars />} label="Gender" value={employeeData.gender} />
                  <DetailItemWithIcon icon={<FaLanguage />} label="Languages" value={employeeData.languages} />
                </div>
              </div>

              {/* Qualifications */}
              <div>
                <h4 className="flex text-lg items-center gap-2 text-purple-300 font-semibold mb-3"><FaGraduationCap /> Qualifications</h4>
                <div className="space-y-4 text-sm">
                  <DetailItemWithIcon icon={<FaTools />} label="Skills" value={employeeData.skills} />
                </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN --- */}
            <div className="space-y-6">
              {/* Address */}
              <div>
                <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-3"><FaMapMarkerAlt /> Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <DetailItemWithIcon icon={<FaMapMarkerAlt />} label="Address" value={employeeData.address} />
                  <DetailItemWithIcon icon={<FaMapMarkerAlt />} label="City" value={employeeData.city} />
                  <DetailItemWithIcon icon={<FaMapMarkerAlt />} label="State" value={employeeData.state} />
                  <DetailItemWithIcon icon={<FaMapMarkerAlt />} label="Country" value={employeeData.country} />
                  <DetailItemWithIcon icon={<FaMapMarkerAlt />} label="Zip Code" value={employeeData.zipCode} />
                  <DetailItemWithIcon icon={<FaPhoneAlt />} label="Alternate Phone" value={employeeData.alternatePhone} />
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-3"><FaHeartbeat /> Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <DetailItemWithIcon icon={<FaUser />} label="Contact Name" value={employeeData.emergencyContactName} />
                  <DetailItemWithIcon icon={<FaPhoneAlt />} label="Contact Phone" value={employeeData.emergencyContactPhone} />
                  <DetailItemWithIcon icon={<FaSitemap />} label="Relation" value={employeeData.emergencyContactRelation} />
                </div>
              </div>
              {/* Bio */}
              <div className="col-span-1 md:col-span-2">
                <p className="font-semibold text-md text-white mb-1 flex items-center gap-2"><FaInfoCircle /> Bio</p>

                <p className={!employeeData.bio ? "text-gray-500 text-sm italic" : "text-gray-400 text-sm border-l-2 border-purple-400 pl-3"}>
                  {employeeData.bio || "N/A"}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* --- Two-Factor Authentication Section --- */}
        <TwoFactorToggle 
          onToast={(message, type) => setToast({ show: true, message, type })}
        />
      </div>

      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50" onClick={() => setIsImageModalOpen(false)}>
          <img src={profileImage} alt="Profile Preview" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" />
          <button className="absolute top-5 cursor-pointer hover:text-purple-300 right-5 text-white text-3xl">
            <IoMdClose />
          </button>
        </div>
      )}

      {isEditModalOpen && (
        <EmployeeProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userData={employeeData}
          onSave={handleProfileUpdate}
          onShowToast={setToast}
        />
      )}

      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </>
  );
};

export default Profile;