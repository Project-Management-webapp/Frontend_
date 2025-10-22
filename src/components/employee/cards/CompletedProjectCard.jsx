import React from 'react';
import { FiEye, FiCheckCircle, FiClock, FiStar } from 'react-icons/fi';
import { formatDate } from '../../atoms/FormatedDate';

// Status Tag Component
const CompletionStatusTag = ({ status }) => {
  let bgColor, textColor, label;
  
  switch (status) {
    case 'completed':
      bgColor = 'bg-green-600/20';
      textColor = 'text-green-300';
      label = 'Verified';
      break;
    case 'submitted':
      bgColor = 'bg-yellow-600/20';
      textColor = 'text-yellow-300';
      label = 'Under Review';
      break;
    default:
      bgColor = 'bg-gray-600/20';
      textColor = 'text-gray-300';
      label = status?.replace(/_/g, ' ') || 'Unknown';
  }

  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${bgColor} ${textColor}`}>
      {label}
    </span>
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
      
      {/* Card Header */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <h3 
            className="text-xl font-bold text-white truncate cursor-pointer hover:underline flex items-center gap-2"
            onClick={() => onViewDetails(assignment)}
          >
            <FiCheckCircle className="text-green-400" size={20} />
            {project?.name || 'Unnamed Project'}
          </h3>
          <CompletionStatusTag status={workStatus} />
        </div>
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
        <div className="flex justify-between items-center mb-2">
          <div className="h-6 bg-gray-700 rounded w-2/3"></div>
          <div className="h-5 bg-gray-700 rounded w-16"></div>
        </div>
        <div className="h-5 bg-gray-700 rounded w-24 mt-2"></div>
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
