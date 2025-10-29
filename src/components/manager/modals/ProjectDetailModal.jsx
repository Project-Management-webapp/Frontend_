import React from 'react';
import {
  IoChatbubblesOutline,
  IoBusinessOutline,
  IoCalendarOutline,
  IoWalletOutline,
  IoPeopleOutline,
  IoFlagOutline,
  IoInformationCircleOutline,
  IoCalendarClearOutline,
  IoWarningOutline,
  IoAlertCircleOutline,
  IoDocumentTextOutline,
} from 'react-icons/io5';
import { formatDate } from '../../atoms/FormatedDate';
import { Link } from 'react-router-dom';

const DetailRow = ({ label, value, isTag = false, isDate = false }) => {
  // Allow 0 and other falsy numbers, but skip null, undefined, and empty strings
  if (value === null || value === undefined || value === '') return null;

  let displayValue;

  if (isDate) {
    displayValue = (
      <span className="text-gray-200 flex items-center gap-1.5">
        <IoCalendarClearOutline className="text-gray-400" size={14} />
        {formatDate(value)}
      </span>
    );
  } else if (isTag) {
    displayValue = (
      <span className="capitalize px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
        {value.replace(/_/g, ' ')}
      </span>
    );
  } else if (Array.isArray(value)) {
    displayValue = (
      <div className="flex flex-wrap gap-2 mt-1">
        {value.map((item, index) => (
          <span key={index} className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-md text-sm">
            {item}
          </span>
        ))}
      </div>
    );
  } else if (typeof value === 'object' && value !== null) {
    displayValue = (
      <div className="flex flex-col mt-1 gap-1">
        {Object.entries(value).map(([k, v], i) => (
          <span key={i} className="text-gray-300 text-sm">
            <strong className="text-gray-400">{k.replace(/_/g, ' ')}:</strong> {v ?? 'N/A'}
          </span>
        ))}
      </div>
    );
  } else {
    displayValue = <span className="text-gray-200">{value}</span>;
  }

  return (
    <div className="py-2">
      <strong className="text-sm font-medium text-gray-400 block mb-0.5 uppercase tracking-wide">
        {label}
      </strong>
      {displayValue}
    </div>
  );
};

// --- New Section Component ---
// Helper to group fields with an icon and title
const DetailSection = ({ title, icon, children, grid = true }) => (
  <div className="pt-4 first:pt-0">
    <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2 mb-3 border-b border-gray-700 pb-2">
      {icon}
      <span>{title}</span>
    </h3>
    {/* Conditionally apply grid or stack for list items */}
    {grid ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {children}
      </div>
    ) : (
      <div className="space-y-4">{children}</div>
    )}
  </div>
);

