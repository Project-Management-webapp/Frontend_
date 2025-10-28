import React from "react";
import { FaBars } from "react-icons/fa";

const ChatHeader = ({ selectedProject, setIsSidebarOpen }) => {
  return (
    <div className="p-4 border-b border-gray-700 flex-shrink-0 bg-gray-800 flex items-center">
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden mr-4 text-gray-400 hover:text-white"
      >
        <FaBars size={20} />
      </button>
      <div className="flex-1">
        <h2 className="text-xl font-bold">
          {selectedProject?.name || "Select a Project"}
        </h2>
      </div>
    </div>
  );
};

export default ChatHeader;
