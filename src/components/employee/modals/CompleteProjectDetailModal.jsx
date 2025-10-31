import React from 'react';
import {
  IoClose, 
  IoPersonOutline,
  IoCheckmarkDoneCircleOutline,
  IoStarOutline,
  IoCodeSlashOutline,
  IoCalendarOutline,
  IoCashOutline,
  IoDocumentTextOutline,
  IoTimeOutline,
  IoBusinessOutline,
} from 'react-icons/io5';
import { formatDate } from '../../atoms/FormatedDate'; 
import { FiUserCheck, FiDollarSign } from 'react-icons/fi';
import Badge from "../../atoms/Badge";
import { PRIORITY_CONFIG, PROJECT_STATUS_CONFIG } from "../../../lib/badgeConfigs";

const DetailRow = ({ label, value, isTag = false, isDate = false, isCode = false }) => {
  if (!value && typeof value !== 'number') return null; 

  let displayValue;
  if (isDate) {
    displayValue = <span className="text-gray-200">{formatDate(value)}</span>;
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
  } else if (isCode) {
    // For displaying notes or deliverables
    displayValue = (
      <pre className="text-gray-200 bg-gray-900/50 p-3 rounded-md border border-gray-700 whitespace-pre-wrap font-sans text-sm">
        {value}
      </pre>
    );
  } else {
    displayValue = <span className="text-gray-200 break-words">{value}</span>;
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

// --- Re-usable DetailSection ---
const DetailSection = ({ title, icon, children }) => (
  <div className="pt-4 first:pt-0">
    <h3 className="text-lg font-semibold text-green-300 flex items-center gap-2 mb-3 border-b border-gray-700 pb-2">
      {icon}
      <span>{title}</span>
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
      {children}
    </div>
  </div>
);

// --- Main Modal Component ---
const CompleteProjectDetailModal = ({ assignment, onClose }) => {
  if (!assignment) return null;

  const {
    project,
    assigner,
    verifier,
    role,
    allocatedAmount,
    currency,
    paymentSchedule,
    paymentTerms,
    workStatus,
    assignedDate,
    workStartedAt,
    workSubmittedAt,
    workVerifiedAt,
    verificationNotes,
    performanceFeedback,
    deliverables,
    actualDeliverables,
    responsibilities,
    estimatedHours,
    actualHours,
    estimatedMaterials,
    actualMaterials,
    estimatedConsumables,
    actualConsumables,
    notes,
    createdAt,
    updatedAt,
    workVerifiedBy,
  } = assignment;

  const handleModalContentClick = (e) => e.stopPropagation();

  const parseJsonArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [data]; 
      } catch {
        return [data]; 
      }
    }
    return [];
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
          <div className="flex items-center gap-3 mb-2">
            {project?.status && (
              <Badge
                value={project.status.toLowerCase()}
                configMap={PROJECT_STATUS_CONFIG}
                defaultKey="default"
                className="px-3 py-1 text-sm font-semibold capitalize"
              />
            )}
            {project?.priority && (
              <Badge
                value={project.priority.toLowerCase()}
                configMap={PRIORITY_CONFIG}
                defaultKey="medium"
                className="px-3 py-1 text-sm font-semibold capitalize"
              />
            )}
          </div>
          <h2 className="text-2xl font-bold text-green-300">{project?.name || 'Completed Project'}</h2>
          <p className="text-gray-400 mt-1">{project?.description}</p>
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-6 right-6 text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          
          {/* Your Assignment */}
          <DetailSection title="Your Assignment" icon={<IoPersonOutline size={22} />}>
            <DetailRow label="Your Role" value={role} isTag />
            <DetailRow label="Work Status" value={workStatus} isTag />
            <DetailRow label="Assigned Date" value={assignedDate} isDate />
            <DetailRow label="Assigned By" value={assigner?.fullName || assigner?.email} />
          </DetailSection>

          {/* Project Details */}
          <DetailSection title="Project Details" icon={<IoBusinessOutline size={22} />}>
            <DetailRow label="Project Status" value={project?.status} isTag />
            <DetailRow label="Priority" value={project?.priority} isTag />
            <DetailRow label="Budget" value={project?.budget ? `USD ${parseFloat(project.budget).toLocaleString()}` : null} />
            <DetailRow label="Deadline" value={project?.deadline} isDate />
          </DetailSection>

          {/* Payment Information */}
          <DetailSection title="Payment Information" icon={<FiDollarSign size={22} />}>
            <DetailRow label="Allocated Amount" value={`${currency || 'USD'} ${parseFloat(allocatedAmount || 0).toLocaleString()}`} />
            <DetailRow label="Currency" value={currency} />
            <DetailRow label="Payment Schedule" value={paymentSchedule} isTag />
            <div className="md:col-span-2">
              <DetailRow label="Payment Terms" value={paymentTerms} />
            </div>
          </DetailSection>

          {/* Hours Tracking */}
          <DetailSection title="Hours & Timeline" icon={<IoTimeOutline size={22} />}>
            <DetailRow label="Estimated Hours" value={estimatedHours && parseFloat(estimatedHours) > 0 ? `${estimatedHours} hours` : 'Not set'} />
            <DetailRow label="Actual Hours" value={actualHours && parseFloat(actualHours) > 0 ? `${actualHours} hours` : 'Not tracked'} />
            <DetailRow label="Work Started At" value={workStartedAt} isDate />
            <DetailRow label="Work Submitted At" value={workSubmittedAt} isDate />
            <DetailRow label="Created At" value={createdAt} isDate />
            <DetailRow label="Last Updated" value={updatedAt} isDate />
          </DetailSection>

          {/* Completion Details */}
          <DetailSection title="Completion Details" icon={<IoCheckmarkDoneCircleOutline size={22} />}>
            <DetailRow label="Submitted On" value={workSubmittedAt} isDate />
            <DetailRow label="Verified On" value={workVerifiedAt} isDate />
            <DetailRow label="Verified By" value={verifier?.fullName || verifier?.email || (workVerifiedBy ? `Manager ID: ${workVerifiedBy}` : null)} icon={<FiUserCheck />} />
          </DetailSection>

          {/* Feedback & Review */}
          {(performanceFeedback || verificationNotes) && (
            <DetailSection title="Feedback & Review" icon={<IoStarOutline size={22} />}>
              <div className="md:col-span-2">
                <DetailRow label="Performance Feedback" value={performanceFeedback} isCode />
              </div>
              <div className="md:col-span-2">
                <DetailRow label="Manager's Verification Notes" value={verificationNotes} isCode />
              </div>
            </DetailSection>
          )}

          {/* Responsibilities & Deliverables */}
          <DetailSection title="Responsibilities & Deliverables" icon={<IoCodeSlashOutline size={22} />}>
            <div className="md:col-span-2">
              <DetailRow label="Your Responsibilities" value={parseJsonArray(responsibilities)} />
            </div>
            <div className="md:col-span-2">
              <DetailRow label="Expected Deliverables" value={parseJsonArray(deliverables)} />
            </div>
            <div className="md:col-span-2">
              <DetailRow label="Actual Deliverables" value={parseJsonArray(actualDeliverables)} />
            </div>
          </DetailSection>

          {/* Materials & Consumables */}
          {(estimatedMaterials || actualMaterials || estimatedConsumables || actualConsumables) && (
            <DetailSection title="Materials & Consumables" icon={<IoDocumentTextOutline size={22} />}>
              <div className="md:col-span-2">
                <DetailRow label="Estimated Materials" value={parseJsonArray(estimatedMaterials)} />
              </div>
              <div className="md:col-span-2">
                <DetailRow label="Actual Materials" value={parseJsonArray(actualMaterials)} />
              </div>
              <div className="md:col-span-2">
                <DetailRow label="Estimated Consumables" value={parseJsonArray(estimatedConsumables)} />
              </div>
              <div className="md:col-span-2">
                <DetailRow label="Actual Consumables" value={parseJsonArray(actualConsumables)} />
              </div>
            </DetailSection>
          )}

          {/* Additional Notes */}
          {notes && (
            <DetailSection title="Additional Notes" icon={<IoDocumentTextOutline size={22} />}>
              <div className="md:col-span-2">
                <DetailRow label="Notes" value={notes} isCode />
              </div>
            </DetailSection>
          )}

          {/* Assigner Details */}
          {assigner && (
            <DetailSection title="Assigned By" icon={<IoPersonOutline size={22} />}>
              <div className="md:col-span-2 flex items-center gap-4">
                {assigner.profileImage && (
                  <img 
                    src={assigner.profileImage} 
                    alt={assigner.fullName || assigner.email}
                    className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
                  />
                )}
                <div>
                  <DetailRow label="Name" value={assigner.fullName || 'N/A'} />
                  <DetailRow label="Email" value={assigner.email} />
                </div>
              </div>
            </DetailSection>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-700 bg-gray-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteProjectDetailModal;