import React, { useState } from 'react';
import { FaIdBadge, FaBriefcase } from 'react-icons/fa';
import EmployeeDetailModal from '../modals/EmployeeDetailModal';

const EmployeeCard = ({ employee }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const name = employee.fullName || 'Unnamed Employee';
  const position = employee.position || employee.jobTitle || 'No Position';
  const department = employee.department || 'No Department';
  const profileImage = employee.profileImage || '/default-profile.png'; 
  return (
    <>
      <div 
        className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 text-white flex items-center gap-4 transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={profileImage}
          alt={name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-500/50 shrink-0"
        />
        <div className="flex-1 overflow-hidden">
          <h3 className="text-lg font-bold truncate" title={name}>{name}</h3>
          <p className="text-purple-300 text-sm font-semibold truncate" title={position}>{position}</p>
          
          <div className="text-xs text-gray-300 space-y-1 mt-2">
            <div className="flex items-center gap-2">
              <FaBriefcase className="text-purple-300" />
              <span className="truncate" title={department}>{department}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaIdBadge className="text-purple-300" />
              <span className="truncate" title={employee.employeeId}>{employee.employeeId}</span>
            </div>
          </div>
        </div>
      </div>

      <EmployeeDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employeeData={employee}
      />
    </>
  );
}
export default EmployeeCard;