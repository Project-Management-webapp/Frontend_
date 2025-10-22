import React from 'react';
import {
  IoClose,
 
  IoPersonOutline,
  IoDocumentTextOutline,
  IoCheckmarkDoneCircleOutline,
  IoStarOutline,
 
  IoCodeSlashOutline,
} from 'react-icons/io5';
import { formatDate } from '../../atoms/FormatedDate'; // Assuming path
import { FiUserCheck } from 'react-icons/fi';

// --- Re-usable DetailRow ---
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
    workStatus,
    workSubmittedAt,
    workSubmissionNotes,
    workVerifiedAt,
    verificationNotes,
    performanceFeedback,
    deliverables,
    actualDeliverables,
    responsibilities,
  } = assignment;

  const handleModalContentClick = (e) => e.stopPropagation();

  const parseJsonArray = (str) => {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [str]; // Fallback if it's just a string
    } catch {
      return str ? [str] : []; // Fallback for plain strings or empty
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
          
          <DetailSection title="Your Assignment" icon={<IoPersonOutline size={22} />}>
            <DetailRow label="Your Role" value={role} isTag />
            <DetailRow label="Work Status" value={workStatus} isTag />
            <DetailRow label="Allocated Amount" value={`$${parseFloat(allocatedAmount || 0).toLocaleString()}`} />
            <DetailRow label="Assigned By" value={assigner?.fullName || assigner?.email} />
          </DetailSection>

          <DetailSection title="Completion Details" icon={<IoCheckmarkDoneCircleOutline size={22} />}>
            <DetailRow label="Submitted On" value={workSubmittedAt} isDate />
            <DetailRow label="Verified On" value={workVerifiedAt} isDate />
            <DetailRow label="Verified By" value={verifier?.fullName || verifier?.email} icon={<FiUserCheck />} />
          </DetailSection>

          <DetailSection title="Feedback & Review" icon={<IoStarOutline size={22} />}>
            <DetailRow label="Performance Feedback" value={performanceFeedback || 'N/A'} />
            <div className="md:col-span-2">
              <DetailRow 
                label="Manager's Verification Notes" 
                value={verificationNotes} 
                isCode 
              />
            </div>
          </DetailSection>
          
          <DetailSection title="Your Submission" icon={<IoDocumentTextOutline size={22} />}>
            <div className="md:col-span-2">
              <DetailRow 
                label="Your Submission Notes" 
                value={workSubmissionNotes}
                isCode
              />
            </div>
            <div className="md:col-span-2">
              <DetailRow 
                label="Your Deliverables" 
                value={actualDeliverables}
                isCode
              />
            </div>
          </DetailSection>

          <DetailSection title="Original Scope" icon={<IoCodeSlashOutline size={22} />}>
            <div className="md:col-span-2">
              <DetailRow label="Original Responsibilities" value={parseJsonArray(responsibilities)} />
            </div>
            <div className="md:col-span-2">
              <DetailRow label="Original Deliverables" value={deliverables ? [deliverables] : []} />
            </div>
          </DetailSection>

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