// --- Main Modal Component ---
const ProjectDetailsModal = ({ project, onClose }) => {
  const handleModalContentClick = (e) => e.stopPropagation();

  // Parse JSON strings for risks, issues, milestones, and referenceLinks
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

  const risks = parseJSON(project.risks);
  const issues = parseJSON(project.issues);
  const milestones = parseJSON(project.milestones);
  const referenceLinks = parseJSON(project.referenceLinks);

  // Logic remains the same
  const budget = parseFloat(project.budget) || 0;
  const allocatedAmount = parseFloat(project.allocatedAmount) || 0;
  const spentAmount = parseFloat(project.spentAmount) || 0;

  const parseResponsibilities = (respStr) => {
    try {
      const parsed = JSON.parse(respStr);
      return Array.isArray(parsed) ? parsed : [respStr];
    } catch {
      return respStr ? [respStr] : [];
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-3xl border border-white/20 max-h-[90vh] flex flex-col"
        onClick={handleModalContentClick}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-700">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-bold text-purple-300">{project.name}</h2>
              <p className="text-gray-400 mt-1">{project.description}</p>
            </div>

            <div className="flex-shrink-0">
              <Link
                to='/chat_manager'
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <IoChatbubblesOutline />
                <span>Chat</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Body (Refactored with Sections) */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">

          <DetailSection title="General Info" icon={<IoInformationCircleOutline size={22} />}>
            <DetailRow label="Status" value={project.status} isTag />
            <DetailRow label="Priority" value={project.priority} isTag />
            <DetailRow label="Project Type" value={project.projectType} isTag />
            <DetailRow label="Category" value={project.category} />
            <DetailRow label="Billing Type" value={project.billingType} isTag />
            <DetailRow label="Visibility" value={project.visibility} isTag />
            <DetailRow label="Created By" value={project.creator?.email} />
          </DetailSection>

          <DetailSection title="Timeline" icon={<IoCalendarOutline size={22} />}>
            <DetailRow label="Start Date" value={project.startDate} isDate />
            <DetailRow label="Actual Start Date" value={project.actualStartDate} isDate />
            <DetailRow label="Deadline" value={project.deadline} isDate />
            <DetailRow label="Actual End Date" value={project.actualEndDate} isDate />
            <DetailRow label="Estimated Hours" value={project.estimatedHours} />
            <DetailRow label="Actual Hours" value={project.actualHours} />
          </DetailSection>

          <DetailSection title="Finance" icon={<IoWalletOutline size={22} />}>
            <DetailRow label="Budget" value={`$${budget.toLocaleString()}`} />
            <DetailRow label="Allocated Amount" value={`$${allocatedAmount.toLocaleString()}`} />
            <DetailRow label="Spent Amount" value={`$${spentAmount.toLocaleString()}`} />
            <DetailRow label="Currency" value={project.currency} />
          </DetailSection>

          {/* Company Details */}
          <DetailSection title="Company Info" icon={<IoBusinessOutline size={22} />}>
            <DetailRow label="Company Name" value={project.companyName} />
            <DetailRow label="Company Email" value={project.companyEmail} />
            <DetailRow label="Company Phone" value={project.companyPhone} />
          </DetailSection>

          {/* Team Information */}
          <DetailSection title="Team Information" icon={<IoPeopleOutline size={22} />}>
            <DetailRow label="Team Size" value={project.teamSize} />
          </DetailSection>


          {/* Milestones */}
          {milestones?.length > 0 && (
            <DetailSection title="Project Milestones" icon={<IoFlagOutline size={22} />} grid={false}>
              {milestones.map((ms, idx) => (
                <div key={idx} className="p-4 border border-gray-700 rounded-lg bg-gray-900/50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-purple-300 font-semibold text-lg">{ms.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ms.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                      ms.status === 'in-progress' ? 'bg-blue-600/20 text-blue-400' :
                      'bg-yellow-600/20 text-yellow-400'
                    }`}>
                      {ms.status || 'pending'}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{ms.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <IoCalendarClearOutline size={14} />
                      Deadline: {formatDate(ms.deadline)}
                    </span>
                  </div>
                </div>
              ))}
            </DetailSection>
          )}

          {/* Risks */}
          {risks?.length > 0 && (
            <DetailSection title="Project Risks" icon={<IoWarningOutline size={22} />} grid={false}>
              {risks.map((risk, idx) => (
                <div key={idx} className="p-4 border border-orange-700/30 rounded-lg bg-orange-900/10">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-gray-200 flex-1">{risk.description}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                      risk.severity === 'high' ? 'bg-red-600/20 text-red-400' :
                      risk.severity === 'medium' ? 'bg-orange-600/20 text-orange-400' :
                      'bg-yellow-600/20 text-yellow-400'
                    }`}>
                      {risk.severity}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-gray-400">Status: </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        risk.status === 'closed' ? 'bg-green-600/20 text-green-400' :
                        risk.status === 'mitigated' ? 'bg-blue-600/20 text-blue-400' :
                        'bg-red-600/20 text-red-400'
                      }`}>
                        {risk.status}
                      </span>
                    </div>
                    {risk.mitigation && (
                      <div className="md:col-span-2">
                        <span className="text-gray-400">Mitigation: </span>
                        <span className="text-gray-300">{risk.mitigation}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </DetailSection>
          )}

          {/* Issues */}
          {issues?.length > 0 && (
            <DetailSection title="Project Issues" icon={<IoAlertCircleOutline size={22} />} grid={false}>
              {issues.map((issue, idx) => (
                <div key={idx} className="p-4 border border-red-700/30 rounded-lg bg-red-900/10">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-gray-200 flex-1">{issue.description}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                      issue.priority === 'high' ? 'bg-red-600/20 text-red-400' :
                      issue.priority === 'medium' ? 'bg-orange-600/20 text-orange-400' :
                      'bg-green-600/20 text-green-400'
                    }`}>
                      {issue.priority}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-gray-400">Status: </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        issue.status === 'resolved' ? 'bg-green-600/20 text-green-400' :
                        issue.status === 'in-progress' ? 'bg-blue-600/20 text-blue-400' :
                        'bg-yellow-600/20 text-yellow-400'
                      }`}>
                        {issue.status}
                      </span>
                    </div>
                    {issue.assignedTo && (
                      <div>
                        <span className="text-gray-400">Assigned To: </span>
                        <span className="text-gray-300">User ID: {issue.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </DetailSection>
          )}

          {/* Notes and Testing Status */}
          {(project.notes || project.testingStatus) && (
            <DetailSection title="Additional Information" icon={<IoDocumentTextOutline size={22} />}>
              {project.testingStatus && (
                <DetailRow label="Testing Status" value={project.testingStatus} isTag />
              )}
              {project.notes && (
                <div className="md:col-span-2">
                  <DetailRow label="Notes" value={project.notes} />
                </div>
              )}
            </DetailSection>
          )}

          {/* Assignments (List) */}
          {project.assignments?.length > 0 && (
            <DetailSection title="Team & Assignments" icon={<IoPeopleOutline size={22} />} grid={false}>
              {/* List for individual assignments */}
              <div className="space-y-4">
                {project.assignments.map((a, idx) => (
                  <div key={idx} className="border border-gray-700 rounded-lg overflow-hidden">
                    <div className="p-3 bg-gray-700/50">
                      <h4 className="text-purple-300 font-semibold">{a.role}</h4>
                      <span className="text-sm text-gray-300">{a.employee?.email}</span>
                    </div>
                    <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-x-6">
                      <DetailRow label="Work Status" value={a.workStatus} isTag />
                      <DetailRow label="Assigned Date" value={a.assignedDate} isDate />
                      <DetailRow
                        label="Allocated Amount"
                        value={`$${(parseFloat(a.allocatedAmount) || 0).toLocaleString()}`}
                      />
                      <DetailRow label="Payment Schedule" value={a.paymentSchedule} isTag />
                      <DetailRow label="Payment Terms" value={a.paymentTerms} />
                      <DetailRow label="Responsibilities" value={parseResponsibilities(a.responsibilities)} />
                    </div>
                  </div>
                ))}
              </div>
            </DetailSection>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="cancel-btn"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;