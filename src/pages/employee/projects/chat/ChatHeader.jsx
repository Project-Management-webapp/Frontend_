import React from "react";
import { FaBars, FaUsers } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

const ChatHeader = ({ selectedProject, selectedProjectDetails, setIsSidebarOpen }) => {
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const assignments = selectedProjectDetails?.assignments || [];
  const creator = selectedProjectDetails?.creator;
  
  // Get unique team members (manager + employees)
  const teamMembers = [];
  
  // Add creator/manager first
  if (creator) {
    teamMembers.push({
      id: creator.id,
      name: creator.fullName || creator.email,
      email: creator.email,
      image: creator.profileImage,
      role: "Manager"
    });
  }
  
  // Add employees from assignments
  assignments.forEach(assignment => {
    if (assignment.employee && !teamMembers.find(m => m.id === assignment.employee.id)) {
      teamMembers.push({
        id: assignment.employee.id,
        name: assignment.employee.fullName || assignment.employee.email,
        email: assignment.employee.email,
        image: assignment.employee.profileImage,
        role: assignment.role || "Employee"
      });
    }
  });

  return (
    <div className="p-4 md:p-5 border-b border-gray-700/50 flex-shrink-0 bg-gradient-to-r from-gray-800 via-gray-850 to-gray-900 backdrop-blur-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <FaBars size={20} />
          </button>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {selectedProject?.name || "Select a Project"}
            </h2>
            {selectedProjectDetails?.description && (
              <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                {selectedProjectDetails.description}
              </p>
            )}
          </div>
        </div>

        {/* Team Members */}
        {teamMembers.length > 0 && (
          <div className="flex items-center gap-2 ml-4">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {teamMembers.slice(0, 4).map((member, index) => (
                  <div
                    key={member.id}
                    className="relative group"
                    style={{ zIndex: teamMembers.length - index }}
                  >
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-9 h-9 rounded-full border-2 border-gray-800 object-cover hover:border-purple-500 transition-all cursor-pointer"
                        title={`${member.name} (${member.role})`}
                      />
                    ) : (
                      <div
                        className="w-9 h-9 rounded-full border-2 border-gray-800 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-xs font-semibold hover:border-purple-500 transition-all cursor-pointer"
                        title={`${member.name} (${member.role})`}
                      >
                        {getInitials(member.name)}
                      </div>
                    )}
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      <div className="font-semibold">{member.name}</div>
                      <div className="text-gray-400 text-xs">{member.role}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                ))}
                
                {teamMembers.length > 4 && (
                  <div
                    className="w-9 h-9 rounded-full border-2 border-gray-800 bg-gray-700 flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:border-purple-500 transition-all"
                    title={`${teamMembers.length - 4} more members`}
                  >
                    +{teamMembers.length - 4}
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-xs text-gray-400 hidden sm:flex items-center gap-1">
              <FaUsers size={12} />
              <span>{teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
