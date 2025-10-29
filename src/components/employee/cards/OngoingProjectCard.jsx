import React from 'react';
import { FiEye, FiClock } from 'react-icons/fi';
import { formatDate } from '../../atoms/FormatedDate';
import Badge  from "../../atoms/Badge";
import { WORK_STATUS_COLOR_CONFIG } from "../../../lib/badgeConfigs"

const WorkStatusTag = ({ status }) => {
  return (
    <Badge
      value={status} 
      configMap={WORK_STATUS_COLOR_CONFIG} 
      defaultKey="default"
      className="px-2 py-0.5 text-xs font-semibold capitalize"
    />
  );
};


// --- Main Card Component (Updated) ---
const OngoingProjectCard = ({ assignment, onViewDetails }) => {
  const { project, role, workStatus, assigner } = assignment;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-300 flex flex-col">
      
      {/* Card Header */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <h3 
            className="text-xl font-bold text-white truncate cursor-pointer hover:underline"
            onClick={() => onViewDetails(assignment)} 
          >
            {project.name}
          </h3>
          <WorkStatusTag status={workStatus} />
        </div>
        <span className="text-sm font-semibold text-purple-300 bg-purple-600/20 px-2 py-0.5 rounded-full">
          {role}
        </span>
      </div>
      
      {/* Card Body */}
      <div className="p-5 space-y-3 flex-grow">
        <div>
          <label className="text-xs text-gray-400 uppercase font-semibold">Project Deadline</label>
          <p className="text-sm text-gray-300 flex items-center gap-1.5">
            <FiClock size={14} />
            {formatDate(project.deadline)}
          </p>
        </div>
        <div>
          <label className="text-xs text-gray-400 uppercase font-semibold">Assigned By</label>
          <p className="text-sm text-gray-300">{assigner.fullName || assigner.email}</p>
        </div>
      </div>
      
     
      <div className="p-4 bg-gray-800/50 border-t border-gray-700 flex">
        <button
          onClick={() => onViewDetails(assignment)}
          className="flex-1 w-full flex justify-center items-center gap-2 bg-gray-600/50 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
        >
          <FiEye />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};

// --- Skeleton Component (Unchanged) ---
export const OngoingProjectCardSkeleton = ({ key }) => {
  return (
    <div key={key} className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 flex flex-col animate-pulse">
      {/* Skeleton Header */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <div className="h-6 bg-gray-700 rounded-md w-3/4"></div>
          <div className="h-5 bg-gray-700 rounded-full w-20"></div>
        </div>
        <div className="h-5 bg-gray-700 rounded-full w-1/3 mt-2"></div>
      </div>

      {/* Skeleton Body */}
      <div className="p-5 space-y-4 flex-grow">
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded-md w-1/2"></div>
          <div className="h-5 bg-gray-700 rounded-md w-2/3"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded-md w-1/2"></div>
          <div className="h-5 bg-gray-700 rounded-md w-3/4"></div>
        </div>
      </div>

      {/* Skeleton Footer */}
      <div className="p-4 bg-gray-800/50 border-t border-gray-700 flex gap-3">
        <div className="h-10 bg-gray-700 rounded-md flex-1"></div>
      </div>
    </div>
  );
};

export default OngoingProjectCard;