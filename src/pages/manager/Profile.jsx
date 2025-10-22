import React, { useState, useRef, useEffect } from "react";
import ManagerProfileEditModal from "../../components/manager/modals/ManagerProfileEditModal";
import Toaster from "../../components/Toaster";
import { getManagerProfile, updateManagerProfileImage } from "../../api/manager/auth";

import {
  FaClock ,
  FaPencilAlt, FaBriefcase, FaSitemap, FaCalendarAlt, FaTint, FaRing,
  FaLanguage, FaUser, FaHeartbeat, FaPhoneAlt, FaMapMarkerAlt, FaInfoCircle,
  FaLayerGroup, FaBirthdayCake, FaVenusMars, FaFlag, FaFileContract, FaCalendarCheck,
  FaMoneyBillWave, FaTools, FaGraduationCap, FaCertificate, FaToggleOn, FaGlobe
} from 'react-icons/fa';
import { IoMdClose } from "react-icons/io";
import { MdEmail } from "react-icons/md";

const DetailItemWithIcon = ({ icon, label, value, isDate = false }) => {
  let displayValue = value;
  let valueClass = "text-gray-400 text-sm break-words"; 

  if (!value || value === 'N/A' || value === '0000-00-00') {
    displayValue = "N/A";
    valueClass = "text-gray-500 text-sm italic";
  } else if (isDate) {
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) throw new Error('Invalid Date'); 
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
      <span className="mt-1 text-purple-300 shrink-0">{icon}</span>
      <div>
        <p className="font-semibold text-md text-white leading-tight">{label}</p>
        <p className={valueClass}>{displayValue}</p>
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getManagerProfile();
        const profile = response.data;

        setManagerData({
          // Core Info
          fullName: profile.fullName || "Unnamed Manager",
          position: profile.position || profile.jobTitle || "Manager",
          email: profile.email || "N/A",
          managerId: profile.managerId || "N/A",
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
          // role: profile.role || null,
          department: profile.department || null,
          // level: profile.level || null,
          joiningDate: profile.joiningDate || profile.createdAt || null, // Use createdAt as fallback
          // contractType: profile.contractType || null,
          // workLocation: profile.workLocation || null,
          // workSchedule: profile.workSchedule || null,
          // probationEndDate: profile.probationEndDate || null,
          // confirmationDate: profile.confirmationDate || null,
          status: profile.status || null,
          timezone: profile.timezone || null,

          // Personal
          dateOfBirth: profile.dateOfBirth || null,
          gender: profile.gender || null,
          maritalStatus: profile.maritalStatus || null,
          nationality: profile.nationality || null,
          bloodGroup: profile.bloodGroup || null,
          languages: profile.languages || null,
          
          // Emergency Contact
          emergencyContactName: profile.emergencyContactName || null,
          emergencyContactPhone: profile.emergencyContactPhone || null,
          emergencyContactRelation: profile.emergencyContactRelation || null,
          
          // Compensation
          // baseSalary: profile.baseSalary || null,
          // currency: profile.currency || null,
          
          // Qualifications
          skills: profile.skills || null,
          education: profile.education || null,
          certifications: profile.certifications || null,
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
              {managerData.managerId}
            </div>
            <h3 className="text-4xl font-bold">{managerData.fullName}</h3>
            <p className="text-purple-300 font-bold text-xl">{managerData.position}</p>
            {/* --- MODIFIED: Using DetailItemWithIcon for consistency --- */}
            <div className="mt-4 space-y-2 text-sm text-gray-300">
              <DetailItemWithIcon icon={<MdEmail size={18} />} label="Email" value={managerData.email} />
              <DetailItemWithIcon icon={<FaPhoneAlt size={16} />} label="Phone" value={managerData.phone} />
              <DetailItemWithIcon icon={<FaMapMarkerAlt size={16} />} label="Address" value={managerData.address} />
            </div>
          </div>
        </div>
        <div className="relative bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <button onClick={() => setIsEditModalOpen(true)} className="absolute top-4 right-4 bg-gray-500/50 cursor-pointer text-white p-2 rounded-full hover:bg-gray-500/80" aria-label="Edit manager details"><FaPencilAlt size={16} /></button>
          <div className="pb-4 mb-4 border-b border-white/20">
            <h3 className="text-3xl font-bold text-white">Manager Details</h3>
            <p className="text-sm md:text-base text-gray-400">Professional, personal, and emergency information.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
            
           
            <div className="space-y-6">
              {/* Professional Info */}
              <div className="bg-black/10 p-4 rounded-lg">
                <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-4"><FaBriefcase /> Professional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* <DetailItemWithIcon icon={<FaSitemap />} label="Role" value={managerData.role} /> */}
                  <DetailItemWithIcon icon={<FaSitemap />} label="Department" value={managerData.department} />
                  {/* <DetailItemWithIcon icon={<FaLayerGroup />} label="Level" value={managerData.level} /> */}
                  {/* <DetailItemWithIcon icon={<FaFileContract />} label="Contract Type" value={managerData.contractType} /> */}
                  <DetailItemWithIcon icon={<FaToggleOn />} label="Status" value={managerData.status} />
                  <DetailItemWithIcon icon={<FaGlobe />} label="Timezone" value={managerData.timezone} />
                  {/* <DetailItemWithIcon icon={<FaMapMarkerAlt />} label="Work Location" value={managerData.workLocation} />
                  <DetailItemWithIcon icon={<FaClock />} label="Schedule" value={managerData.workSchedule} /> */}
                  <DetailItemWithIcon icon={<FaCalendarAlt />} label="Joining Date" value={managerData.joiningDate} isDate={true} />
                  {/* <DetailItemWithIcon icon={<FaCalendarCheck />} label="Probation End" value={managerData.probationEndDate} isDate={true} />
                  <DetailItemWithIcon icon={<FaCalendarCheck />} label="Confirmation Date" value={managerData.confirmationDate} isDate={true} /> */}
                </div>
              </div>
              
              {/* Personal Info */}
              <div className="bg-black/10 p-4 rounded-lg">
                <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-4"><FaUser /> Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <DetailItemWithIcon icon={<FaBirthdayCake />} label="Date of Birth" value={managerData.dateOfBirth} isDate={true} />
                  <DetailItemWithIcon icon={<FaVenusMars />} label="Gender" value={managerData.gender} />
                  <DetailItemWithIcon icon={<FaTint />} label="Blood Group" value={managerData.bloodGroup} />
                  <DetailItemWithIcon icon={<FaRing />} label="Marital Status" value={managerData.maritalStatus} />
                  <DetailItemWithIcon icon={<FaFlag />} label="Nationality" value={managerData.nationality} />
                  <DetailItemWithIcon icon={<FaLanguage />} label="Languages" value={managerData.languages} />
                </div>
              </div>

              {/* Qualifications */}
              <div className="bg-black/10 p-4 rounded-lg">
                <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-4"><FaGraduationCap /> Qualifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <DetailItemWithIcon icon={<FaTools />} label="Skills" value={managerData.skills} />
                  <DetailItemWithIcon icon={<FaGraduationCap />} label="Education" value={managerData.education} />
                  <DetailItemWithIcon icon={<FaCertificate />} label="Certifications" value={managerData.certifications} />
                </div>
              </div>

            </div>
            
           
            <div className="space-y-6">
              {/* Contact & Address */}
              <div className="bg-black/10 p-4 rounded-lg">
                <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-4"><FaMapMarkerAlt /> Contact & Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <DetailItemWithIcon icon={<MdEmail />} label="Alternate Email" value={managerData.alternateEmail} />
                  <DetailItemWithIcon icon={<FaPhoneAlt />} label="Alternate Phone" value={managerData.alternatePhone} />
                  <DetailItemWithIcon icon={<FaMapMarkerAlt />} label="Address" value={managerData.address} />
                  <DetailItemWithIcon icon={<FaMapMarkerAlt />} label="City" value={managerData.city} />
                  <DetailItemWithIcon icon={<FaMapMarkerAlt />} label="State" value={managerData.state} />
                  <DetailItemWithIcon icon={<FaMapMarkerAlt />} label="Country" value={managerData.country} />
                  <DetailItemWithIcon icon={<FaMapMarkerAlt />} label="Zip Code" value={managerData.zipCode} />
                </div>
              </div>
              
              {/* Emergency Contact */}
              <div className="bg-black/10 p-4 rounded-lg">
                <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-4"><FaHeartbeat /> Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <DetailItemWithIcon icon={<FaUser />} label="Contact Name" value={managerData.emergencyContactName} />
                  <DetailItemWithIcon icon={<FaPhoneAlt />} label="Contact Phone" value={managerData.emergencyContactPhone} />
                  <DetailItemWithIcon icon={<FaSitemap />} label="Relation" value={managerData.emergencyContactRelation} />
                </div>
              </div>
              
              {/* Compensation */}
              {/* <div className="bg-black/10 p-4 rounded-lg">
                <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-4"><FaMoneyBillWave /> Compensation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <DetailItemWithIcon 
                    icon={<FaMoneyBillWave />} 
                    label="Base Salary" 
                    value={managerData.baseSalary ? parseFloat(managerData.baseSalary).toLocaleString() : null} 
                  />
                  <DetailItemWithIcon icon={<FaMoneyBillWave />} label="Currency" value={managerData.currency} />
                </div>
              </div> */}

              {/* Bio */}
              <div className="bg-black/10 p-4 rounded-lg">
                <h4 className="flex items-center text-lg gap-2 text-purple-300 font-semibold mb-4"><FaInfoCircle /> Bio</h4>
                <p className={!managerData.bio ? "text-gray-500 text-sm italic" : "text-gray-400 text-sm border-l-2 border-purple-400 pl-3"}>
                  {managerData.bio || "N/A"}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
      {isImageModalOpen && (<div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50" onClick={() => setIsImageModalOpen(false)}><img src={profileImage} alt="Profile Preview" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" /><button className="absolute top-5 right-5 text-white text-3xl cursor-pointer hover:text-purple-300"><IoMdClose /></button></div>)}
      {isEditModalOpen && (<ManagerProfileEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} userData={managerData} onShowToast={setToast} onSave={handleProfileUpdate} />)}
     
      <div className="relative z-[9999]">
        {toast.show && (<Toaster message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />)}
      </div>
    </>
  );
};

export default Profile;