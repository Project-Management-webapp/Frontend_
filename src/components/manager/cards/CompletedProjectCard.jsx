import React from 'react';
import { FiEye, FiCheckCircle, FiCalendar, FiDollarSign, FiUsers, FiAlertCircle } from 'react-icons/fi';
import { formatDate } from '../../atoms/FormatedDate';
import Badge from "../../atoms/Badge";
import { PROJECT_STATUS_CONFIG, PRIORITY_CONFIG } from "../../../lib/badgeConfigs";

// Status Tag Component
const StatusTag = ({ status }) => {
  return (
    <Badge
      value={status?.toLowerCase() || 'unknown'}
      configMap={PROJECT_STATUS_CONFIG}
      defaultKey="default"
      className="px-2 py-0.5 text-xs font-semibold capitalize"
    />
  );
};

// Priority Tag Component
const PriorityTag = ({ priority }) => {
  return (
    <Badge
      value={priority?.toLowerCase() || 'medium'}
      configMap={PRIORITY_CONFIG}
      defaultKey="medium"
      className="px-2 py-0.5 text-xs font-semibold capitalize"
    />
  );
};

// --- Main Card Component ---
const CompletedProjectCard = ({ project, onViewDetails }) => {
  const {
    name,
    description,
    status,
    priority,
    budget,
    currency,
    deadline,
    actualEndDate,
    createdAt,
    teamSize,
    assignments = [],
    milestones = [],
    risks = [],
    issues = []
  } = project;

  // Parse milestones if it's a string
  const parsedMilestones = typeof milestones === 'string' 
    ? JSON.parse(milestones) 
    : Array.isArray(milestones) ? milestones : [];

  // Parse risks if it's a string
  const parsedRisks = typeof risks === 'string' 
    ? JSON.parse(risks) 
    : Array.isArray(risks) ? risks : [];

  // Parse issues if it's a string
  const parsedIssues = typeof issues === 'string' 
    ? JSON.parse(issues) 
    : Array.isArray(issues) ? issues : [];

  // Calculate completed milestones
  const completedMilestones = parsedMilestones.filter(m => m.status === 'completed').length;
  const totalMilestones = parsedMilestones.length;

  // Count open issues and risks
  const openIssues = parsedIssues.filter(i => i.status !== 'resolved').length;
  const openRisks = parsedRisks.filter(r => r.status === 'open').length;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 hover:border-green-500/50 transition-all duration-300 flex flex-col">
      
      {/* Header */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-start justify-between gap-2 mb-3">
          <StatusTag status={status} />
          <PriorityTag priority={priority} />
        </div>
        
        {/* Title */}
        <div className="mb-3">
          <h3 
            className="text-xl font-bold text-white cursor-pointer hover:text-green-400 flex items-center gap-2 transition-colors"
            onClick={() => onViewDetails(project)}
          >
            <FiCheckCircle className="text-green-400 flex-shrink-0" size={22} />
            <span className="line-clamp-2">{name || 'Unnamed Project'}</span>
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
          {description || 'No description available'}
        </p>
      </div>

      {/* Project Stats */}
      <div className="p-5 space-y-3 flex-1">
        {/* Budget */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 flex items-center gap-2">
            <FiDollarSign size={16} className="text-green-400" />
            Budget
          </span>
          <span className="text-white font-semibold">
            {currency} {parseFloat(budget || 0).toLocaleString()}
          </span>
        </div>

        {/* Team Size */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 flex items-center gap-2">
            <FiUsers size={16} className="text-blue-400" />
            Team Size
          </span>
          <span className="text-white font-semibold">
            {assignments.length || teamSize || 0} members
          </span>
        </div>

        {/* Milestones Progress */}
        {totalMilestones > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-2">
              <FiCheckCircle size={16} className="text-purple-400" />
              Milestones
            </span>
            <span className="text-white font-semibold">
              {completedMilestones}/{totalMilestones}
            </span>
          </div>
        )}

        {/* Deadline */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 flex items-center gap-2">
            <FiCalendar size={16} className="text-yellow-400" />
            {actualEndDate ? 'Completed On' : 'Deadline'}
          </span>
          <span className="text-white font-semibold">
            {formatDate(actualEndDate || deadline)}
          </span>
        </div>

        {/* Issues & Risks Alert */}
        {(openIssues > 0 || openRisks > 0) && (
          <div className="flex items-center gap-2 text-sm bg-red-500/10 border border-red-500/30 rounded px-2 py-1">
            <FiAlertCircle size={16} className="text-red-400" />
            <span className="text-red-400">
              {openIssues > 0 && `${openIssues} open issue${openIssues > 1 ? 's' : ''}`}
              {openIssues > 0 && openRisks > 0 && ', '}
              {openRisks > 0 && `${openRisks} risk${openRisks > 1 ? 's' : ''}`}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-900/50 border-t border-gray-700">
        <button
          onClick={() => onViewDetails(project)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
        >
          <FiEye size={18} />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};

// Skeleton Component
export const CompletedProjectCardSkeleton = () => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 animate-pulse flex flex-col">
      <div className="p-5 border-b border-gray-700">
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-20 bg-gray-700 rounded"></div>
          <div className="h-6 w-16 bg-gray-700 rounded"></div>
        </div>
        <div className="h-7 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
      <div className="p-5 space-y-3 flex-1">
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded"></div>
      </div>
      <div className="p-4 bg-gray-900/50 border-t border-gray-700">
        <div className="h-10 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export default CompletedProjectCard;
