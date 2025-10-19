import React, { useState, useRef, useEffect } from "react";
import EmployeeProfileEditModal from "../../components/modals/EmployeeProfileEditModal";
import Toaster from "../../components/Toaster";
import { getEmployeeProfile, updateEmployeeProfileImage } from "../../api/employee/auth";

// --- Icon Imports ---
import {
  FaPencilAlt, FaBriefcase, FaSitemap, FaCalendarAlt, FaClock, FaTint, FaRing,
  FaLanguage, FaUser, FaHeartbeat, FaPhoneAlt, FaMapMarkerAlt, FaInfoCircle
} from 'react-icons/fa';
import { IoMdClose } from "react-icons/io";
import { MdEmail } from "react-icons/md";

// --- Reusable Helper Component for Displaying Details ---
const DetailItemWithIcon = ({ icon, label, value }) => {
  // Hide component if value is missing or an invalid date
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

const Profile = () => {
  // --- State for Employee Data, Modals, and Loading ---
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("/default-profile.png");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const fileInputRef = useRef(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // --- Fetch Data on Component Mount ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getEmployeeProfile();
        const profile = response.data;

        // ✅ Map all relevant API data to state with fallbacks
        setEmployeeData({
          fullName: profile.fullName || 'Unnamed Employee',
          position: profile.position || profile.jobTitle || 'Employee',
          email: profile.email || 'N/A',
          phone: profile.phone || '',
          address: profile.address || '',
          employeeId: profile.employeeId || 'N/A',
          department: profile.department || '',
          joiningDate: profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString('en-CA') : '',
          workLocation: profile.workLocation || '',
          workSchedule: profile.workSchedule || '',
          bloodGroup: profile.bloodGroup || '',
          maritalStatus: profile.maritalStatus || '',
          languages: profile.languages || '',
          bio: profile.bio || '',
          alternatePhone: profile.alternatePhone || '',
          emergencyContactName: profile.emergencyContactName || '',
          emergencyContactPhone: profile.emergencyContactPhone || '',
          emergencyContactRelation: profile.emergencyContactRelation || '',
        });

        setProfileImage(profile.profileImage || "/default-profile.png");
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setToast({ show: true, message: "Failed to load profile data.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- Handlers ---
  const handleProfileUpdate = (updatedData) => {
    setEmployeeData(prev => ({ ...prev, ...updatedData }));
    if (updatedData.profileImage) {
      setProfileImage(updatedData.profileImage);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const oldImage = profileImage; // Store old image for revert on failure
    setIsUploadingImage(true);
    setProfileImage(URL.createObjectURL(file)); // Instant preview

    try {
      const response = await updateEmployeeProfileImage(file);
      if (response && response.data) {
        const newImageUrl = response.data.profileImage;
        setProfileImage(newImageUrl);
        // ✅ **FIX**: Correctly update employeeData state
        setEmployeeData(prev => ({ ...prev, profileImage: newImageUrl }));
        setToast({ show: true, message: "Image updated successfully!", type: "success" });
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      setToast({ show: true, message: error.message || "Image upload failed.", type: "error" });
      setProfileImage(oldImage); // Revert to old image on failure
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleEditIconClick = () => fileInputRef.current.click();

  // --- Loading State ---
  if (loading) {
    return (
      <div className="text-white space-y-6">
        <h2 className="text-4xl font-bold mb-4">Profile</h2>

        {/* Profile Card Skeleton */}
        <div className="relative bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
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

          {/* Section Header Skeleton */}
          <div className="pb-4 mb-4 border-b border-white/20">
            <div className="w-48 h-8 bg-gray-600/50 rounded animate-pulse" />
            <div className="w-72 h-4 bg-gray-600/50 rounded animate-pulse mt-2" />
          </div>

          {/* Details Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Professional Info Skeleton */}
              <div>
                <div className="w-48 h-6 bg-gray-600/50 rounded animate-pulse mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-gray-600/50 rounded animate-pulse mt-1" />
                      <div>
                        <div className="w-24 h-4 bg-gray-600/50 rounded animate-pulse" />
                        <div className="w-20 h-3 bg-gray-600/50 rounded animate-pulse mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Info Skeleton */}
              <div>
                <div className="w-48 h-6 bg-gray-600/50 rounded animate-pulse mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-gray-600/50 rounded animate-pulse mt-1" />
                      <div>
                        <div className="w-24 h-4 bg-gray-600/50 rounded animate-pulse" />
                        <div className="w-20 h-3 bg-gray-600/50 rounded animate-pulse mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Emergency Contact Skeleton */}
              <div>
                <div className="w-48 h-6 bg-gray-600/50 rounded animate-pulse mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-gray-600/50 rounded animate-pulse mt-1" />
                      <div>
                        <div className="w-24 h-4 bg-gray-600/50 rounded animate-pulse" />
                        <div className="w-20 h-3 bg-gray-600/50 rounded animate-pulse mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio Section Skeleton */}
              <div>
                <div className="w-24 h-5 bg-gray-600/50 rounded animate-pulse mb-2" />
                <div className="h-20 bg-gray-600/50 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Error/Empty State ---
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
          {/* END: CORRECTED IMAGE CONTAINER */}

          <div className="text-center md:text-left w-full">
            <div className="mt-2 text-sm font-semibold md:absolute md:top-5 md:right-5 md:mt-0 md:text-base bg-gray-600/70 text-white inline-block px-3 py-1 rounded-lg">
              {employeeData.employeeId}
            </div>
            <h3 className="text-4xl font-bold">{employeeData.fullName}</h3>
            <p className="text-purple-300 font-bold text-xl">{employeeData.position}</p>
            <div className="mt-4 space-y-2 text-sm text-gray-300">
              <DetailItemWithIcon icon={<MdEmail size={18} />} value={employeeData.email} />
              <DetailItemWithIcon icon={<FaPhoneAlt size={16} />} value={employeeData.phone} />
              <DetailItemWithIcon icon={<FaMapMarkerAlt mt={1} size={16} />} value={employeeData.address} />
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
            <div className="space-y-6">
              <div>
                <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-3"><FaBriefcase /> Professional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <DetailItemWithIcon icon={<FaSitemap />} label="Department" value={employeeData.department} />
                  <DetailItemWithIcon icon={<FaCalendarAlt />} label="Joining Date" value={employeeData.joiningDate} />
                  <DetailItemWithIcon icon={<FaMapMarkerAlt />} label="Work Location" value={employeeData.workLocation} />
                  <DetailItemWithIcon icon={<FaClock />} label="Schedule" value={employeeData.workSchedule} />
                  {/* ✅ Alternate Phone Added */}
                  <DetailItemWithIcon icon={<FaPhoneAlt />} label="Alternate Phone" value={employeeData.alternatePhone} />
                </div>
              </div>
              <div>
                <h4 className="flex text-lg items-center gap-2 text-purple-300 font-semibold mb-3"><FaUser /> Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <DetailItemWithIcon icon={<FaTint />} label="Blood Group" value={employeeData.bloodGroup} />
                  <DetailItemWithIcon icon={<FaRing />} label="Marital Status" value={employeeData.maritalStatus} />
                  <DetailItemWithIcon icon={<FaLanguage />} label="Languages" value={employeeData.languages} />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-3"><FaHeartbeat /> Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <DetailItemWithIcon icon={<FaUser />} label="Contact Name" value={employeeData.emergencyContactName} />
                  <DetailItemWithIcon icon={<FaPhoneAlt />} label="Contact Phone" value={employeeData.emergencyContactPhone} />
                  <DetailItemWithIcon icon={<FaSitemap />} label="Relation" value={employeeData.emergencyContactRelation} />
                </div>
              </div>
              {employeeData.bio && (
                <div>
                  <p className="font-semibold text-md text-white mb-1 flex items-center gap-2"><FaInfoCircle /> Bio</p>
                  <p className="text-gray-400 text-sm border-l-2 border-purple-400 pl-3">{employeeData.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Modals and Toaster --- */}
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