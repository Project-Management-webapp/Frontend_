import React from 'react';
import { IoMdClose } from 'react-icons/io';
import {
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiCheckCircle,
  FiAlertCircle,
  FiAlertTriangle,
  FiClock,
  FiTrendingUp,
  FiCode,
  FiInfo,
  FiExternalLink
} from 'react-icons/fi';
import { formatDate } from '../../atoms/FormatedDate';
import Badge from "../../atoms/Badge";
import { PROJECT_STATUS_CONFIG, PRIORITY_CONFIG } from "../../../lib/badgeConfigs";

const DetailRow = ({ label, value, icon, isArray = false, isDate = false }) => {
  if (!value && typeof value !== 'number') return null;

  let displayValue;
  if (isDate) {
    displayValue = <span className="text-gray-200">{formatDate(value)}</span>;
  } else if (isArray) {
    displayValue = (
      <div className="flex flex-wrap gap-2 mt-1">
        {value.map((item, index) => (
          <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded-md text-sm">
            {typeof item === 'string' ? item : JSON.stringify(item)}
          </span>
        ))}
      </div>
    );
  } else {
    displayValue = <span className="text-gray-200 break-words">{value}</span>;
  }

  return (
    <div className="p-0">
      <strong className="text-sm font-medium text-gray-400 flex items-center gap-2 mb-1 uppercase tracking-wide">
        {icon}
        {label}
      </strong>
      {displayValue}
    </div>
  );
};

const DetailSection = ({ title, icon, children }) => (
  <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
    <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2 p-4 border-b border-gray-700">
      {icon}
      <span>{title}</span>
    </h3>
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      {children}
    </div>
  </div>
);

