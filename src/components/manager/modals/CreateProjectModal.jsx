import React, { useState } from 'react';
import { createProject } from '../../../api/manager/project';
import Toaster from '../../Toaster';
import { IoMdClose } from 'react-icons/io';
import { FormInput, FormSelect, FormTextarea } from '../../atoms/FormFields';
import { FiTrash2 } from 'react-icons/fi';

const CreateProjectModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectType: 'quoted',
    customProjectType: '',
    startDate: '',
    deadline: '',
    estimatedHours: '',
    estimatedConsumables: {
      technologies: [],
      frameworks: [],
      programmingLanguages: [],
      database: '',
      cloudProvider: ''
    },
    actualConsumables: {
      technologies: [],
      frameworks: [],
      programmingLanguages: [],
      database: '',
      cloudProvider: ''
    },
    priority: 'medium',
    budget: '',
    currency: 'USD',
    billingType: 'fixed_price',
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    referenceLinks: [],
    milestones: [],
    risks: [],
    issues: [],
    testingStatus: 'not_started',
    notes: '',
    teamSize: '',
    teamLead: '',
    visibility: 'internal',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle consumables array fields (technologies, frameworks, etc.)
  const handleConsumableArrayChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData((prev) => ({
      ...prev,
      estimatedConsumables: {
        ...prev.estimatedConsumables,
        [field]: items
      }
    }));
  };

  const handleConsumableStringChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      estimatedConsumables: {
        ...prev.estimatedConsumables,
        [field]: value
      }
    }));
  };

  // Handle risks
  const handleAddRisk = () => {
    setFormData((prev) => ({
      ...prev,
      risks: [...prev.risks, { description: '', severity: 'medium', mitigation: '', status: 'open' }]
    }));
  };

  const handleRemoveRisk = (index) => {
    const updatedRisks = formData.risks.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, risks: updatedRisks }));
  };

  const handleRiskChange = (index, field, value) => {
    const updatedRisks = [...formData.risks];
    updatedRisks[index][field] = value;
    setFormData((prev) => ({ ...prev, risks: updatedRisks }));
  };

  // Handle issues
  const handleAddIssue = () => {
    setFormData((prev) => ({
      ...prev,
      issues: [...prev.issues, { description: '', priority: 'medium', assignedTo: '', status: 'open' }]
    }));
  };

  const handleRemoveIssue = (index) => {
    const updatedIssues = formData.issues.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, issues: updatedIssues }));
  };

  const handleIssueChange = (index, field, value) => {
    const updatedIssues = [...formData.issues];
    updatedIssues[index][field] = value;
    setFormData((prev) => ({ ...prev, issues: updatedIssues }));
  };

  // Handle reference links
  const handleAddReferenceLink = () => {
    setFormData((prev) => ({
      ...prev,
      referenceLinks: [...prev.referenceLinks, { title: '', url: '' }]
    }));
  };

  const handleRemoveReferenceLink = (index) => {
    const updatedLinks = formData.referenceLinks.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, referenceLinks: updatedLinks }));
  };

  const handleReferenceLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.referenceLinks];
    updatedLinks[index][field] = value;
    setFormData((prev) => ({ ...prev, referenceLinks: updatedLinks }));
  };

  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = [...formData.milestones];
    updatedMilestones[index][field] = value;
    setFormData((prev) => ({ ...prev, milestones: updatedMilestones }));
  };
  const handleAddMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        { name: '', description: '', deadline: '', status: '', completedDate: '' },
      ],
    }));
  };
  const handleRemoveMilestone = (index) => {
    const updated = [...formData.milestones];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, milestones: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = { ...formData };
    const userIdString = localStorage.getItem("userId");
    const userId = parseInt(userIdString, 10);
    payload.createdBy = userId;
    Object.keys(payload).forEach((key) => {
      if (payload[key] === '' && typeof payload[key] === 'string') {
        payload[key] = null;
      }
    });
    if (!payload.estimatedConsumables.technologies.length &&
      !payload.estimatedConsumables.frameworks.length &&
      !payload.estimatedConsumables.programmingLanguages.length &&
      !payload.estimatedConsumables.database &&
      !payload.estimatedConsumables.cloudProvider) {
      // Keep the structure but with empty values
      payload.estimatedConsumables = {
        technologies: [],
        frameworks: [],
        programmingLanguages: [],
        database: '',
        cloudProvider: ''
      };
    }

    if (!payload.createdBy) {
      setToast({
        show: true,
        message: 'Error: User ID is missing. Cannot create project.',
        type: 'error',
      });
      setIsLoading(false);
      return; // Stop the submission
    }

    try {
      const response = await createProject(payload);
      if (response.success) {
        setToast({
          show: true,
          message: 'Project created successfully!',
          type: 'success',
        });
        onSuccess();
        setTimeout(() => onClose(), 1500);
      } else {
        setToast({
          show: true,
          message: response.message || 'Failed to create project.',
          type: 'error',
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: error.message || 'An unexpected error occurred.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-3xl border border-white/20 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-9 pb-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Create New Project</h2>
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-6 right-6 text-gray-400 hover:text-white"
          >
            <IoMdClose size={24} />
          </button>
        </div>


        {toast.show && (
          <div className="absolute top-20 right-6 z-20">
            <Toaster
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ ...toast, show: false })}
            />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-9 space-y-6">
          {/* === BASIC INFO === */}
          <Section title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput id="name" label="Project Name" value={formData.name} onChange={handleChange} required />
              <FormSelect id="projectType" label="Project Type" value={formData.projectType} onChange={handleChange} required>
                <option value="quoted">Quoted</option>
                <option value="time and materials">Time and Materials</option>
                <option value="other">Other</option>
              </FormSelect>
            </div>
            {formData.projectType === 'other' && (
              <FormInput id="customProjectType" label="Custom Project Type" value={formData.customProjectType} onChange={handleChange} placeholder="Specify project type" />
            )}
            <FormTextarea id="description" label="Description" value={formData.description} onChange={handleChange} />
          </Section>

          {/* === TIMELINE === */}
          <Section title="Timeline">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput id="startDate" label="Start Date" type="date" value={formData.startDate} onChange={handleChange} required />
              <FormInput id="deadline" label="Deadline" type="date" value={formData.deadline} onChange={handleChange} required />
              <FormInput id="estimatedHours" label="Estimated Hours" type="number" value={formData.estimatedHours} onChange={handleChange} />
              <FormSelect id="priority" label="Priority" value={formData.priority} onChange={handleChange} required>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </FormSelect>
            </div>
          </Section>

          {/* === FINANCIAL === */}
          <Section title="Financial">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput id="budget" label="Budget" type="number" value={formData.budget} onChange={handleChange} />
              <FormSelect id="currency" label="Currency" value={formData.currency} onChange={handleChange}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="INR">INR</option>
              </FormSelect>
              <FormSelect id="billingType" label="Billing Type" value={formData.billingType} onChange={handleChange}>
                <option value="fixed_price">Fixed Price</option>
                <option value="hourly">Hourly</option>
                <option value="monthly_retainer">Monthly Retainer</option>
                <option value="milestone_based">Milestone Based</option>
                <option value="other">Other</option>
              </FormSelect>
            </div>
          </Section>

          {/* === COMPANY INFO === */}
          <Section title="Company Information (Optional)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput id="companyName" label="Company Name" value={formData.companyName} onChange={handleChange} />
              <FormInput id="companyEmail" label="Company Email" type="email" value={formData.companyEmail} onChange={handleChange} />
              <FormInput id="companyPhone" label="Company Phone" value={formData.companyPhone} onChange={handleChange} />
            </div>
          </Section>

          {/* === REFERENCE LINKS === */}
          <Section title="Reference Links (Optional)">
            {formData.referenceLinks.length > 0 ? (
              formData.referenceLinks.map((link, index) => (
                <div key={index} className="border border-gray-700 bg-gray-800 p-4 rounded-lg mb-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      id={`link-title-${index}`}
                      label="Title"
                      value={link.title}
                      onChange={(e) => handleReferenceLinkChange(index, 'title', e.target.value)}
                    />
                    <FormInput
                      id={`link-url-${index}`}
                      label="URL"
                      type="url"
                      value={link.url}
                      onChange={(e) => handleReferenceLinkChange(index, 'url', e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveReferenceLink(index)}
                      className="text-red-400 cursor-pointer hover:text-red-500 font-bold"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm mb-2">No reference links added yet.</p>
            )}
            <button
              type="button"
              onClick={handleAddReferenceLink}
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-md transition-colors"
            >
              + Add Reference Link
            </button>
          </Section>

          {/* === MILESTONES === */}
          <Section title="Project Milestones">
            {formData.milestones.length > 0 ? (
              formData.milestones.map((milestone, index) => (
                <div key={index} className="border border-gray-700 bg-gray-800 p-4 rounded-lg mb-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      id={`milestone-name-${index}`}
                      label="Milestone Name"
                      value={milestone.name}
                      onChange={(e) => handleMilestoneChange(index, 'name', e.target.value)}
                    />
                    <FormInput
                      id={`milestone-deadline-${index}`}
                      type="date"
                      label="Deadline"
                      value={milestone.deadline}
                      onChange={(e) => handleMilestoneChange(index, 'deadline', e.target.value)}
                    />
                  </div>

                  <FormTextarea
                    id={`milestone-description-${index}`}
                    label="Description"
                    rows={2}
                    value={milestone.description}
                    onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormSelect
                      id={`milestone-status-${index}`}
                      label="Status"
                      value={milestone.status}
                      onChange={(e) => handleMilestoneChange(index, 'status', e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </FormSelect>

                    {milestone.status === 'completed' && (
                      <FormInput
                        id={`milestone-completedDate-${index}`}
                        type="date"
                        label="Completed Date"
                        value={milestone.completedDate || ''}
                        onChange={(e) => handleMilestoneChange(index, 'completedDate', e.target.value)}
                      />
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(index)}
                      className="text-red-400 cursor-pointer hover:text-red-500 font-bold"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm mb-2">No milestones added yet.</p>
            )}

            <button
              type="button"
              onClick={handleAddMilestone}
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-md transition-colors"
            >
              + Add Milestone
            </button>
          </Section>

          {/* === TEAM === */}
          <Section title="Team & Settings">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormInput id="teamSize" label="Team Size" type="number" value={formData.teamSize} onChange={handleChange} />
              <FormInput id="teamLead" label="Team Lead ID" value={formData.teamLead} onChange={handleChange} />
              <FormSelect id="visibility" label="Visibility" value={formData.visibility} onChange={handleChange}>
                <option value="internal">Internal</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </FormSelect>
              <FormSelect id="testingStatus" label="Testing Status" value={formData.testingStatus} onChange={handleChange}>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </FormSelect>
            </div>
          </Section>

          {/* === RISKS === */}
          <Section title="Project Risks">
            {formData.risks.length > 0 ? (
              formData.risks.map((risk, index) => (
                <div key={index} className="border border-gray-700 bg-gray-800 p-4 rounded-lg mb-4 space-y-3">
                  <FormTextarea
                    id={`risk-description-${index}`}
                    label="Description"
                    rows={2}
                    value={risk.description}
                    onChange={(e) => handleRiskChange(index, 'description', e.target.value)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormSelect
                      id={`risk-severity-${index}`}
                      label="Severity"
                      value={risk.severity}
                      onChange={(e) => handleRiskChange(index, 'severity', e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </FormSelect>
                    <FormSelect
                      id={`risk-status-${index}`}
                      label="Status"
                      value={risk.status}
                      onChange={(e) => handleRiskChange(index, 'status', e.target.value)}
                    >
                      <option value="open">Open</option>
                      <option value="mitigated">Mitigated</option>
                      <option value="closed">Closed</option>
                    </FormSelect>
                  </div>
                  <FormInput
                    id={`risk-mitigation-${index}`}
                    label="Mitigation Strategy"
                    value={risk.mitigation}
                    onChange={(e) => handleRiskChange(index, 'mitigation', e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveRisk(index)}
                      className="text-red-400 cursor-pointer hover:text-red-500 font-bold"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm mb-2">No risks added yet.</p>
            )}
            <button
              type="button"
              onClick={handleAddRisk}
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-md transition-colors"
            >
              + Add Risk
            </button>
          </Section>

          {/* === ISSUES === */}
          <Section title="Project Issues">
            {formData.issues.length > 0 ? (
              formData.issues.map((issue, index) => (
                <div key={index} className="border border-gray-700 bg-gray-800 p-4 rounded-lg mb-4 space-y-3">
                  <FormTextarea
                    id={`issue-description-${index}`}
                    label="Description"
                    rows={2}
                    value={issue.description}
                    onChange={(e) => handleIssueChange(index, 'description', e.target.value)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormSelect
                      id={`issue-priority-${index}`}
                      label="Priority"
                      value={issue.priority}
                      onChange={(e) => handleIssueChange(index, 'priority', e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </FormSelect>
                    <FormSelect
                      id={`issue-status-${index}`}
                      label="Status"
                      value={issue.status}
                      onChange={(e) => handleIssueChange(index, 'status', e.gittarget.value)}
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </FormSelect>
                    <FormInput
                      id={`issue-assignedTo-${index}`}
                      label="Assigned To (User ID)"
                      type="number"
                      value={issue.assignedTo}
                      onChange={(e) => handleIssueChange(index, 'assignedTo', e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveIssue(index)}
                      className="text-red-400 cursor-pointer hover:text-red-500 font-bold"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm mb-2">No issues added yet.</p>
            )}
            <button
              type="button"
              onClick={handleAddIssue}
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-md transition-colors"
            >
              + Add Issue
            </button>
          </Section>

          {/* === NOTES === */}
          <Section title="Additional Notes">
            <FormTextarea id="notes" label="Notes" value={formData.notes} onChange={handleChange} rows={3} />
          </Section>
        </form>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-4 p-6 pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit} // This is fine here, but the form's onSubmit handles it
            className="btn"
          >
            {isLoading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component
const Section = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold text-purple-300 border-b border-gray-700 pb-2 mb-2">{title}</h3>
    {children}
  </div>
);

export default CreateProjectModal;  