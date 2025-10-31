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
  
  // Always use Badge component with proper props
  return (
    <Badge
      value={lowerStatus || 'unknown'}
      configMap={COMPLETION_STATUS_CONFIG}
      defaultKey="default"
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
  const { project, role, workStatus, assigner, workSubmittedAt, feedback, rating } = assignment;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700 hover:border-green-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      
      <div className="p-6 border-b border-gray-700">
        <div className="mb-4">
          <CompletionStatusTag status={workStatus} />
        </div>
        
        {/* Title with Icon */}
        <div className="mb-4">
          <h3 
            className="text-xl font-bold text-white cursor-pointer hover:text-green-400 flex items-center gap-2 transition-colors group"
            onClick={() => onViewDetails(assignment)}
          >
            <FiCheckCircle className="text-green-400 flex-shrink-0 group-hover:scale-110 transition-transform" size={24} />
            <span className="line-clamp-2">{project?.name || 'Unnamed Project'}</span>
          </h3>
        </div>
        
        {/* Role and Rating */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-purple-300 bg-purple-600/20 px-3 py-1 rounded-full border border-purple-500/30">
            {role}
          </span>
          <RatingDisplay rating={rating} />
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-6 space-y-4 flex-grow">
        {/* Completion Date */}
        <div>
          <label className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1 block">Completed On</label>
          <p className="text-sm text-gray-200 flex items-center gap-2">
            <FiClock size={16} className="text-green-400" />
            {workSubmittedAt ? formatDate(workSubmittedAt) : 'N/A'}
          </p>
        </div>

        {/* Assigned By */}
        <div>
          <label className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1 block">Assigned By</label>
          <p className="text-sm text-gray-200 font-medium">{assigner?.fullName || assigner?.email || 'Unknown'}</p>
        </div>

        {/* Feedback (if available) */}
        {feedback && (
          <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
            <label className="text-xs text-green-400 uppercase font-semibold tracking-wider mb-1 block">Manager Feedback</label>
            <p className="text-sm text-green-200 italic line-clamp-2">"{feedback}"</p>
          </div>
        )}

        {/* Project Description (truncated) */}
        {project?.description && (
          <div>
            <label className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1 block">Description</label>
            <p className="text-sm text-gray-300 line-clamp-2">{project.description}</p>
          </div>
        )}
      </div>
      
      {/* Card Footer with Actions */}
      <div className="p-5 bg-gray-900/50 border-t border-gray-700">
        <button
          onClick={() => onViewDetails(assignment)}
          className="w-full flex justify-center items-center gap-2 bg-green-600/20 text-green-300 font-semibold py-2.5 px-4 rounded-lg hover:bg-green-600/30 transition-all border border-green-600/40 hover:border-green-500/60 hover:shadow-lg hover:shadow-green-900/20"
        >
          <FiEye size={18} />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};

// --- Skeleton Loading Component ---
export const CompletedProjectCardSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700 animate-pulse flex flex-col">
      <div className="p-6 border-b border-gray-700">
        {/* Status Tag */}
        <div className="mb-4">
          <div className="h-6 bg-gray-700 rounded-full w-28"></div>
        </div>
        {/* Title */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-700 rounded-full flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-700 rounded w-full"></div>
              <div className="h-6 bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
        {/* Role and Rating */}
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-700 rounded-full w-32"></div>
          <div className="h-5 bg-gray-700 rounded w-14"></div>
        </div>
      </div>
      <div className="p-6 space-y-4 flex-grow">
        <div className="space-y-2">
          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>
      </div>
      <div className="p-5 bg-gray-900/50 border-t border-gray-700">
        <div className="h-10 bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );
};

export default CompletedProjectCard;
