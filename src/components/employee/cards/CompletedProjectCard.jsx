import React from 'react';
import { FiEye, FiCheckCircle, FiClock, FiStar } from 'react-icons/fi';
import { formatDate } from '../../atoms/FormatedDate';
import {
  COMPLETION_STATUS_CONFIG,
} from "../../../lib/badgeConfigs";
import Badge from "../../atoms/Badge";

// Status Tag Component
const CompletionStatusTag = ({ status }) => {
  const lowerStatus = status?.toLowerCase();
  const commonClasses = "px-2 py-0.5 text-xs font-semibold capitalize";
  if (lowerStatus === 'completed' || lowerStatus === 'submitted') {
   
    return (
      <Badge
        value={lowerStatus}
        configMap={COMPLETION_STATUS_CONFIG}
        defaultKey="default"
        className={commonClasses}
      />
    );
  }
  const dynamicLabel = status?.replace(/_/g, ' ') || 'Unknown';
  const defaultConfig = COMPLETION_STATUS_CONFIG.default;

  return (
    <Badge
      label={dynamicLabel}
      bg={defaultConfig.bg}
      text={defaultConfig.text}
      className={commonClasses}
    />
  );
};

// Rating Display Component
const RatingDisplay = ({ rating }) => {
  if (!rating) return null;
  
  return (
    <div className="flex items-center gap-1">
      <FiStar className="text-yellow-400 fill-current" size={14} />
      <span className="text-sm text-yellow-400 font-semibold">{rating}/5</span>
    </div>
  );
};

// --- Main Card Component ---
const CompletedProjectCard = ({ assignment, onViewDetails }) => {
  const { project, role, workStatus, assigner, completedAt, feedback, rating } = assignment;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 hover:border-green-500/50 transition-all duration-300 flex flex-col">
      
      <div className="p-5 border-b border-gray-700">
        <div className="mb-3">
          <CompletionStatusTag status={workStatus} />
        </div>
        
        {/* Title with Icon */}
        <div className="mb-3">
          <h3 
            className="text-xl font-bold text-white cursor-pointer hover:text-green-400 flex items-center gap-2 transition-colors"
            onClick={() => onViewDetails(assignment)}
          >
            <FiCheckCircle className="text-green-400 flex-shrink-0" size={22} />
            <span className="line-clamp-2">{project?.name || 'Unnamed Project'}</span>
          </h3>
        </div>
        
        {/* Role and Rating */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-purple-300 bg-purple-600/20 px-2 py-0.5 rounded-full">
            {role}
          </span>
          <RatingDisplay rating={rating} />
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-5 space-y-3 flex-grow">
        {/* Completion Date */}
        <div>
          <label className="text-xs text-gray-400 uppercase font-semibold">Completed On</label>
          <p className="text-sm text-gray-300 flex items-center gap-1.5">
            <FiClock size={14} />
            {completedAt ? formatDate(completedAt) : 'N/A'}
          </p>
        </div>

        {/* Assigned By */}
        <div>
          <label className="text-xs text-gray-400 uppercase font-semibold">Assigned By</label>
          <p className="text-sm text-gray-300">{assigner?.fullName || assigner?.email || 'Unknown'}</p>
        </div>

        {/* Feedback (if available) */}
        {feedback && (
          <div>
            <label className="text-xs text-gray-400 uppercase font-semibold">Manager Feedback</label>
            <p className="text-sm text-green-300 italic">"{feedback}"</p>
          </div>
        )}

        {/* Project Description (truncated) */}
        {project?.description && (
          <div>
            <label className="text-xs text-gray-400 uppercase font-semibold">Description</label>
            <p className="text-sm text-gray-300 line-clamp-2">{project.description}</p>
          </div>
        )}
      </div>
      
      {/* Card Footer with Actions */}
      <div className="p-4 bg-gray-800/50 border-t border-gray-700">
        <button
          onClick={() => onViewDetails(assignment)}
          className="w-full flex justify-center items-center gap-2 bg-green-600/20 text-green-300 font-semibold py-2 px-4 rounded-md hover:bg-green-600/30 transition-colors border border-green-600/30"
        >
          <FiEye />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};

// --- Skeleton Loading Component ---
export const CompletedProjectCardSkeleton = () => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 animate-pulse flex flex-col">
      <div className="p-5 border-b border-gray-700">
        {/* Status Tag */}
        <div className="mb-3">
          <div className="h-5 bg-gray-700 rounded-full w-24"></div>
        </div>
        {/* Title */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-700 rounded-full flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-700 rounded w-full"></div>
              <div className="h-5 bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
        {/* Role and Rating */}
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-700 rounded-full w-28"></div>
          <div className="h-4 bg-gray-700 rounded w-12"></div>
        </div>
      </div>
      <div className="p-5 space-y-3 flex-grow">
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
      </div>
      <div className="p-4 bg-gray-800/50 border-t border-gray-700">
        <div className="h-10 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export default CompletedProjectCard;
