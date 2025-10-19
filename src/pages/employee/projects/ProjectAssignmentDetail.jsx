import {
  IoArrowBack,
  IoBusinessOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoPersonOutline,
  IoChatbubblesOutline,
  IoCheckmarkDoneCircleOutline,
} from 'react-icons/io5';
import { formatDate } from '../../../components/atoms/FormatedDate';
import SubmitWorkModal from '../../../components/modals/SubmitWorkModal'; 

const DetailRow = ({ label, value, isTag = false, isDate = false }) => {
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
  } else {
    displayValue = <span className="text-gray-200 break-words">{value}</span>;
  }

  return (
    <div className="p-0"> 
      <strong className="text-sm font-medium text-gray-400 block mb-0.5 uppercase tracking-wide">
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

// --- New Detail Page Component ---
const ProjectAssignmentDetail = ({ assignment, onBack, onOpenChatModal, onOpenSubmitModal }) => {
  const { project, assigner, role, allocatedAmount, paymentSchedule, paymentTerms, responsibilities, deliverables, workStatus } = assignment;

  const parseJsonArray = (str) => {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return []; // Return empty array on error
    }
  };
  
  const isWorkSubmitted = workStatus === 'pending_review' || workStatus === 'completed';

  return (
    <div>
      {/* --- Header with Actions --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <button
          onClick={onBack}
          className="flex items-center cursor-pointer gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <IoArrowBack size={20} />
          <span>Back to Projects</span>
        </button>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenChatModal}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <IoChatbubblesOutline />
            <span>Chat</span>
          </button>
          <button
            onClick={onOpenSubmitModal}
            disabled={isWorkSubmitted}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-600 disabled:opacity-50"
          >
            <IoCheckmarkDoneCircleOutline />
            <span>{isWorkSubmitted ? 'Work Submitted' : 'Submit Work'}</span>
          </button>
        </div>
      </div>

      {/* Project Info Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">{project.name}</h1>
        <p className="text-gray-400 mt-1">{project.description}</p>
      </div>
      
      <div className="space-y-6">
        {/* Your Assignment Details */}
        <DetailSection title="Your Assignment" icon={<IoPersonOutline size={20} />}>
          <DetailRow label="Your Role" value={role} isTag />
          <DetailRow label="Work Status" value={workStatus} isTag />
          <DetailRow label="Assigned By" value={assigner.fullName || assigner.email} />
          <DetailRow label="Allocated Amount" value={`$${parseFloat(allocatedAmount || 0).toLocaleString()}`} />
          <DetailRow label="Payment Schedule" value={paymentSchedule} isTag />
          <DetailRow label="Payment Terms" value={paymentTerms} />
        </DetailSection>

        {/* Project Details */}
        <DetailSection title="Project Details" icon={<IoBusinessOutline size={20} />}>
          <DetailRow label="Project Status" value={project.status} isTag />
          <DetailRow label="Project Priority" value={project.priority} isTag />
          <DetailRow label="Category" value={project.category} />
        </DetailSection>

        {/* Timeline */}
        <DetailSection title="Timeline" icon={<IoCalendarOutline size={20} />}>
          <DetailRow label="Project Deadline" value={project.deadline} isDate />
          <DetailRow label="Assignment Accepted" value={assignment.acceptedAt} isDate />
          <DetailRow label="Work Started" value={assignment.workStartedAt} isDate />
        </DetailSection>

        {/* Responsibilities & Deliverables */}
        <DetailSection title="Scope" icon={<IoDocumentTextOutline size={20} />}>
          <DetailRow label="Responsibilities" value={parseJsonArray(responsibilities)} />
          <DetailRow label="Deliverables" value={deliverables || []} />
        </DetailSection>
      </div>
    </div>
  );
};

export default ProjectAssignmentDetail;