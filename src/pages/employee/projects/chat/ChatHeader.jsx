import React, { useState } from "react";
import { FaBars, FaUsers } from "react-icons/fa";
import { IoPerson, IoVideocam } from "react-icons/io5";
import { HiRefresh } from "react-icons/hi";
import { useSocket } from "../../../../context/SocketContext";

const ChatHeader = ({ selectedProject, selectedProjectDetails, setIsSidebarOpen, onStartVideoCall }) => {
  const { isConnected, getUserStatus, socket } = useSocket();
  const currentUserId = localStorage.getItem('userId');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleReconnect = () => {
    setIsRefreshing(true);
    
    // If socket exists, try to reconnect
    if (socket) {
      socket.disconnect();
      setTimeout(() => {
        socket.connect();
        console.log('🔄 Attempting to reconnect...');
      }, 500);
    } else {
      // Fallback: reload the page
      window.location.reload();
    }
    
    // Stop spinning after 3 seconds
    setTimeout(() => {
      setIsRefreshing(false);
    }, 3000);
  };
  
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

  // Get online/offline status
  const myStatus = getUserStatus ? getUserStatus(currentUserId) : 'offline';
  const isOnline = isConnected && myStatus === 'online';

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
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {selectedProject?.name || "Select a Project"}
              </h2>
              {/* Online/Offline Status with Refresh */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-800/50 border border-gray-700/50">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} ${isOnline ? 'animate-pulse' : ''}`}></div>
                  <span className={`text-xs font-medium ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                
                {/* Video Call Button */}
                <button
                  onClick={onStartVideoCall}
                  className="p-1.5 rounded-full bg-blue-900/20 hover:bg-blue-900/40 text-blue-400 transition-all cursor-pointer hover:scale-110"
                  title="Start video call"
                >
                  <IoVideocam size={14} />
                </button>

                {/* Refresh Button */}
                <button
                  onClick={handleReconnect}
                  disabled={isRefreshing}
                  className={`p-1.5 rounded-full transition-all ${
                    isOnline 
                      ? 'bg-green-900/20 hover:bg-green-900/40 text-green-400' 
                      : 'bg-red-900/20 hover:bg-red-900/40 text-red-400'
                  } ${isRefreshing ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
                  title={isOnline ? 'Refresh connection' : 'Reconnect'}
                >
                  <HiRefresh 
                    size={14} 
                    className={isRefreshing ? 'animate-spin' : ''}
                  />
                </button>
              </div>
            </div>
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