const MilestoneItem = ({ milestone, index }) => {
  const statusColors = {
    completed: 'bg-green-500/20 border-green-500/50 text-green-300',
    in_progress: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
    pending: 'bg-gray-500/20 border-gray-500/50 text-gray-300',
  };

  const status = milestone.status?.toLowerCase() || 'pending';
  const colorClass = statusColors[status] || statusColors.pending;

  return (
    <div className={`p-3 rounded-lg border ${colorClass}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-semibold text-white">{milestone.name}</h4>
        {/* <span className="text-xs px-2 py-1 rounded capitalize bg-gray-900/50">
          {milestone.status?.replace(/_/g, ' ') || 'pending'}
        </span> */}
      </div>
      {milestone.description && (
        <p className="text-sm text-gray-400 mb-2">{milestone.description}</p>
      )}
      {milestone.deadline && (
        <p className="text-xs text-gray-500">
          Deadline: {formatDate(milestone.deadline)}
        </p>
      )}
    </div>
  );
};

const RiskItem = ({ risk, index }) => {
  const severityColors = {
    high: 'bg-red-500/20 border-red-500/50',
    medium: 'bg-yellow-500/20 border-yellow-500/50',
    low: 'bg-green-500/20 border-green-500/50',
  };

  const severity = risk.severity?.toLowerCase() || 'medium';
  const colorClass = severityColors[severity] || severityColors.medium;

  return (
    <div className={`p-3 rounded-lg border ${colorClass}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-white font-medium">{risk.description}</p>
        <span className="text-xs px-2 py-1 rounded capitalize bg-gray-900/50 text-white">
          {risk.severity || 'medium'}
        </span>
      </div>
      {risk.mitigation && (
        <p className="text-sm text-gray-400 mt-2">
          <strong>Mitigation:</strong> {risk.mitigation}
        </p>
      )}
      <p className="text-xs text-gray-500 mt-1 capitalize">
        Status: {risk.status?.replace(/_/g, ' ') || 'open'}
      </p>
    </div>
  );
};

const IssueItem = ({ issue, index }) => {
  const priorityColors = {
    high: 'bg-red-500/20 border-red-500/50',
    medium: 'bg-yellow-500/20 border-yellow-500/50',
    low: 'bg-green-500/20 border-green-500/50',
  };

  const priority = issue.priority?.toLowerCase() || 'medium';
  const colorClass = priorityColors[priority] || priorityColors.medium;

  return (
    <div className={`p-3 rounded-lg border ${colorClass}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-white font-medium">{issue.description}</p>
        <span className="text-xs px-2 py-1 rounded capitalize bg-gray-900/50 text-white">
          {issue.priority || 'medium'}
        </span>
      </div>
      {issue.assignedTo && (
        <p className="text-xs text-gray-500 mt-1">
          Assigned to: User ID {issue.assignedTo}
        </p>
      )}
      <p className="text-xs text-gray-500 mt-1 capitalize">
        Status: {issue.status?.replace(/_/g, ' ') || 'open'}
      </p>
    </div>
  );
};

const CompletedProjectDetailModal = ({ project, onClose }) => {
  if (!project) return null;

  // Parse JSON fields
  const parseJSON = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  const milestones = parseJSON(project.milestones);
  const risks = parseJSON(project.risks);
  const issues = parseJSON(project.issues);
  const referenceLinks = parseJSON(project.referenceLinks);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-start justify-between z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge
                value={project.status?.toLowerCase() || 'unknown'}
                configMap={PROJECT_STATUS_CONFIG}
                defaultKey="default"
                className="px-3 py-1 text-sm font-semibold capitalize"
              />
              <Badge
                value={project.priority?.toLowerCase() || 'medium'}
                configMap={PRIORITY_CONFIG}
                defaultKey="medium"
                className="px-3 py-1 text-sm font-semibold capitalize"
              />
            </div>
            <h2 className="text-3xl font-bold text-white">{project.name}</h2>
            <p className="text-gray-400 mt-2">{project.description}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
          >
            <IoMdClose size={28} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Project Overview */}
          <DetailSection title="Project Overview" icon={<FiInfo size={20} />}>
            <DetailRow label="Project Type" value={project.projectType || project.customProjectType} />
            <DetailRow label="Custom Type" value={project.customProjectType} />
            <DetailRow label="Company Name" value={project.companyName} />
            <DetailRow label="Company Email" value={project.companyEmail} />
            <DetailRow label="Company Phone" value={project.companyPhone} />
            <DetailRow label="Visibility" value={project.visibility} />
            <DetailRow label="Team Size" value={project.teamSize} />

          </DetailSection>

          {/* Financial Information */}
          <DetailSection title="Financial Information" icon={<FiDollarSign size={20} />}>
            <DetailRow label="Budget" value={`${project.currency || 'USD'} ${parseFloat(project.budget || 0).toLocaleString()}`} />
            <DetailRow label="Allocated Amount" value={`${project.currency || 'USD'} ${parseFloat(project.allocatedAmount || 0).toLocaleString()}`} />
            <DetailRow label="Spent Amount" value={`${project.currency || 'USD'} ${parseFloat(project.spentAmount || 0).toLocaleString()}`} />
            <DetailRow label="Rate per Hour" value={`${project.currency || 'USD'} ${parseFloat(project.rate || 0).toLocaleString()}`} />
            <DetailRow label="Billing Type" value={project.billingType?.replace(/_/g, ' ')} />
          </DetailSection>

          {/* Timeline */}
          <DetailSection title="Timeline" icon={<FiCalendar size={20} />}>
            <DetailRow label="Start Date" value={project.startDate} isDate />
            <DetailRow label="Deadline" value={project.deadline} isDate />
            <DetailRow label="Actual Start Date" value={project.actualStartDate} isDate />
            <DetailRow label="Actual End Date" value={project.actualEndDate} isDate />
            <DetailRow label="Created At" value={project.createdAt} isDate />
            <DetailRow label="Last Updated" value={project.updatedAt} isDate />
          </DetailSection>

          {/* Hours & Resources Tracking */}
          <DetailSection title="Estimated vs Actual Resources" icon={<FiClock size={20} />}>
            <DetailRow
              label="Estimated Hours"
              value={project.estimatedHours ? `${parseFloat(project.estimatedHours).toLocaleString()} hours` : 'Not set'}
            />
            <DetailRow
              label="Actual Hours"
              value={project.actualHours ? `${parseFloat(project.actualHours).toLocaleString()} hours` : '0 hours'}
            />
            <DetailRow
              label="Estimated Materials"
              value={project.estimatedMaterials ? `${project.currency || 'USD'} ${parseFloat(project.estimatedMaterials).toLocaleString()}` : 'Not set'}
            />
            <DetailRow
              label="Actual Materials"
              value={project.actualMaterials ? `${project.currency || 'USD'} ${parseFloat(project.actualMaterials).toLocaleString()}` : `${project.currency || 'USD'} 0`}
            />
            <DetailRow
              label="Estimated Consumables"
              value={project.estimatedConsumables ? `${project.currency || 'USD'} ${parseFloat(project.estimatedConsumables).toLocaleString()}` : 'Not set'}
            />
            <DetailRow
              label="Actual Consumables"
              value={project.actualConsumables ? `${project.currency || 'USD'} ${parseFloat(project.actualConsumables).toLocaleString()}` : `${project.currency || 'USD'} 0`}
            />
          </DetailSection>

          {/* Team Assignments */}
          {project.assignments && project.assignments.length > 0 && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2 p-4 border-b border-gray-700">
                <FiUsers size={20} />
                <span>Team Assignments ({project.assignments.length})</span>
              </h3>
              <div className="p-4 space-y-4">
                {project.assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {assignment.employee?.fullName || 'Unknown Employee'}
                        </h4>
                        <p className="text-sm text-gray-400">{assignment.employee?.email}</p>
                        <p className="text-sm text-purple-400 capitalize mt-1">{assignment.role || 'Team Member'}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${assignment.workStatus === 'submitted'
                          ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                          : assignment.workStatus === 'in_progress'
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                            : 'bg-gray-600/20 text-gray-400 border border-gray-500/30'
                        }`}>
                        {assignment.workStatus?.replace(/_/g, ' ').toUpperCase() || 'NOT STARTED'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 uppercase text-xs mb-1">Financial</p>
                        <p className="text-gray-300">Allocated: <span className="text-green-400 font-semibold">{assignment.currency || 'USD'} {parseFloat(assignment.allocatedAmount || 0).toLocaleString()}</span></p>
                        <p className="text-gray-300">Rate: <span className="text-purple-400 font-semibold">{assignment.currency || 'USD'} {parseFloat(assignment.rate || 0).toLocaleString()}/hr</span></p>
                        <p className="text-gray-300">Payment: <span className="capitalize">{assignment.paymentSchedule?.replace(/_/g, ' ') || 'N/A'}</span></p>
                      </div>

                      <div>
                        <p className="text-gray-500 uppercase text-xs mb-1">Hours</p>
                        <p className="text-gray-300">Estimated: <span className="text-blue-400 font-semibold">{parseFloat(assignment.estimatedHours || 0).toLocaleString()} hrs</span></p>
                        <p className="text-gray-300">Actual: <span className="text-green-400 font-semibold">{parseFloat(assignment.actualHours || 0).toLocaleString()} hrs</span></p>
                      </div>

                      <div>
                        <p className="text-gray-500 uppercase text-xs mb-1">Materials</p>
                        <p className="text-gray-300">Estimated: <span className="text-blue-400 font-semibold">{assignment.currency || 'USD'} {parseFloat(assignment.estimatedMaterials || 0).toLocaleString()}</span></p>
                        <p className="text-gray-300">Actual: <span className="text-green-400 font-semibold">{assignment.currency || 'USD'} {parseFloat(assignment.actualMaterials || 0).toLocaleString()}</span></p>
                      </div>

                      <div>
                        <p className="text-gray-500 uppercase text-xs mb-1">Consumables</p>
                        <p className="text-gray-300">Estimated: <span className="text-blue-400 font-semibold">{assignment.currency || 'USD'} {parseFloat(assignment.estimatedConsumables || 0).toLocaleString()}</span></p>
                        <p className="text-gray-300">Actual: <span className="text-green-400 font-semibold">{assignment.currency || 'USD'} {parseFloat(assignment.actualConsumables || 0).toLocaleString()}</span></p>
                      </div>
                    </div>

                    {assignment.responsibilities && assignment.responsibilities.length > 0 && (
                      <div className="mt-3">
                        <p className="text-gray-500 uppercase text-xs mb-1">Responsibilities</p>
                        <div className="flex flex-wrap gap-2">
                          {assignment.responsibilities.map((resp, idx) => (
                            <span key={idx} className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs">
                              {resp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {assignment.deliverables && assignment.deliverables.length > 0 && (
                      <div className="mt-3">
                        <p className="text-gray-500 uppercase text-xs mb-1">Deliverables</p>
                        <div className="flex flex-wrap gap-2">
                          {assignment.deliverables.map((deliv, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs">
                              {deliv}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {assignment.paymentTerms && (
                      <div className="mt-3">
                        <p className="text-gray-500 uppercase text-xs mb-1">Payment Terms</p>
                        <p className="text-gray-300 text-sm">{assignment.paymentTerms}</p>
                      </div>
                    )}

                    {assignment.notes && (
                      <div className="mt-3">
                        <p className="text-gray-500 uppercase text-xs mb-1">Notes</p>
                        <p className="text-gray-300 text-sm">{assignment.notes}</p>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-gray-700 grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <p>Assigned: {formatDate(assignment.assignedDate)}</p>
                      {assignment.workSubmittedAt && (
                        <p>Submitted: {formatDate(assignment.workSubmittedAt)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Milestones */}
          {milestones.length > 0 && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2 p-4 border-b border-gray-700">
                <FiCheckCircle size={20} />
                <span>Milestones ({milestones.length})</span>
              </h3>
              <div className="p-4 space-y-3">
                {milestones.map((milestone, index) => (
                  <MilestoneItem key={index} milestone={milestone} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Risks */}
          {risks.length > 0 && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2 p-4 border-b border-gray-700">
                <FiAlertTriangle size={20} />
                <span>Risks ({risks.length})</span>
              </h3>
              <div className="p-4 space-y-3">
                {risks.map((risk, index) => (
                  <RiskItem key={index} risk={risk} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Issues */}
          {issues.length > 0 && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2 p-4 border-b border-gray-700">
                <FiAlertCircle size={20} />
                <span>Issues ({issues.length})</span>
              </h3>
              <div className="p-4 space-y-3">
                {issues.map((issue, index) => (
                  <IssueItem key={index} issue={issue} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {(project.notes || referenceLinks.length > 0) && (
            <DetailSection title="Additional Information" icon={<FiInfo size={20} />}>
              {project.notes && (
                <div className="md:col-span-2">
                  <DetailRow label="Notes" value={project.notes} />
                </div>
              )}
              {referenceLinks.length > 0 && (
                <div className="md:col-span-2">
                  <div className="p-0">
                    <strong className="text-sm font-medium text-gray-400 flex items-center gap-2 mb-2 uppercase tracking-wide">
                      <FiExternalLink size={16} />
                      Reference Links
                    </strong>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {referenceLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url?.startsWith('http') ? link.url : `https://${link.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group px-4 py-2.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 hover:border-purple-400/50 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md hover:shadow-purple-500/20"
                        >
                          <span className="text-purple-300 group-hover:text-purple-200">
                            {link.title || 'Link'}
                          </span>
                          <FiExternalLink size={14} className="text-purple-400 group-hover:text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </DetailSection>
          )}

          {/* Creator Information */}
          {project.creator && (
            <DetailSection title="Created By" icon={<FiUsers size={20} />}>
              <DetailRow label="Name" value={project.creator.fullName || 'N/A'} />
              <DetailRow label="Email" value={project.creator.email} />
              <DetailRow label="Role" value={project.creator.role} />
            </DetailSection>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletedProjectDetailModal;
