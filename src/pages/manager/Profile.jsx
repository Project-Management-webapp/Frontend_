import React, { useState, useRef, useEffect } from "react";
import ManagerProfileEditModal from "../../components/modals/ManagerProfileEditModal";
import Toaster from "../../components/Toaster";
import { getManagerProfile, updateManagerProfileImage } from "../../api/manager/auth";

// --- Icon Imports ---
import {
  FaPencilAlt, FaBriefcase, FaSitemap, FaCalendarAlt, FaTint, FaRing,
  FaLanguage, FaUser, FaHeartbeat, FaPhoneAlt, FaMapMarkerAlt
} from 'react-icons/fa';
import { IoMdClose } from "react-icons/io";
import { MdEmail } from "react-icons/md";

// --- Reusable Helper Component for Displaying Details ---
const DetailItemWithIcon = ({ icon, label, value }) => {
  if (!value || value === "N/A") return null;
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 text-purple-300 shrink-0">{icon}</span>
      <div>
        <p className="font-semibold text-md text-white leading-tight">{label}</p>
        <p className="text-gray-400 text-sm break-words">{value}</p>
      </div>
    </div>
  );
};

const Profile = () => {
  const [managerData, setManagerData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("/default-profile.png");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // --- Fetch Profile Data on Component Mount ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getManagerProfile();
        const profile = response.data;

        setManagerData({
          fullName: profile.fullName || "N/A",
          position: profile.position || profile.jobTitle || "Manager",
          email: profile.email || "N/A",
          phone: profile.phone || "",
          address: profile.address || "",
          managerId: profile.managerId || "N/A",
          department: profile.department || "",
          joiningDate: profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-CA') : 'N/A',
          bloodGroup: profile.bloodGroup || "",
          maritalStatus: profile.maritalStatus || "",
          languages: profile.languages || "",
          alternatePhone: profile.alternatePhone || "",
          emergencyContactName: profile.emergencyContactName || "",
          emergencyContactPhone: profile.emergencyContactPhone || "",
          emergencyContactRelation: profile.emergencyContactRelation || "",
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

  const handleProfileUpdate = (updatedDataFromApi) => {
    setManagerData(prev => ({ ...prev, ...updatedDataFromApi }));
    if (updatedDataFromApi.profileImage) {
      setProfileImage(updatedDataFromApi.profileImage);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const oldImage = profileImage;
    setIsUploadingImage(true);
    setProfileImage(URL.createObjectURL(file));

    try {
      const response = await updateManagerProfileImage(file);
      if (response && response.data) {
        const newImageUrl = response.data.profileImage;
        setProfileImage(newImageUrl);
        setManagerData(prev => ({ ...prev, profileImage: newImageUrl }));
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

  if (loading) {
    // --- Skeleton Loader (Direct Reports section removed) ---
    return (
      <div className="text-white space-y-6 animate-pulse">
        <div className="h-10 bg-gray-700/50 rounded w-1/4" />
        <div className="relative bg-white/10 p-6 rounded-lg flex flex-col md:flex-row items-center gap-6">
          <div className="w-36 h-36 rounded-full bg-gray-700/50 shrink-0" />
          <div className="w-full space-y-3">
            <div className="h-8 bg-gray-700/50 rounded w-1/2" />
            <div className="h-6 bg-gray-700/50 rounded w-1/3" />
            <div className="h-4 bg-gray-700/50 rounded w-full mt-2" />
            <div className="h-4 bg-gray-700/50 rounded w-3/4" />
          </div>
        </div>
        <div className="relative bg-white/10 p-6 rounded-lg">
          <div className="pb-4 mb-4 border-b border-white/20">
            <div className="h-8 bg-gray-700/50 rounded w-1/3" />
            <div className="h-4 bg-gray-700/50 rounded w-2/3 mt-2" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-700/50 rounded-lg" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!managerData) return <div className="text-white p-6">Profile not found.</div>;

  return (
    <>
      <div className="text-white space-y-6">
        <h2 className="text-4xl font-bold mb-4">Profile</h2>

        {/* --- Top Profile Card --- */}
        <div className="relative bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 flex flex-col md:flex-row items-center gap-6">

          {/* START: CORRECTED IMAGE CONTAINER */}
          <div className="relative w-36 h-36 shrink-0 group">
            <img
              src={profileImage}
              alt="Profile"
              className={`w-full h-full rounded-full object-cover border-4 border-gray-500/50 transition-opacity duration-300 ${isUploadingImage ? 'opacity-50' : 'opacity-100'}`}
              onClick={() => !isUploadingImage && setIsImageModalOpen(true)}
            />

            {/* Spinner Overlay */}
            {isUploadingImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
              </div>
            )}

            {/* Edit Button */}
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
              {managerData.managerId}
            </div>
            <h3 className="text-4xl font-bold">{managerData.fullName}</h3>
            <p className="text-purple-300 font-bold text-xl">{managerData.position}</p>
            <div className="mt-4 space-y-2 text-sm text-gray-300">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <MdEmail className="text-purple-300" size={18} />
                <span>{managerData.email}</span>
              </div>
              {managerData.phone &&
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <FaPhoneAlt className="text-purple-300" size={16} />
                  <span>{managerData.phone}</span>
                </div>
              }
              {managerData.address &&
                <div className="flex items-start justify-center md:justify-start gap-3">
                  <FaMapMarkerAlt className="text-purple-300 mt-1" size={16} />
                  <span>{managerData.address}</span>
                </div>
              }
            </div>
          </div>
        </div>

        {/* --- Manager Details Section (Direct Reports removed) --- */}
        <div className="relative bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <button onClick={() => setIsEditModalOpen(true)} className="absolute top-4 right-4 bg-gray-500/50 cursor-pointer text-white p-2 rounded-full hover:bg-gray-500/80" aria-label="Edit manager details"><FaPencilAlt size={16} /></button>
          <div className="pb-4 mb-4 border-b border-white/20">
            <h3 className="text-3xl font-bold text-white">Manager Details</h3>
            <p className="text-sm md:text-base text-gray-400">Professional, personal, and emergency information.</p>
          </div>
          <div className="space-y-6">
            <div className="bg-black/10 p-4 rounded-lg">
              <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-4"><FaBriefcase /> Professional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DetailItemWithIcon icon={<FaSitemap />} label="Department" value={managerData.department} />
                <DetailItemWithIcon icon={<FaCalendarAlt />} label="Joining Date" value={managerData.joiningDate} />
                <DetailItemWithIcon icon={<FaPhoneAlt />} label="Alternate Phone" value={managerData.alternatePhone} />
              </div>
            </div>
            <div className="bg-black/10 p-4 rounded-lg">
              <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-4"><FaUser /> Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <DetailItemWithIcon icon={<FaTint />} label="Blood Group" value={managerData.bloodGroup} />
                <DetailItemWithIcon icon={<FaRing />} label="Marital Status" value={managerData.maritalStatus} />
                <DetailItemWithIcon icon={<FaLanguage />} label="Languages" value={managerData.languages} />
              </div>
            </div>
            <div className="bg-black/10 p-4 rounded-lg">
              <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-4"><FaHeartbeat /> Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <DetailItemWithIcon icon={<FaUser />} label="Contact Name" value={managerData.emergencyContactName} />
                <DetailItemWithIcon icon={<FaPhoneAlt />} label="Contact Phone" value={managerData.emergencyContactPhone} />
                <DetailItemWithIcon icon={<FaSitemap />} label="Relation" value={managerData.emergencyContactRelation} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modals and Toaster --- */}
      {isImageModalOpen && (<div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50" onClick={() => setIsImageModalOpen(false)}><img src={profileImage} alt="Profile Preview" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" /><button className="absolute top-5 right-5 text-white text-3xl cursor-pointer hover:text-purple-300"><IoMdClose /></button></div>)}
      {isEditModalOpen && (<ManagerProfileEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} userData={managerData} onShowToast={setToast} onSave={handleProfileUpdate} />)}
      {toast.show && (<Toaster message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />)}
    </>
  );
};

export default Profile;